"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  logIn,
  logUit,
  nieuwToken,
  vereisAdminOfGooi,
  wachtwoordKlopt,
} from "@/lib/admin/auth";
import {
  getFactuur,
  getInstellingen,
  getKlant,
  maakFactuur,
  maakKlant,
  updateFactuur,
  updateKlant,
  verwijderFactuur,
  verwijderKlant,
  volgendFactuurnummer,
  zetFactuurStatus,
  zetInstellingen,
} from "@/lib/admin/db";
import { verstuurFactuurMail } from "@/lib/admin/email";
import { FactuurRegel, parseEuro } from "@/lib/admin/types";

function tekst(formData: FormData, naam: string): string {
  return String(formData.get(naam) ?? "").trim();
}

function tekstOfNull(formData: FormData, naam: string): string | null {
  return tekst(formData, naam) || null;
}

function metFout(pad: string, fout: unknown): never {
  const msg = fout instanceof Error ? fout.message : String(fout);
  redirect(`${pad}?fout=${encodeURIComponent(msg)}`);
}

/* ---------- inloggen ---------- */

export async function inloggenActie(formData: FormData): Promise<void> {
  if (!wachtwoordKlopt(tekst(formData, "wachtwoord"))) {
    redirect("/admin/login?fout=1");
  }
  await logIn();
  redirect("/admin");
}

export async function uitloggenActie(): Promise<void> {
  await logUit();
  redirect("/admin/login");
}

/* ---------- klanten ---------- */

function klantUitForm(formData: FormData) {
  const naam = tekst(formData, "naam");
  const email = tekst(formData, "email");
  if (!naam || !email) throw new Error("Naam en e-mailadres zijn verplicht.");
  return {
    naam,
    email,
    contactpersoon: tekstOfNull(formData, "contactpersoon"),
    adres: tekstOfNull(formData, "adres"),
    postcode: tekstOfNull(formData, "postcode"),
    plaats: tekstOfNull(formData, "plaats"),
    btw_nummer: tekstOfNull(formData, "btw_nummer"),
  };
}

export async function klantMakenActie(formData: FormData): Promise<void> {
  await vereisAdminOfGooi();
  try {
    await maakKlant(klantUitForm(formData));
  } catch (e) {
    metFout("/admin/klanten", e);
  }
  revalidatePath("/admin/klanten");
  redirect("/admin/klanten");
}

export async function klantBijwerkenActie(formData: FormData): Promise<void> {
  await vereisAdminOfGooi();
  const id = Number(formData.get("id"));
  try {
    await updateKlant(id, klantUitForm(formData));
  } catch (e) {
    metFout(`/admin/klanten/${id}`, e);
  }
  revalidatePath("/admin/klanten");
  redirect("/admin/klanten");
}

export async function klantVerwijderenActie(formData: FormData): Promise<void> {
  await vereisAdminOfGooi();
  const id = Number(formData.get("id"));
  try {
    await verwijderKlant(id);
  } catch {
    metFout(
      `/admin/klanten/${id}`,
      new Error("Verwijderen kan niet: er bestaan al facturen voor deze klant.")
    );
  }
  revalidatePath("/admin/klanten");
  redirect("/admin/klanten");
}

/* ---------- facturen ---------- */

function regelsUitForm(formData: FormData): FactuurRegel[] {
  const omschrijvingen = formData.getAll("regel_omschrijving").map(String);
  const aantallen = formData.getAll("regel_aantal").map(String);
  const prijzen = formData.getAll("regel_prijs").map(String);
  const btws = formData.getAll("regel_btw").map(String);

  const regels: FactuurRegel[] = [];
  for (let i = 0; i < omschrijvingen.length; i++) {
    const omschrijving = omschrijvingen[i].trim();
    if (!omschrijving && !prijzen[i]?.trim()) continue; // lege rij overslaan
    if (!omschrijving) throw new Error(`Regel ${i + 1} mist een omschrijving.`);
    const aantal = Number(String(aantallen[i]).replace(",", "."));
    if (!Number.isFinite(aantal) || aantal <= 0) {
      throw new Error(`Regel ${i + 1} heeft een ongeldig aantal.`);
    }
    regels.push({
      omschrijving,
      aantal,
      prijs_cent: parseEuro(prijzen[i] ?? ""),
      btw: Number(btws[i]),
    });
  }
  if (regels.length === 0) throw new Error("Voeg minstens één factuurregel toe.");
  return regels;
}

function factuurVeldenUitForm(formData: FormData) {
  const klant_id = Number(formData.get("klant_id"));
  const datum = tekst(formData, "datum");
  const vervaldatum = tekst(formData, "vervaldatum");
  if (!klant_id) throw new Error("Kies een klant.");
  if (!datum || !vervaldatum) throw new Error("Vul beide datums in.");
  return {
    klant_id,
    datum,
    vervaldatum,
    regels: regelsUitForm(formData),
    opmerking: tekstOfNull(formData, "opmerking"),
  };
}

