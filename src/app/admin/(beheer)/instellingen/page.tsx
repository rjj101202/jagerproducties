import { getInstellingen } from "@/lib/admin/db";
import { instellingenOpslaanActie } from "../../actions";
import { foutmelding, invoer, knop, kop, label, paneel, succesmelding } from "../../ui";

export default async function InstellingenPagina({
  searchParams,
}: {
  searchParams: Promise<{ fout?: string; opgeslagen?: string }>;
}) {
  const [{ fout, opgeslagen }, i] = await Promise.all([searchParams, getInstellingen()]);

  return (
    <div className="max-w-2xl">
      <h1 className={`${kop} mb-4`}>Instellingen</h1>
      <p className="mb-8 text-sm text-dim">
        Deze gegevens komen op elke factuur en in elke factuurmail te staan.
      </p>

      {fout ? <p className={foutmelding}>{fout}</p> : null}
      {opgeslagen ? <p className={succesmelding}>Opgeslagen.</p> : null}

      <form action={instellingenOpslaanActie} className={paneel}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="bedrijfsnaam">
              Bedrijfsnaam
            </label>
            <input id="bedrijfsnaam" name="bedrijfsnaam" defaultValue={i.bedrijfsnaam} className={invoer} />
          </div>
          <div>
            <label className={label} htmlFor="naam_rekeninghouder">
              Naam rekeninghouder
            </label>
            <input
              id="naam_rekeninghouder"
              name="naam_rekeninghouder"
              defaultValue={i.naam_rekeninghouder}
              className={invoer}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={label} htmlFor="iban">
              IBAN (hierop betalen klanten) *
            </label>
            <input
              id="iban"
              name="iban"
              placeholder="NL00BANK0123456789"
              defaultValue={i.iban}
              className={invoer}
            />
          </div>
          <div>
            <label className={label} htmlFor="btw_nummer">
              Btw-nummer *
            </label>
            <input
              id="btw_nummer"
              name="btw_nummer"
              placeholder="NL001234567B01"
              defaultValue={i.btw_nummer}
              className={invoer}
            />
          </div>
          <div>
            <label className={label} htmlFor="kvk">
              KvK-nummer
            </label>
            <input id="kvk" name="kvk" defaultValue={i.kvk} className={invoer} />
          </div>
          <div className="sm:col-span-2">
            <label className={label} htmlFor="adres">
              Adres
            </label>
            <input id="adres" name="adres" defaultValue={i.adres} className={invoer} />
          </div>
          <div>
            <label className={label} htmlFor="postcode">
              Postcode
            </label>
            <input id="postcode" name="postcode" defaultValue={i.postcode} className={invoer} />
          </div>
          <div>
            <label className={label} htmlFor="plaats">
              Plaats
            </label>
            <input id="plaats" name="plaats" defaultValue={i.plaats} className={invoer} />
          </div>
          <div>
            <label className={label} htmlFor="email">
              E-mailadres (afzender)
            </label>
            <input id="email" name="email" type="email" defaultValue={i.email} className={invoer} />
          </div>
          <div>
            <label className={label} htmlFor="telefoon">
              Telefoon
            </label>
            <input id="telefoon" name="telefoon" defaultValue={i.telefoon} className={invoer} />
          </div>
          <div>
            <label className={label} htmlFor="betaaltermijn">
              Betaaltermijn (dagen)
            </label>
            <input
              id="betaaltermijn"
              name="betaaltermijn"
              type="number"
              min={1}
              defaultValue={i.betaaltermijn}
              className={invoer}
            />
          </div>
          <div>
            <label className={label} htmlFor="volgnummer">
              Volgend factuurnummer (bijv. 7 → {new Date().getFullYear()}-007)
            </label>
            <input
              id="volgnummer"
              name="volgnummer"
              type="number"
              min={1}
              defaultValue={i.volgnummer}
              className={invoer}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={label} htmlFor="voettekst">
              Extra voettekst op factuur (optioneel)
            </label>
            <input id="voettekst" name="voettekst" defaultValue={i.voettekst} className={invoer} />
          </div>
        </div>
        <button type="submit" className={`${knop} mt-6`}>
          Opslaan
        </button>
      </form>
    </div>
  );
}
