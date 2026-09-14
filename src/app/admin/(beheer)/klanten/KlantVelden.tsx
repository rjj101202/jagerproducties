import { Klant } from "@/lib/admin/types";
import { invoer, label } from "../../ui";

/** Invulvelden voor een klant; hergebruikt door de nieuw- en bewerkpagina. */
export default function KlantVelden({ klant }: { klant?: Klant }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className={label} htmlFor="naam">
          Bedrijfsnaam *
        </label>
        <input id="naam" name="naam" required defaultValue={klant?.naam} className={invoer} />
      </div>
      <div>
        <label className={label} htmlFor="contactpersoon">
          Contactpersoon
        </label>
        <input
          id="contactpersoon"
          name="contactpersoon"
          defaultValue={klant?.contactpersoon ?? ""}
          className={invoer}
        />
      </div>
      <div className="sm:col-span-2">
        <label className={label} htmlFor="email">
          E-mailadres (factuur gaat hierheen) *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          defaultValue={klant?.email}
          className={invoer}
        />
      </div>
      <div className="sm:col-span-2">
        <label className={label} htmlFor="adres">
          Adres
        </label>
        <input id="adres" name="adres" defaultValue={klant?.adres ?? ""} className={invoer} />
      </div>
      <div>
        <label className={label} htmlFor="postcode">
          Postcode
        </label>
        <input
          id="postcode"
          name="postcode"
          defaultValue={klant?.postcode ?? ""}
          className={invoer}
        />
      </div>
      <div>
        <label className={label} htmlFor="plaats">
          Plaats
        </label>
        <input id="plaats" name="plaats" defaultValue={klant?.plaats ?? ""} className={invoer} />
      </div>
      <div className="sm:col-span-2">
        <label className={label} htmlFor="btw_nummer">
          Btw-nummer klant (optioneel, komt op de factuur)
        </label>
        <input
          id="btw_nummer"
          name="btw_nummer"
          defaultValue={klant?.btw_nummer ?? ""}
          className={invoer}
        />
      </div>
    </div>
  );
}
