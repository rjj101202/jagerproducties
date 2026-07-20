import { EMAIL, KVK, TEL_PLACEHOLDER } from "@/lib/site";

const CREDITS: [string, string][] = [
  ["Concept & regie", "Remy Jager"],
  ["Camera", "Remy Jager"],
  ["Montage & kleur", "Remy Jager"],
  ["Hoofdrol", "Jouw verhaal"],
];

/** Footer als aftiteling: end credits van de pagina. */
export default function Footer() {
  return (
    <footer className="border-t border-line bg-coal">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <p className="text-center font-mono text-[11px] uppercase tracking-[0.3em] text-dim">
          — Aftiteling —
        </p>

        <dl className="mx-auto mt-10 max-w-md space-y-3">
          {CREDITS.map(([role, name]) => (
            <div
              key={role}
              className="flex items-baseline justify-between gap-6 text-sm"
            >
              <dt className="font-mono text-[12px] uppercase tracking-[0.18em] text-dim">
                {role}
              </dt>
              <dd className="font-display text-base uppercase tracking-[0.08em] text-ink">
                {name}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 text-center">
          <a
            href={`mailto:${EMAIL}`}
            className="font-display text-2xl uppercase tracking-wide text-amber hover:text-ink sm:text-3xl"
          >
            {EMAIL}
          </a>
          <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.18em] text-dim">
            Tel: {TEL_PLACEHOLDER} · heel Nederland
          </p>
        </div>

        <div className="mt-14 flex flex-col items-center gap-2 border-t border-line pt-8 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
            © 2026 Jager Producties — videoproductie voor bedrijven &amp; events
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
            KVK {KVK}
          </p>
          <p className="font-mono text-[11px] tracking-[0.06em] text-dim/80">
            Ook een website nodig?{" "}
            <a
              href="https://novaemedia.nl"
              className="text-dim underline decoration-line underline-offset-4 hover:text-ink"
            >
              Novae Media
            </a>{" "}
            — websites op abonnement, van dezelfde maker.
          </p>
        </div>
      </div>
    </footer>
  );
}
