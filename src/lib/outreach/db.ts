import postgres from "postgres";
import { randomBytes } from "node:crypto";
import { db as adminDb } from "@/lib/admin/db";

/**
 * Outreach: de Claude-routine vindt bedrijven en events, schrijft per
 * prospect een persoonlijke mail en levert die hier af (status 'klaar').
 * De verzend-cron stuurt ze daarna in porties via Resend.
 */

export type ProspectStatus = "klaar" | "verzonden" | "afgewezen" | "afgemeld" | "fout";
export type ProspectSoort = "bedrijf" | "event";

export type Prospect = {
  id: number;
  soort: ProspectSoort;
  naam: string;
  website: string;
  domein: string;
  email: string;
  contactpersoon: string | null;
  plaats: string | null;
  branche: string | null;
  heeft_video: boolean | null;
  bevindingen: string;
  onderwerp: string;
  tekst: string;
  status: ProspectStatus;
  afmeld_token: string;
  verzonden_op: string | null;
  fout: string | null;
  created_at: string;
};

export type OutreachConfig = { aan: boolean; per_dag: number };

declare global {
  var __outreachSchemaKlaar: Promise<void> | undefined;
}

async function maakSchema(sql: postgres.Sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS prospects (
      id SERIAL PRIMARY KEY,
      soort TEXT NOT NULL,
      naam TEXT NOT NULL,
      website TEXT NOT NULL,
      domein TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL,
      contactpersoon TEXT,
      plaats TEXT,
      branche TEXT,
      heeft_video BOOLEAN,
      bevindingen TEXT NOT NULL,
      onderwerp TEXT NOT NULL,
      tekst TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'klaar',
      afmeld_token TEXT NOT NULL UNIQUE,
      verzonden_op TIMESTAMPTZ,
      fout TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`;
  await sql`CREATE INDEX IF NOT EXISTS prospects_status_idx ON prospects (status, created_at)`;
  await sql`CREATE INDEX IF NOT EXISTS prospects_email_idx ON prospects (lower(email))`;
  await sql`
    CREATE TABLE IF NOT EXISTS outreach_config (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      aan BOOLEAN NOT NULL DEFAULT true,
      per_dag INTEGER NOT NULL DEFAULT 10
    )`;
  await sql`INSERT INTO outreach_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING`;
}

export async function db() {
  const sql = await adminDb();
  globalThis.__outreachSchemaKlaar ??= maakSchema(sql).catch((e) => {
    globalThis.__outreachSchemaKlaar = undefined;
    throw e;
  });
  await globalThis.__outreachSchemaKlaar;
  return sql;
}

function alsProspect(r: postgres.Row): Prospect {
  return {
    id: r.id,
    soort: r.soort,
    naam: r.naam,
    website: r.website,
    domein: r.domein,
    email: r.email,
    contactpersoon: r.contactpersoon,
    plaats: r.plaats,
    branche: r.branche,
    heeft_video: r.heeft_video,
    bevindingen: r.bevindingen,
    onderwerp: r.onderwerp,
    tekst: r.tekst,
    status: r.status,
    afmeld_token: r.afmeld_token,
    verzonden_op: r.verzonden_op ? String(r.verzonden_op) : null,
    fout: r.fout,
    created_at: String(r.created_at),
  };
}

/** "www.Voorbeeld.nl" -> "voorbeeld.nl" */
export function normaliseerDomein(host: string): string {
  return host.trim().toLowerCase().replace(/^www\./, "").replace(/\.$/, "");
}

/* ---------- config ---------- */

export async function getConfig(): Promise<OutreachConfig> {
  const sql = await db();
  const [r] = await sql`SELECT aan, per_dag FROM outreach_config WHERE id = 1`;
  return { aan: r.aan, per_dag: r.per_dag };
}

export async function zetConfig(c: OutreachConfig): Promise<void> {
  const sql = await db();
  await sql`UPDATE outreach_config SET aan = ${c.aan}, per_dag = ${c.per_dag} WHERE id = 1`;
}

/* ---------- voor de routine ---------- */

/** Alle domeinen die al bekend zijn: prospects (elke status) + bestaande klanten. */
export async function bekendeDomeinen(): Promise<string[]> {
  const sql = await db();
  const rijen = await sql`
    SELECT domein FROM prospects
    UNION
    SELECT lower(split_part(email, '@', 2)) FROM klanten WHERE email LIKE '%@%'`;
  return rijen.map((r) => normaliseerDomein(String(r.domein))).filter(Boolean);
}

export async function aantalVandaagAangemaakt(): Promise<number> {
  const sql = await db();
  const [r] = await sql`
    SELECT count(*)::int AS n FROM prospects
    WHERE created_at >= date_trunc('day', now() AT TIME ZONE 'Europe/Amsterdam') AT TIME ZONE 'Europe/Amsterdam'`;
  return r.n;
}

/** Waarom deze prospect niet nieuw is, of null als hij nieuw is. */
export async function dubbelReden(
  domein: string,
  email: string,
  tekst: string
): Promise<string | null> {
  const sql = await db();
  const emailDomein = normaliseerDomein(email.split("@")[1] ?? "");
  const rijen = await sql`
    SELECT
      EXISTS (SELECT 1 FROM prospects WHERE domein = ${domein}) AS domein,
      EXISTS (SELECT 1 FROM prospects WHERE lower(email) = ${email.toLowerCase()}) AS email,
      EXISTS (SELECT 1 FROM prospects WHERE tekst = ${tekst}) AS tekst,
      EXISTS (
        SELECT 1 FROM klanten
        WHERE lower(split_part(email, '@', 2)) IN (${domein}, ${emailDomein})
      ) AS klant`;
  const r = rijen[0];
  if (r.klant) return "Dit is al een klant van Jager Producties.";
  if (r.domein) return "Dit domein staat al in de outreach-lijst.";
  if (r.email) return "Dit e-mailadres staat al in de outreach-lijst.";
  if (r.tekst) return "Deze mailtekst is al voor een andere prospect gebruikt.";
  return null;
}

export async function maakProspect(
  p: Omit<Prospect, "id" | "status" | "afmeld_token" | "verzonden_op" | "fout" | "created_at">
): Promise<number> {
  const sql = await db();
  const token = randomBytes(16).toString("hex");
  const [r] = await sql`
    INSERT INTO prospects (soort, naam, website, domein, email, contactpersoon, plaats, branche,
      heeft_video, bevindingen, onderwerp, tekst, afmeld_token)
    VALUES (${p.soort}, ${p.naam}, ${p.website}, ${p.domein}, ${p.email}, ${p.contactpersoon},
      ${p.plaats}, ${p.branche}, ${p.heeft_video}, ${p.bevindingen}, ${p.onderwerp}, ${p.tekst}, ${token})
    RETURNING id`;
  return r.id;
}

/* ---------- admin ---------- */

export async function prospectsMetStatus(status: ProspectStatus | "alle"): Promise<Prospect[]> {
  const sql = await db();
  const rijen =
    status === "alle"
      ? await sql`SELECT * FROM prospects ORDER BY created_at DESC LIMIT 300`
      : await sql`SELECT * FROM prospects WHERE status = ${status} ORDER BY created_at DESC LIMIT 300`;
  return rijen.map(alsProspect);
}

export async function tellingPerStatus(): Promise<Record<string, number>> {
  const sql = await db();
  const rijen = await sql`SELECT status, count(*)::int AS n FROM prospects GROUP BY status`;
  return Object.fromEntries(rijen.map((r) => [r.status, r.n]));
}

export async function getProspect(id: number): Promise<Prospect | null> {
  const sql = await db();
  const rijen = await sql`SELECT * FROM prospects WHERE id = ${id}`;
  return rijen[0] ? alsProspect(rijen[0]) : null;
}

export async function updateMailtekst(id: number, onderwerp: string, tekst: string): Promise<void> {
  const sql = await db();
  await sql`UPDATE prospects SET onderwerp = ${onderwerp}, tekst = ${tekst} WHERE id = ${id} AND status IN ('klaar', 'fout')`;
}

export async function zetStatus(id: number, status: ProspectStatus): Promise<void> {
  const sql = await db();
  await sql`UPDATE prospects SET status = ${status} WHERE id = ${id}`;
}

/* ---------- verzenden ---------- */

export async function aantalVandaagVerzonden(): Promise<number> {
  const sql = await db();
  const [r] = await sql`
    SELECT count(*)::int AS n FROM prospects
    WHERE verzonden_op >= date_trunc('day', now() AT TIME ZONE 'Europe/Amsterdam') AT TIME ZONE 'Europe/Amsterdam'`;
  return r.n;
}

/**
 * Prospects die klaarstaan en minstens `wachtUren` oud zijn, oudste eerst.
 * De wachttijd geeft Remy ruimte om een mail in de admin aan te passen of
 * tegen te houden voordat de cron hem verstuurt.
 */
export async function teVersturen(limit: number, wachtUren: number): Promise<Prospect[]> {
  if (limit <= 0) return [];
  const sql = await db();
  const rijen = await sql`
    SELECT * FROM prospects
    WHERE status = 'klaar' AND created_at <= now() - make_interval(hours => ${wachtUren})
    ORDER BY created_at
    LIMIT ${limit}`;
  return rijen.map(alsProspect);
}

export async function markeerVerzonden(id: number): Promise<void> {
  const sql = await db();
  await sql`UPDATE prospects SET status = 'verzonden', verzonden_op = now(), fout = NULL WHERE id = ${id}`;
}

export async function markeerFout(id: number, fout: string): Promise<void> {
  const sql = await db();
  await sql`UPDATE prospects SET status = 'fout', fout = ${fout.slice(0, 500)} WHERE id = ${id}`;
}

/** Afmelden via de link in de mail. Geeft de naam terug, of null bij een onbekend token. */
export async function afmelden(token: string): Promise<string | null> {
  if (!/^[a-f0-9]{32}$/.test(token)) return null;
  const sql = await db();
  const rijen = await sql`
    UPDATE prospects SET status = 'afgemeld' WHERE afmeld_token = ${token}
    RETURNING naam`;
  return rijen[0]?.naam ?? null;
}
