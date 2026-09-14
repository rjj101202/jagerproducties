import Link from "next/link";
import { alleFacturen } from "@/lib/admin/db";
import { berekenTotalen, datumNL, euro } from "@/lib/admin/types";
import { knop, kop, statusKleur } from "../../ui";

export default async function FacturenPagina() {
  const facturen = await alleFacturen();

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className={kop}>Facturen</h1>
        <Link href="/admin/facturen/nieuw" className={knop}>
          + Nieuwe factuur
        </Link>
      </div>

      {facturen.length === 0 ? (
        <p className="text-sm text-dim">Nog geen facturen.</p>
      ) : (
        <ul className="divide-y divide-line rounded-lg border border-line bg-panel">
          {facturen.map((f) => (
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
