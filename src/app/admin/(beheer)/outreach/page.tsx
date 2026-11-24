import Link from "next/link";
import {
  getConfig,
  prospectsMetStatus,
  tellingPerStatus,
  type ProspectStatus,
} from "@/lib/outreach/db";
import {
  outreachConfigActie,
  prospectAfwijzenActie,
  prospectNuVersturenActie,
  prospectOpslaanActie,
  prospectTerugzettenActie,
} from "../../outreach-actions";
import {
  foutmelding,
  invoer,
  knop,
  knopGevaar,
  knopStil,
  kop,
  label,
  paneel,
  succesmelding,
} from "../../ui";

const TABS: { status: ProspectStatus | "alle"; tekst: string }[] = [
  { status: "klaar", tekst: "Klaar om te versturen" },
  { status: "verzonden", tekst: "Verzonden" },
  { status: "fout", tekst: "Fout" },
  { status: "afgewezen", tekst: "Afgewezen" },
  { status: "afgemeld", tekst: "Afgemeld" },
  { status: "alle", tekst: "Alle" },
];

const STATUS_KLEUR: Record<string, string> = {
  klaar: "border-amber/50 text-amber",
  verzonden: "border-green-500/50 text-green-400",
  fout: "border-rec/50 text-rec",
  afgewezen: "border-dim/40 text-dim",
  afgemeld: "border-dim/40 text-dim",
};

function datumTijd(iso: string): string {
  return new Intl.DateTimeFormat("nl-NL", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Amsterdam",
  }).format(new Date(iso));
}

