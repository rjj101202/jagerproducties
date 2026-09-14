import Link from "next/link";
import { alleKlanten, getInstellingen } from "@/lib/admin/db";
import { factuurMakenActie } from "../../../actions";
import { foutmelding, kop, paneel } from "../../../ui";
import FactuurForm from "../FactuurForm";

function isoVandaagPlus(dagen: number): string {
  const d = new Date();
  d.setDate(d.getDate() + dagen);
  return d.toISOString().slice(0, 10);
}

export default async function NieuweFactuur({
  searchParams,
}: {
  searchParams: Promise<{ fout?: string }>;
}) {
  const [{ fout }, klanten, instellingen] = await Promise.all([
    searchParams,
    alleKlanten(),
    getInstellingen(),
  ]);

  return (
    <div className="max-w-3xl">
      <h1 className={`${kop} mb-8`}>Nieuwe factuur</h1>
      {fout ? <p className={foutmelding}>{fout}</p> : null}

      {klanten.length === 0 ? (
        <p className="text-sm text-dim">
          Voeg eerst een{" "}
          <Link href="/admin/klanten" className="text-amber underline">
            klant
          </Link>{" "}
          toe.
        </p>
      ) : (
        <div className={paneel}>
          <FactuurForm
            actie={factuurMakenActie}
            klanten={klanten.map((k) => ({ id: k.id, naam: k.naam }))}
            standaardDatum={isoVandaagPlus(0)}
            standaardVervaldatum={isoVandaagPlus(instellingen.betaaltermijn)}
          />
        </div>
      )}
    </div>
  );
}
