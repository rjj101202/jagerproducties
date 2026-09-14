import { notFound } from "next/navigation";
import { getKlant } from "@/lib/admin/db";
import { klantBijwerkenActie, klantVerwijderenActie } from "../../../actions";
import { foutmelding, knop, knopGevaar, kop, paneel } from "../../../ui";
import KlantVelden from "../KlantVelden";

export default async function KlantBewerken({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ fout?: string }>;
}) {
  const [{ id }, { fout }] = await Promise.all([params, searchParams]);
  const klant = await getKlant(Number(id));
  if (!klant) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className={`${kop} mb-8`}>{klant.naam}</h1>
      {fout ? <p className={foutmelding}>{fout}</p> : null}

      <div className={paneel}>
        <form action={klantBijwerkenActie}>
          <input type="hidden" name="id" value={klant.id} />
          <KlantVelden klant={klant} />
          <button type="submit" className={`${knop} mt-6`}>
            Opslaan
          </button>
        </form>
      </div>

      <form action={klantVerwijderenActie} className="mt-6">
        <input type="hidden" name="id" value={klant.id} />
        <button type="submit" className={knopGevaar}>
          Klant verwijderen
        </button>
      </form>
    </div>
  );
}