export async function factuurMakenActie(formData: FormData): Promise<void> {
  await vereisAdminOfGooi();
  let id: number;
  try {
    const velden = factuurVeldenUitForm(formData);
    const nummer = await volgendFactuurnummer();
    id = await maakFactuur({ ...velden, nummer, qr_token: nieuwToken() });
  } catch (e) {
    metFout("/admin/facturen/nieuw", e);
  }
  revalidatePath("/admin/facturen");
  redirect(`/admin/facturen/${id}`);
}

export async function factuurBijwerkenActie(formData: FormData): Promise<void> {
  await vereisAdminOfGooi();
  const id = Number(formData.get("id"));
  try {
    const bestaand = await getFactuur(id);
    if (!bestaand) throw new Error("Factuur niet gevonden.");
    if (bestaand.status !== "concept") {
      throw new Error("Alleen conceptfacturen kunnen worden aangepast.");
    }
    await updateFactuur(id, factuurVeldenUitForm(formData));
  } catch (e) {
    metFout(`/admin/facturen/${id}/bewerken`, e);
  }
  revalidatePath(`/admin/facturen/${id}`);
  redirect(`/admin/facturen/${id}`);
}

export async function factuurVerwijderenActie(formData: FormData): Promise<void> {
  await vereisAdminOfGooi();
  const id = Number(formData.get("id"));
  try {
    const factuur = await getFactuur(id);
    if (!factuur) throw new Error("Factuur niet gevonden.");
    if (factuur.status !== "concept") {
      throw new Error("Alleen conceptfacturen kunnen worden verwijderd.");
    }
    await verwijderFactuur(id);
  } catch (e) {
    metFout(`/admin/facturen/${id}`, e);
  }
  revalidatePath("/admin/facturen");
  redirect("/admin/facturen");
}

export async function factuurVersturenActie(formData: FormData): Promise<void> {
  await vereisAdminOfGooi();
  const id = Number(formData.get("id"));
  try {
    const factuur = await getFactuur(id);
    if (!factuur) throw new Error("Factuur niet gevonden.");
    const klant = await getKlant(factuur.klant_id);
    if (!klant) throw new Error("Klant niet gevonden.");
    const instellingen = await getInstellingen();
    await verstuurFactuurMail(factuur, klant, instellingen);
    if (factuur.status === "concept") {
      await zetFactuurStatus(id, "verzonden");
    }
  } catch (e) {
    metFout(`/admin/facturen/${id}`, e);
  }
  revalidatePath(`/admin/facturen/${id}`);
  redirect(`/admin/facturen/${id}?verzonden=1`);
}

export async function factuurStatusActie(formData: FormData): Promise<void> {
  await vereisAdminOfGooi();
  const id = Number(formData.get("id"));
  const status = tekst(formData, "status");
  if (status !== "concept" && status !== "verzonden" && status !== "betaald") {
    throw new Error("Ongeldige status.");
  }
  await zetFactuurStatus(id, status);
  revalidatePath(`/admin/facturen/${id}`);
  redirect(`/admin/facturen/${id}`);
}

/* ---------- instellingen ---------- */

export async function instellingenOpslaanActie(formData: FormData): Promise<void> {
  await vereisAdminOfGooi();
  try {
    const huidig = await getInstellingen();
    const betaaltermijn = Number(formData.get("betaaltermijn"));
    const volgnummer = Number(formData.get("volgnummer"));
    await zetInstellingen({
      bedrijfsnaam: tekst(formData, "bedrijfsnaam") || huidig.bedrijfsnaam,
      naam_rekeninghouder: tekst(formData, "naam_rekeninghouder"),
      iban: tekst(formData, "iban").replace(/\s/g, "").toUpperCase(),
      btw_nummer: tekst(formData, "btw_nummer"),
      kvk: tekst(formData, "kvk"),
      adres: tekst(formData, "adres"),
      postcode: tekst(formData, "postcode"),
      plaats: tekst(formData, "plaats"),
      email: tekst(formData, "email") || huidig.email,
      telefoon: tekst(formData, "telefoon"),
      betaaltermijn: Number.isFinite(betaaltermijn) && betaaltermijn > 0 ? betaaltermijn : 14,
      volgnummer: Number.isFinite(volgnummer) && volgnummer > 0 ? volgnummer : huidig.volgnummer,
      voettekst: tekst(formData, "voettekst"),
    });
  } catch (e) {
    metFout("/admin/instellingen", e);
  }
  revalidatePath("/admin/instellingen");
  redirect("/admin/instellingen?opgeslagen=1");
}
