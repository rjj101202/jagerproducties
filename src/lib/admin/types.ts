/** Bedragen zijn overal in eurocenten (integers) om afrondingsfouten te voorkomen. */

export type Klant = {
  id: number;
  naam: string;
  contactpersoon: string | null;
  email: string;
  adres: string | null;
  postcode: string | null;
  plaats: string | null;
  btw_nummer: string | null;
  created_at: string;
};

export type FactuurRegel = {
  omschrijving: string;
  aantal: number;
  /** prijs per stuk in centen, excl. btw */
  prijs_cent: number;
  /** btw-percentage: 21, 9 of 0 */
  btw: number;
};

export type FactuurStatus = "concept" | "verzonden" | "betaald";

export type Factuur = {
  id: number;
  nummer: string;
  klant_id: number;
  datum: string; // YYYY-MM-DD
  vervaldatum: string; // YYYY-MM-DD
  regels: FactuurRegel[];
  opmerking: string | null;
  status: FactuurStatus;
  /** onraadbaar token voor de publieke QR-url in de mail */
  qr_token: string;
  verzonden_op: string | null;
  created_at: string;
};

export type Instellingen = {
  bedrijfsnaam: string;
  naam_rekeninghouder: string;
  iban: string;
  btw_nummer: string;
  kvk: string;
  adres: string;
  postcode: string;
  plaats: string;
  email: string;
  telefoon: string;
  /** betaaltermijn in dagen */
  betaaltermijn: number;
  /** volgend factuurvolgnummer, bijv. 7 -> 2026-007 */
  volgnummer: number;
  /** voettekst onderaan factuur/mail, optioneel */
  voettekst: string;
};

export type FactuurTotalen = {
  subtotaal_cent: number;
  /** btw per tarief, bijv. { 21: 12600 } */
  btw_per_tarief: Record<number, number>;
  btw_cent: number;
  totaal_cent: number;
};

export function berekenTotalen(regels: FactuurRegel[]): FactuurTotalen {
  const btw_per_tarief: Record<number, number> = {};
  let subtotaal_cent = 0;
  for (const r of regels) {
    const excl = Math.round(r.aantal * r.prijs_cent);
    subtotaal_cent += excl;
    const btw = Math.round((excl * r.btw) / 100);
    if (btw !== 0 || r.btw !== 0) {
      btw_per_tarief[r.btw] = (btw_per_tarief[r.btw] ?? 0) + btw;
    }
  }
  const btw_cent = Object.values(btw_per_tarief).reduce((a, b) => a + b, 0);
  return {
    subtotaal_cent,
    btw_per_tarief,
    btw_cent,
    totaal_cent: subtotaal_cent + btw_cent,
  };
}

export function euro(cent: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(cent / 100);
}

export function aantalNL(n: number): string {
  return String(n).replace(".", ",");
}

export function datumNL(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("nl-NL", { dateStyle: "long" }).format(
    new Date(y, m - 1, d)
  );
}

/** "1.234,56", "1234.56" of "450" -> centen; gooit bij onleesbare invoer */
export function parseEuro(input: string): number {
  let s = input.trim().replace(/\s|€/g, "");
  if (s.includes(".") && s.includes(",")) {
    // beide aanwezig: het laatste teken is de decimaal, de rest duizendtallen
    if (s.lastIndexOf(",") > s.lastIndexOf(".")) {
      s = s.replace(/\./g, "").replace(",", ".");
    } else {
      s = s.replace(/,/g, "");
    }
  } else {
    s = s.replace(",", ".");
  }
  const n = Number(s);
  if (!Number.isFinite(n)) throw new Error(`Ongeldig bedrag: "${input}"`);
  return Math.round(n * 100);
}

export const STANDAARD_INSTELLINGEN: Instellingen = {
  bedrijfsnaam: "Jager Producties",
  naam_rekeninghouder: "Jager Producties",
  iban: "",
  btw_nummer: "",
  kvk: "90470826",
  adres: "",
  postcode: "",
  plaats: "",
  email: "info@jagerproducties.nl",
  telefoon: "06 81 09 88 95",
  betaaltermijn: 14,
  volgnummer: 1,
  voettekst: "",
};
