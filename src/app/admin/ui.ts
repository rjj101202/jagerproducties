/** Gedeelde Tailwind-classes voor de admin, in de stijl van de site. */

export const invoer =
  "w-full rounded border border-line bg-coal px-3 py-2 text-sm text-ink " +
  "placeholder:text-dim/60 focus:border-amber focus:outline-none";

export const label = "mb-1 block font-mono text-[11px] uppercase tracking-wider text-dim";

export const knop =
  "inline-flex cursor-pointer items-center gap-2 rounded bg-amber px-4 py-2 " +
  "font-mono text-xs font-medium uppercase tracking-wider text-coal transition " +
  "hover:brightness-110 disabled:opacity-50";

export const knopStil =
  "inline-flex cursor-pointer items-center gap-2 rounded border border-line px-4 py-2 " +
  "font-mono text-xs uppercase tracking-wider text-dim transition hover:border-amber hover:text-ink";

export const knopGevaar =
  "inline-flex cursor-pointer items-center gap-2 rounded border border-rec/40 px-4 py-2 " +
  "font-mono text-xs uppercase tracking-wider text-rec transition hover:bg-rec/10";

export const paneel = "rounded-lg border border-line bg-panel p-6";

export const kop = "font-display text-2xl font-medium uppercase tracking-wide text-ink";

export const foutmelding =
  "mb-6 rounded border border-rec/40 bg-rec/10 px-4 py-3 text-sm text-rec";

export const succesmelding =
  "mb-6 rounded border border-amber/40 bg-amber/10 px-4 py-3 text-sm text-amber";

export const statusKleur: Record<string, string> = {
  concept: "border-dim/40 text-dim",
  verzonden: "border-amber/50 text-amber",
  betaald: "border-green-500/50 text-green-400",
};
