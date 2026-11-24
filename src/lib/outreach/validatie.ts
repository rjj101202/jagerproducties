import { normaliseerDomein, type ProspectSoort } from "./db";

/** Veiligheidsgrens tegen een routine die doordraait: max nieuwe prospects per dag. */
export const MAX_NIEUW_PER_DAG = 25;

export type NieuweProspect = {
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
};

function str(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function strOfNull(v: unknown, max: number): string | null {
  return str(v, max) || null;
}

const VERBODEN_IN_TEKST: { re: RegExp; reden: string }[] = [
  { re: /lorem ipsum/i, reden: "bevat lorem ipsum" },
  { re: /\{\{|\}\}|\[(naam|bedrijf|voornaam|plaats|event|link)[^\]]*\]/i, reden: "bevat een invul-placeholder" },
  { re: /[—–]| -- /, reden: "bevat een gedachtestreepje; herformuleer met een komma, dubbele punt of nieuwe zin" },
  { re: /afmelden|unsubscribe/i, reden: "bevat zelf een afmeldregel; die voegt de server toe" },
  { re: /€\s?\d|\d+\s?euro/i, reden: "noemt een prijs; prijzen gaan altijd via een voorstel op maat" },
];

/** Valideert de body van POST /api/agent/prospects. Gooit met een bruikbare melding. */
export function valideerProspect(body: unknown): NieuweProspect {
  if (!body || typeof body !== "object") throw new Error("Body moet een JSON-object zijn.");
  const b = body as Record<string, unknown>;

  const soort = b.soort;
  if (soort !== "bedrijf" && soort !== "event") {
    throw new Error('soort moet "bedrijf" of "event" zijn.');
  }

  const naam = str(b.naam, 120);
  if (naam.length < 2) throw new Error("naam ontbreekt.");

  let website: URL;
  try {
    const raw = str(b.website, 300);
    website = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    throw new Error("website is geen geldige URL.");
  }
  const domein = normaliseerDomein(website.hostname);

  const email = str(b.email, 200).toLowerCase();
  if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,24}$/.test(email)) {
    throw new Error("email is geen geldig e-mailadres.");
  }
  // Alleen zakelijke adressen op het eigen domein van de organisatie: geen
  // gmail/hotmail of adressen van derden die ergens op de site stonden.
  const emailDomein = normaliseerDomein(email.split("@")[1]);
  const hoortBijSite =
    emailDomein === domein || emailDomein.endsWith(`.${domein}`) || domein.endsWith(`.${emailDomein}`);
  if (!hoortBijSite) {
    throw new Error(
      `email (${emailDomein}) hoort niet bij het domein van de website (${domein}). Gebruik een adres op het eigen domein, of sla deze prospect over.`
    );
  }

  const bevindingen = str(b.bevindingen, 2000);
  if (bevindingen.length < 30) {
    throw new Error("bevindingen te kort: beschrijf wat je op de site zag (video's, aanleiding).");
  }

  const onderwerp = str(b.onderwerp, 140);
  if (onderwerp.length < 5) throw new Error("onderwerp ontbreekt of is te kort.");

  const tekst = typeof b.tekst === "string" ? b.tekst.replace(/\r\n/g, "\n").trim() : "";
  if (tekst.length < 400 || tekst.length > 2200) {
    throw new Error(`tekst moet 400 tot 2200 tekens zijn (nu ${tekst.length}).`);
  }
  for (const { re, reden } of VERBODEN_IN_TEKST) {
    if (re.test(tekst) || re.test(onderwerp)) throw new Error(`Mail ${reden}.`);
  }
  // langste woord uit de naam, zodat "De" of "Stichting" niet als treffer telt
  const kernwoord = naam
    .toLowerCase()
    .split(/[\s.,&'-]+/)
    .sort((a, b) => b.length - a.length)[0];
  if (!tekst.toLowerCase().includes(kernwoord)) {
    throw new Error("De mail noemt de naam van de organisatie niet; maak hem persoonlijk.");
  }

  return {
    soort,
    naam,
    website: website.toString(),
    domein,
    email,
    contactpersoon: strOfNull(b.contactpersoon, 120),
    plaats: strOfNull(b.plaats, 120),
    branche: strOfNull(b.branche, 120),
    heeft_video: typeof b.heeftVideo === "boolean" ? b.heeftVideo : null,
    bevindingen,
    onderwerp,
    tekst,
  };
}
