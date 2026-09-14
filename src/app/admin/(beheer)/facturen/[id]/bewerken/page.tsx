import { notFound, redirect } from "next/navigation";
import { alleKlanten, getFactuur } from "@/lib/admin/db";
import { factuurBijwerkenActie } from "../../../../actions";
import { foutmelding, kop, paneel } from "../../../../ui";
import FactuurForm from "../../FactuurForm";

export default async function FactuurBewerken({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ fout?: string }>;
}) {
  const [{ id }, { fout }] = await Promise.all([params, searchParams]);
  const factuur = await getFactuur(Number(id));
  if (!factuur) notFound();
  if (factuur.status !== "concept") redirect(`/admin/facturen/${factuur.id}`);
  const klanten = await alleKlanten();

  return (
    <div className="max-w-3xl">
      <h1 className={`${kop} mb-8`}>Factuur {factuur.nummer} bewerken</h1>
      {fout ? <p className={foutmelding}>{fout}</p> : null}
      <div className={paneel}>
        <FactuurForm
          actie={factuurBijwerkenActie}
          klanten={klanten.map((k) => ({ id: k.id, naam: k.naam }))}
          standaardDatum={factuur.datum}
          standaardVervaldatum={factuur.vervaldatum}
          factuur={factuur}
        />
      </div>
    </div>
  );
}
