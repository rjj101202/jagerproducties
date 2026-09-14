import Link from "next/link";
import { alleKlanten } from "@/lib/admin/db";
import { klantMakenActie } from "../../actions";
import { foutmelding, knop, kop, paneel } from "../../ui";
import KlantVelden from "./KlantVelden";

export default async function KlantenPagina({
  searchParams,
}: {
  searchParams: Promise<{ fout?: string }>;
}) {
  const [{ fout }, klanten] = await Promise.all([searchParams, alleKlanten()]);

  return (
    <div>
      <h1 className={`${kop} mb-8`}>Klanten</h1>
      {fout ? <p className={foutmelding}>{fout}</p> : null}

      {klanten.length === 0 ? (
        <p className="mb-10 text-sm text-dim">Nog geen klanten.</p>
      ) : (
        <ul className="mb-12 divide-y divide-line rounded-lg border border-line bg-panel">
          {klanten.map((k) => (
            <li key={k.id}>
              <Link
                href={`/admin/klanten/${k.id}`}
                className="flex flex-wrap items-center gap-x-6 gap-y-1 px-5 py-4 transition hover:bg-coal/60"
              >
                <span className="text-sm font-medium text-ink">{k.naam}</span>
                {k.contactpersoon ? (
                  <span className="text-sm text-dim">{k.contactpersoon}</span>
                ) : null}
                <span className="ml-auto font-mono text-xs text-dim">{k.email}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <div className={paneel}>
        <h2 className="mb-5 font-mono text-xs uppercase tracking-wider text-amber">
          Nieuwe klant
        </h2>
        <form action={klantMakenActie}>
          <KlantVelden />
          <button type="submit" className={`${knop} mt-6`}>
            Klant toevoegen
          </button>
        </form>
      </div>
    </div>
  );
}
