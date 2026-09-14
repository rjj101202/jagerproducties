import Link from "next/link";
import { notFound } from "next/navigation";
import { getFactuur, getInstellingen, getKlant } from "@/lib/admin/db";
import { aantalNL, berekenTotalen, datumNL, euro } from "@/lib/admin/types";
import {
  factuurStatusActie,
  factuurVersturenActie,
  factuurVerwijderenActie,
} from "../../../actions";
import {
  foutmelding,
  knop,
  knopGevaar,
  knopStil,
  kop,
  paneel,
  statusKleur,
  succesmelding,
} from "../../../ui";

export default async function FactuurDetail({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ fout?: string; verzonden?: string }>;
}) {
  const [{ id }, { fout, verzonden }] = await Promise.all([params, searchParams]);
  const factuur = await getFactuur(Number(id));
  if (!factuur) notFound();
  const [klant, instellingen] = await Promise.all([
    getKlant(factuur.klant_id),
    getInstellingen(),
  ]);
  if (!klant) notFound();

  const t = berekenTotalen(factuur.regels);

  return (
    <div className="max-w-3xl">
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <h1 className={kop}>Factuur {factuur.nummer}</h1>
        <span
          className={`rounded-full border px-3 py-0.5 font-mono text-[10px] uppercase tracking-wider ${statusKleur[factuur.status]}`}
        >
          {factuur.status}
        </span>
      </div>

      {fout ? <p className={foutmelding}>{fout}</p> : null}
      {verzonden ? (
        <p className={succesmelding}>
          Factuur verstuurd naar {klant.email}. Je krijgt zelf geen kopie; onder
          “Verzonden op” zie je de verzenddatum.
        </p>
      ) : null}

      <div className={`${paneel} mb-6`}>
        <div className="mb-6 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-1 font-mono text-[11px] uppercase tracking-wider text-dim">
              Klant
            </p>
            <p className="text-sm text-ink">{klant.naam}</p>
            <p className="text-sm text-dim">{klant.email}</p>
          </div>
          <div>
            <p className="mb-1 font-mono text-[11px] uppercase tracking-wider text-dim">
              Datums
            </p>
            <p className="text-sm text-ink">Factuurdatum: {datumNL(factuur.datum)}</p>
            <p className="text-sm text-dim">Vervaldatum: {datumNL(factuur.vervaldatum)}</p>
            {factuur.verzonden_op ? (
              <p className="text-sm text-dim">
                Verzonden op:{" "}
                {new Intl.DateTimeFormat("nl-NL", {
                  dateStyle: "long",
                  timeStyle: "short",
                }).format(new Date(factuur.verzonden_op))}
              </p>
            ) : null}
          </div>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left font-mono text-[11px] uppercase tracking-wider text-dim">
              <th className="pb-2 font-normal">Omschrijving</th>
              <th className="pb-2 text-right font-normal">Aantal</th>
              <th className="pb-2 text-right font-normal">Prijs</th>
              <th className="pb-2 text-right font-normal">Btw</th>
              <th className="pb-2 text-right font-normal">Bedrag</th>
            </tr>
          </thead>
          <tbody>
            {factuur.regels.map((r, i) => (
              <tr key={i} className="border-b border-line/50">
                <td className="py-2 pr-4 text-ink">{r.omschrijving}</td>
                <td className="py-2 text-right text-dim">{aantalNL(r.aantal)}</td>
                <td className="py-2 text-right text-dim">{euro(r.prijs_cent)}</td>
                <td className="py-2 text-right text-dim">{r.btw}%</td>
                <td className="py-2 text-right text-ink">
                  {euro(Math.round(r.aantal * r.prijs_cent))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 ml-auto max-w-xs space-y-1 text-sm">
          <div className="flex justify-between text-dim">
            <span>Subtotaal excl. btw</span>
            <span>{euro(t.subtotaal_cent)}</span>
          </div>
          {Object.entries(t.btw_per_tarief).map(([tarief, cent]) => (
            <div key={tarief} className="flex justify-between text-dim">
              <span>Btw {tarief}%</span>
              <span>{euro(cent)}</span>
            </div>
          ))}
          <div className="flex justify-between border-t border-line pt-1 font-medium text-ink">
            <span>Te betalen</span>
            <span>{euro(t.totaal_cent)}</span>
          </div>
        </div>

        {factuur.opmerking ? (
          <p className="mt-4 text-sm text-dim">{factuur.opmerking}</p>
        ) : null}
      </div>

      {!instellingen.iban ? (
        <p className={foutmelding}>
          Vul eerst je IBAN in bij{" "}
          <Link href="/admin/instellingen" className="underline">
            Instellingen
          </Link>{" "}
          — zonder IBAN kan er geen betaalinformatie of QR-code op de factuur.
        </p>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <form action={factuurVersturenActie}>
          <input type="hidden" name="id" value={factuur.id} />
          <button type="submit" className={knop}>
            {factuur.status === "concept"
              ? `Verstuur naar ${klant.email}`
              : "Opnieuw versturen"}
          </button>
        </form>

        <a
          href={`/api/admin/facturen/${factuur.id}/pdf`}
          className={knopStil}
          target="_blank"
        >
          Bekijk PDF
        </a>

        {factuur.status === "concept" ? (
          <>
            <Link href={`/admin/facturen/${factuur.id}/bewerken`} className={knopStil}>
              Bewerken
            </Link>
            <form action={factuurVerwijderenActie}>
              <input type="hidden" name="id" value={factuur.id} />
              <button type="submit" className={knopGevaar}>
                Verwijderen
              </button>
            </form>
          </>
        ) : null}

        {factuur.status === "verzonden" ? (
          <form action={factuurStatusActie}>
            <input type="hidden" name="id" value={factuur.id} />
            <input type="hidden" name="status" value="betaald" />
            <button type="submit" className={knopStil}>
              Markeer als betaald
            </button>
          </form>
        ) : null}

        {factuur.status === "betaald" ? (
          <form action={factuurStatusActie}>
            <input type="hidden" name="id" value={factuur.id} />
            <input type="hidden" name="status" value="verzonden" />
            <button type="submit" className={knopStil}>
              Toch niet betaald
            </button>
          </form>
        ) : null}
      </div>
    </div>
  );
}
