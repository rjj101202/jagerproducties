import postgres from "postgres";
import {
  Factuur,
  FactuurRegel,
  FactuurStatus,
  Instellingen,
  Klant,
  STANDAARD_INSTELLINGEN,
} from "./types";

declare global {
  // Hergebruik de verbinding over hot reloads en serverless-invocaties heen
  var __adminSql: ReturnType<typeof postgres> | undefined;
  var __adminSchemaKlaar: Promise<void> | undefined;
}

function verbinding() {
  const url = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL ontbreekt. Maak een (gratis) Postgres-database aan — zie README-ADMIN.md."
    );
  }
  globalThis.__adminSql ??= postgres(url, {
    ssl: url.includes("localhost") ? undefined : "require",
    max: 1,
  });
  return globalThis.__adminSql;
}

async function maakSchema(sql: ReturnType<typeof postgres>) {
  await sql`
    CREATE TABLE IF NOT EXISTS klanten (
      id SERIAL PRIMARY KEY,
      naam TEXT NOT NULL,
      contactpersoon TEXT,
      email TEXT NOT NULL,
      adres TEXT,
      postcode TEXT,
      plaats TEXT,
      btw_nummer TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`;
  await sql`
    CREATE TABLE IF NOT EXISTS facturen (
      id SERIAL PRIMARY KEY,
      nummer TEXT NOT NULL UNIQUE,
      klant_id INTEGER NOT NULL REFERENCES klanten(id),
      datum DATE NOT NULL,
      vervaldatum DATE NOT NULL,
      regels JSONB NOT NULL,
      opmerking TEXT,
      status TEXT NOT NULL DEFAULT 'concept',
      qr_token TEXT NOT NULL UNIQUE,
      verzonden_op TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`;
  await sql`
    CREATE TABLE IF NOT EXISTS instellingen (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      data JSONB NOT NULL
    )`;
}

export async function db() {
  const sql = verbinding();
  globalThis.__adminSchemaKlaar ??= maakSchema(sql).catch((e) => {
    globalThis.__adminSchemaKlaar = undefined;
    throw e;
  });
  await globalThis.__adminSchemaKlaar;
  return sql;
}

/* ---------- instellingen ---------- */

export async function getInstellingen(): Promise<Instellingen> {
  const sql = await db();
  const rijen = await sql`SELECT data FROM instellingen WHERE id = 1`;
  return { ...STANDAARD_INSTELLINGEN, ...(rijen[0]?.data ?? {}) };
}

export async function zetInstellingen(data: Instellingen): Promise<void> {
  const sql = await db();
  await sql`
    INSERT INTO instellingen (id, data) VALUES (1, ${sql.json(data)})
    ON CONFLICT (id) DO UPDATE SET data = ${sql.json(data)}`;
}

/* ---------- klanten ---------- */

function alsKlant(r: postgres.Row): Klant {
  return {
    id: r.id,
    naam: r.naam,
    contactpersoon: r.contactpersoon,
    email: r.email,
    adres: r.adres,
    postcode: r.postcode,
    plaats: r.plaats,
    btw_nummer: r.btw_nummer,
    created_at: String(r.created_at),
  };
}

export async function alleKlanten(): Promise<Klant[]> {
  const sql = await db();
  const rijen = await sql`SELECT * FROM klanten ORDER BY naam`;
  return rijen.map(alsKlant);
}

export async function getKlant(id: number): Promise<Klant | null> {
  const sql = await db();
  const rijen = await sql`SELECT * FROM klanten WHERE id = ${id}`;
  return rijen[0] ? alsKlant(rijen[0]) : null;
}

export async function maakKlant(k: Omit<Klant, "id" | "created_at">): Promise<number> {
  const sql = await db();
  const rijen = await sql`
    INSERT INTO klanten (naam, contactpersoon, email, adres, postcode, plaats, btw_nummer)
    VALUES (${k.naam}, ${k.contactpersoon}, ${k.email}, ${k.adres}, ${k.postcode}, ${k.plaats}, ${k.btw_nummer})
    RETURNING id`;
  return rijen[0].id;
}