export default async function OutreachPagina({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; fout?: string; opgeslagen?: string; verstuurd?: string }>;
}) {
  const sp = await searchParams;
  const status = (TABS.find((t) => t.status === sp.status)?.status ?? "klaar") as
    | ProspectStatus
    | "alle";

  let config, prospects, telling;
  try {
    [config, prospects, telling] = await Promise.all([
      getConfig(),
      prospectsMetStatus(status),
      tellingPerStatus(),
    ]);
  } catch (e) {
    return (
      <div>
        <h1 className={`${kop} mb-6`}>Outreach</h1>
        <p className={foutmelding}>
          Database niet bereikbaar: {e instanceof Error ? e.message : String(e)}
        </p>
      </div>
    );
  }
  const totaal = Object.values(telling).reduce((a, b) => a + b, 0);

  return (
    <div>
      <h1 className={`${kop} mb-3`}>Outreach</h1>
      <p className="mb-8 max-w-2xl text-sm text-dim">
        De Claude-routine zoekt elke werkdag bedrijven en events, scant hun website en schrijft
        per prospect een persoonlijke mail. Nieuwe mails staan minstens 2 uur klaar voordat de
        verzendrun (werkdagen rond 10:00) ze via Resend verstuurt. Tot die tijd kun je ze hier
        aanpassen of afwijzen.
      </p>

      {sp.fout ? <p className={foutmelding}>{sp.fout}</p> : null}
      {sp.opgeslagen ? <p className={succesmelding}>Opgeslagen.</p> : null}
      {sp.verstuurd ? <p className={succesmelding}>Mail verstuurd.</p> : null}

      <form action={outreachConfigActie} className={`${paneel} mb-10 flex flex-wrap items-end gap-6`}>
        <input type="hidden" name="status" value={status} />
        <label className="flex items-center gap-3 text-sm text-ink">
          <input
            type="checkbox"
            name="aan"
            defaultChecked={config.aan}
            className="h-4 w-4 accent-amber"
          />
          Automatisch versturen staat {config.aan ? "aan" : "uit"}
        </label>
        <div>
          <label htmlFor="per_dag" className={label}>
            Max. mails per dag
          </label>
          <input
            id="per_dag"
            name="per_dag"
            type="number"
            min={0}
            max={80}
            defaultValue={config.per_dag}
            className={`${invoer} w-28`}
          />
        </div>
        <button type="submit" className={knop}>
          Opslaan
        </button>
      </form>

      <nav className="mb-6 flex flex-wrap gap-2">
        {TABS.map((t) => {
          const n = t.status === "alle" ? totaal : (telling[t.status] ?? 0);
          const actief = t.status === status;
          return (
            <Link
              key={t.status}
              href={`/admin/outreach?status=${t.status}`}
              className={`rounded border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition ${
                actief ? "border-amber text-amber" : "border-line text-dim hover:text-ink"
              }`}
            >
              {t.tekst} ({n})
            </Link>
          );
        })}
      </nav>

      {prospects.length === 0 ? (
        <p className="text-sm text-dim">Niets in deze lijst.</p>
      ) : (
        <ul className="space-y-3">
          {prospects.map((p) => {
            const bewerkbaar = p.status === "klaar" || p.status === "fout";
            return (
              <li key={p.id} className="rounded-lg border border-line bg-panel">
                <details>
                  <summary className="flex cursor-pointer flex-wrap items-center gap-x-5 gap-y-1 px-5 py-4">
                    <span className="text-sm font-medium text-ink">{p.naam}</span>
                    <span className="font-mono text-[11px] uppercase tracking-wider text-dim">
                      {p.soort}
                      {p.plaats ? ` · ${p.plaats}` : ""}
                    </span>
                    <span
                      className={`rounded border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
                        STATUS_KLEUR[p.status] ?? ""
                      }`}
                    >
                      {p.status}
                    </span>
                    <span className="ml-auto font-mono text-xs text-dim">
                      {p.verzonden_op ? `verzonden ${datumTijd(p.verzonden_op)}` : datumTijd(p.created_at)}
                    </span>
                  </summary>

                  <div className="space-y-5 border-t border-line px-5 py-5">
                    <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[9rem_1fr]">
                      <dt className="text-dim">Website</dt>
                      <dd>
                        <a href={p.website} target="_blank" rel="noreferrer" className="text-amber hover:underline">
                          {p.domein}
                        </a>
                      </dd>
                      <dt className="text-dim">Aan</dt>
                      <dd className="text-ink">
                        {p.email}
                        {p.contactpersoon ? ` (${p.contactpersoon})` : ""}
                      </dd>
                      {p.branche ? (
                        <>
                          <dt className="text-dim">Branche</dt>
                          <dd className="text-ink">{p.branche}</dd>
                        </>
                      ) : null}
                      <dt className="text-dim">Video op site</dt>
                      <dd className="text-ink">
                        {p.heeft_video === null ? "onbekend" : p.heeft_video ? "ja" : "nee"}
                      </dd>
                      <dt className="text-dim">Bevindingen</dt>
                      <dd className="whitespace-pre-line text-ink">{p.bevindingen}</dd>
                      {p.fout ? (
                        <>
                          <dt className="text-rec">Fout</dt>
                          <dd className="text-rec">{p.fout}</dd>
                        </>
                      ) : null}
                    </dl>

                    {bewerkbaar ? (
                      <form className="space-y-4">
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="status" value={status} />
                        <div>
                          <label htmlFor={`onderwerp-${p.id}`} className={label}>
                            Onderwerp
                          </label>
                          <input
                            id={`onderwerp-${p.id}`}
                            name="onderwerp"
                            defaultValue={p.onderwerp}
                            className={invoer}
                          />
                        </div>
                        <div>
                          <label htmlFor={`tekst-${p.id}`} className={label}>
                            Mail
                          </label>
                          <textarea
                            id={`tekst-${p.id}`}
                            name="tekst"
                            defaultValue={p.tekst}
                            rows={14}
                            className={`${invoer} font-sans leading-relaxed`}
                          />
                          <p className="mt-1 text-xs text-dim">
                            Onder de mail komt automatisch een korte voetregel met een afmeldlink.
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <button formAction={prospectOpslaanActie} className={knopStil}>
                            Opslaan
                          </button>
                          <button formAction={prospectNuVersturenActie} className={knop}>
                            Nu versturen
                          </button>
                          <button formAction={prospectAfwijzenActie} className={`${knopGevaar} ml-auto`}>
                            Afwijzen
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div>
                        <p className={label}>Onderwerp</p>
                        <p className="mb-4 text-sm text-ink">{p.onderwerp}</p>
                        <p className={label}>Mail</p>
                        <p className="whitespace-pre-line rounded border border-line bg-coal p-4 text-sm leading-relaxed text-ink">
                          {p.tekst}
                        </p>
                        {p.status === "afgewezen" ? (
                          <form action={prospectTerugzettenActie} className="mt-4">
                            <input type="hidden" name="id" value={p.id} />
                            <button type="submit" className={knopStil}>
                              Toch versturen (terug naar klaar)
                            </button>
                          </form>
                        ) : null}
                      </div>
                    )}
                  </div>
                </details>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
