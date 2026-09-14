import Link from "next/link";
import { alleFacturen, getInstellingen } from "@/lib/admin/db";
import { berekenTotalen, datumNL, euro } from "@/lib/admin/types";
import { foutmelding, knop, kop, paneel, statusKleur } from "../ui";

export default async function Overzicht() {
  let facturen;
  let instellingen;
  try {
    [facturen, instellingen] = await Promise.all([alleFacturen(), getInstellingen()]);
  } catch (e) {
    return (
      <div>
        <h1 className={`${kop} mb-6`}>Overzicht</h1>
        <p className={foutmelding}>
          Database niet bereikbaar: {e instanceof Error ? e.message : String(e)}
        </p>
        <p className="text-sm text-dim">
          Zie <code className="text-ink">README-ADMIN.md</code> in de projectmap voor de
          eenmalige setup (database, Resend en wachtwoord).
        </p>
      </div>
    );
  }

  const jaar = String(new Date().getFullYear());
  const openstaand = facturen
    .filter((f) => f.status === "verzonden")
    .reduce((som, f) => som + berekenTotalen(f.regels).totaal_cent, 0);
  const betaaldDitJaar = facturen
    .filter((f) => f.status === "betaald" && f.datum.startsWith(jaar))
    .reduce((som, f) => som + berekenTotalen(f.regels).totaal_cent, 0);
  const gefactureerdDitJaar = facturen
    .filter((f) => f.status !== "concept" && f.datum.startsWith(jaar))
    .reduce((som, f) => som + berekenTotalen(f.regels).totaal_cent, 0);

  const instellingenCompleet = Boolean(instellingen.iban && instellingen.btw_nummer);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className={kop}>Overzicht</h1>
        <Link href="/admin/facturen/nieuw" className={knop}>
          + Nieuwe factuur
        </Link>
      </div>

      {!instellingenCompleet ? (
        <p className={foutmelding}>
          Vul eerst je IBAN en btw-nummer in bij{" "}
          <Link href="/admin/instellingen" className="underline">
            Instellingen
          </Link>{" "}
          — die komen op elke factuur te staan.
        </p>
      ) : null}

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        {[
          { titel: "Openstaand", bedrag: openstaand },
          { titel: `Betaald in ${jaar}`, bedrag: betaaldDitJaar },
          { titel: `Gefactureerd in ${jaar}`, bedrag: gefactureerdDitJaar },
        ].map((blok) => (
          <div key={blok.titel} className={paneel}>
            <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-dim">
              {blok.titel}
            </p>
            <p className="font-display text-3xl text-ink">{euro(blok.bedrag)}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-4 font-mono text-xs uppercase tracking-wider text-dim">
        Recente facturen
      </h2>
      {facturen.length === 0 ? (
        <p className="text-sm text-dim">
          Nog geen facturen. Voeg eerst een{" "}
          <Link href="/admin/klanten" className="text-amber underline">
            klant
          </Link>{" "}
          toe en maak dan je eerste factuur.
        </p>
      ) : (
        <ul className="divide-y divide-line rounded-lg border border-line bg-panel">
          {facturen.slice(0, 8).map((f) => (
            <li key={f.id}>
              <Link
                href={`/admin/facturen/${f.id}`}
                className="flex flex-wrap items-center gap-x-6 gap-y-1 px-5 py-4 transition hover:bg-coal/60"
              >
                <span className="font-mono text-sm text-ink">{f.nummer}</span>
                <span className="flex-1 truncate text-sm text-dim">{f.klant_naam}</span>
                <span className="hidden text-sm text-dim sm:inline">
                  {datumNL(f.datum)}
                </span>
                <span className="font-mono text-sm text-ink">
                  {euro(berekenTotalen(f.regels).totaal_cent)}
                </span>
                <span
                  className={`rounded-full border px-3 py-0.5 font-mono text-[10px] uppercase tracking-wider ${statusKleur[f.status]}`}
                >
                  {f.status}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