export async function updateKlant(id: number, k: Omit<Klant, "id" | "created_at">): Promise<void> {
  const sql = await db();
  await sql`
    UPDATE klanten SET
      naam = ${k.naam}, contactpersoon = ${k.contactpersoon}, email = ${k.email},
      adres = ${k.adres}, postcode = ${k.postcode}, plaats = ${k.plaats}, btw_nummer = ${k.btw_nummer}
    WHERE id = ${id}`;
}

export async function verwijderKlant(id: number): Promise<void> {
  const sql = await db();
  await sql`DELETE FROM klanten WHERE id = ${id}`;
}

/* ---------- facturen ---------- */

function alsFactuur(r: postgres.Row): Factuur {
  return {
    id: r.id,
    nummer: r.nummer,
    klant_id: r.klant_id,
    datum: isoDatum(r.datum),
    vervaldatum: isoDatum(r.vervaldatum),
    regels: r.regels as FactuurRegel[],
    opmerking: r.opmerking,
    status: r.status as FactuurStatus,
    qr_token: r.qr_token,
    verzonden_op: r.verzonden_op ? String(r.verzonden_op) : null,
    created_at: String(r.created_at),
  };
}

function isoDatum(d: unknown): string {
  if (d instanceof Date) return d.toISOString().slice(0, 10);
  return String(d).slice(0, 10);
}

export async function alleFacturen(): Promise<(Factuur & { klant_naam: string })[]> {
  const sql = await db();
  const rijen = await sql`
    SELECT f.*, k.naam AS klant_naam
    FROM facturen f JOIN klanten k ON k.id = f.klant_id
    ORDER BY f.nummer DESC`;
  return rijen.map((r) => ({ ...alsFactuur(r), klant_naam: r.klant_naam }));
}

export async function getFactuur(id: number): Promise<Factuur | null> {
  const sql = await db();
  const rijen = await sql`SELECT * FROM facturen WHERE id = ${id}`;
  return rijen[0] ? alsFactuur(rijen[0]) : null;
}

export async function getFactuurViaToken(token: string): Promise<Factuur | null> {
  const sql = await db();
  const rijen = await sql`SELECT * FROM facturen WHERE qr_token = ${token}`;
  return rijen[0] ? alsFactuur(rijen[0]) : null;
}

export async function maakFactuur(f: {
  nummer: string;
  klant_id: number;
  datum: string;
  vervaldatum: string;
  regels: FactuurRegel[];
  opmerking: string | null;
  qr_token: string;
}): Promise<number> {
  const sql = await db();
  const rijen = await sql`
    INSERT INTO facturen (nummer, klant_id, datum, vervaldatum, regels, opmerking, qr_token)
    VALUES (${f.nummer}, ${f.klant_id}, ${f.datum}, ${f.vervaldatum}, ${sql.json(f.regels)}, ${f.opmerking}, ${f.qr_token})
    RETURNING id`;
  return rijen[0].id;
}

export async function updateFactuur(
  id: number,
  f: { klant_id: number; datum: string; vervaldatum: string; regels: FactuurRegel[]; opmerking: string | null }
): Promise<void> {
  const sql = await db();
  await sql`
    UPDATE facturen SET
      klant_id = ${f.klant_id}, datum = ${f.datum}, vervaldatum = ${f.vervaldatum},
      regels = ${sql.json(f.regels)}, opmerking = ${f.opmerking}
    WHERE id = ${id}`;
}

export async function zetFactuurStatus(id: number, status: FactuurStatus): Promise<void> {
  const sql = await db();
  if (status === "verzonden") {
    await sql`UPDATE facturen SET status = ${status}, verzonden_op = now() WHERE id = ${id}`;
  } else {
    await sql`UPDATE facturen SET status = ${status} WHERE id = ${id}`;
  }
}

export async function verwijderFactuur(id: number): Promise<void> {
  const sql = await db();
  await sql`DELETE FROM facturen WHERE id = ${id}`;
}

/** Reserveert het volgende factuurnummer (bijv. 2026-007) en hoogt de teller op. */
export async function volgendFactuurnummer(): Promise<string> {
  const instellingen = await getInstellingen();
  const n = instellingen.volgnummer;
  await zetInstellingen({ ...instellingen, volgnummer: n + 1 });
  const jaar = new Date().getFullYear();
  return `${jaar}-${String(n).padStart(3, "0")}`;
}
