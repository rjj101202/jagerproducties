"use client";

import { useState } from "react";
import { euro, Factuur, parseEuro } from "@/lib/admin/types";
import { invoer, knop, knopStil, label } from "../../ui";

type Rij = {
  omschrijving: string;
  aantal: string;
  prijs: string;
  btw: string;
};

const LEGE_RIJ: Rij = { omschrijving: "", aantal: "1", prijs: "", btw: "21" };

function centenNaarInvoer(cent: number): string {
  return (cent / 100).toFixed(2).replace(".", ",");
}

function rijenUitFactuur(factuur: Factuur): Rij[] {
  return factuur.regels.map((r) => ({
    omschrijving: r.omschrijving,
    aantal: String(r.aantal).replace(".", ","),
    prijs: centenNaarInvoer(r.prijs_cent),
    btw: String(r.btw),
  }));
}

export default function FactuurForm({
  actie,
  klanten,
  standaardDatum,
  standaardVervaldatum,
  factuur,
}: {
  actie: (formData: FormData) => Promise<void>;
  klanten: { id: number; naam: string }[];
  standaardDatum: string;
  standaardVervaldatum: string;
  factuur?: Factuur;
}) {
  const [rijen, setRijen] = useState<Rij[]>(
    factuur ? rijenUitFactuur(factuur) : [LEGE_RIJ]
  );

  function wijzig(index: number, veld: keyof Rij, waarde: string) {
    setRijen((oud) => oud.map((r, i) => (i === index ? { ...r, [veld]: waarde } : r)));
  }

  // Live totalen; onleesbare invoer telt gewoon nog niet mee
  let subtotaal = 0;
  let btwTotaal = 0;
  for (const r of rijen) {
    try {
      const excl = Math.round(Number(r.aantal.replace(",", ".")) * parseEuro(r.prijs));
      if (!Number.isFinite(excl)) continue;
      subtotaal += excl;
      btwTotaal += Math.round((excl * Number(r.btw)) / 100);
    } catch {
      // rij nog niet compleet
    }
  }

  return (
    <form action={actie}>
      {factuur ? <input type="hidden" name="id" value={factuur.id} /> : null}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div>
          <label className={label} htmlFor="klant_id">
            Klant *
          </label>
          <select
            id="klant_id"
            name="klant_id"
            required
            defaultValue={factuur?.klant_id ?? ""}
            className={invoer}
          >
            <option value="" disabled>
              Kies een klant…
            </option>
            {klanten.map((k) => (
              <option key={k.id} value={k.id}>
                {k.naam}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={label} htmlFor="datum">
            Factuurdatum
          </label>
          <input
            id="datum"
            name="datum"
            type="date"
            required
            defaultValue={factuur?.datum ?? standaardDatum}
            className={invoer}
          />
        </div>
        <div>
          <label className={label} htmlFor="vervaldatum">
            Vervaldatum
          </label>
          <input
            id="vervaldatum"
            name="vervaldatum"
            type="date"
            required
            defaultValue={factuur?.vervaldatum ?? standaardVervaldatum}
            className={invoer}
          />
        </div>
      </div>

      <p className={label}>Factuurregels</p>
      <div className="mb-3 flex flex-col gap-2">
        {rijen.map((rij, i) => (
          <div key={i} className="grid grid-cols-[1fr_70px_110px_80px_36px] gap-2">
            <input
              name="regel_omschrijving"
              placeholder="Omschrijving, bijv. Aftermovie bedrijfsfeest"
              value={rij.omschrijving}
              onChange={(e) => wijzig(i, "omschrijving", e.target.value)}
              className={invoer}
            />
            <input
              name="regel_aantal"
              placeholder="Aantal"
              inputMode="decimal"
              value={rij.aantal}
              onChange={(e) => wijzig(i, "aantal", e.target.value)}
              className={`${invoer} text-right`}
            />
            <input
              name="regel_prijs"
              placeholder="Prijs excl."
              inputMode="decimal"
              value={rij.prijs}
              onChange={(e) => wijzig(i, "prijs", e.target.value)}
              className={`${invoer} text-right`}
            />
            <select
              name="regel_btw"
              value={rij.btw}
              onChange={(e) => wijzig(i, "btw", e.target.value)}
              className={invoer}
            >
              <option value="21">21%</option>
              <option value="9">9%</option>
              <option value="0">0%</option>
            </select>
            <button
              type="button"
              aria-label="Regel verwijderen"
              onClick={() => setRijen((oud) => oud.filter((_, j) => j !== i))}
              disabled={rijen.length === 1}
              className="cursor-pointer rounded border border-line text-dim transition hover:border-rec hover:text-rec disabled:opacity-30"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setRijen((oud) => [...oud, LEGE_RIJ])}
        className={knopStil}
      >
        + Regel toevoegen
      </button>

      <div className="my-6 max-w-xs space-y-1 text-sm">
        <div className="flex justify-between text-dim">
          <span>Subtotaal excl. btw</span>
          <span>{euro(subtotaal)}</span>
        </div>
        <div className="flex justify-between text-dim">
          <span>Btw</span>
          <span>{euro(btwTotaal)}</span>
        </div>
        <div className="flex justify-between border-t border-line pt-1 font-medium text-ink">
          <span>Totaal</span>
          <span>{euro(subtotaal + btwTotaal)}</span>
        </div>
      </div>

      <div className="mb-6">
        <label className={label} htmlFor="opmerking">
          Opmerking op de factuur (optioneel)
        </label>
        <textarea
          id="opmerking"
          name="opmerking"
          rows={2}
          defaultValue={factuur?.opmerking ?? ""}
          className={invoer}
        />
      </div>

      <button type="submit" className={knop}>
        {factuur ? "Wijzigingen opslaan" : "Factuur aanmaken"}
      </button>
    </form>
  );
}
