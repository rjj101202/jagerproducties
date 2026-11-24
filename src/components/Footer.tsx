import { EMAIL, KVK, TEL } from "@/lib/site";

/** Footer: contactgegevens en KvK. */
export default function Footer() {
  return (
    <footer className="border-t border-line bg-coal">
      <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="text-center">
          <a
            href={`mailto:${EMAIL}`}
            className="font-display text-2xl uppercase tracking-wide text-amber hover:text-ink sm:text-3xl"
          >
            {EMAIL}
          </a>
          <p className="mt-2 font-mono text-[12px] uppercase tracking-[0.18em] text-dim">
            Tel: {TEL} · heel Nederland
          </p>
        </div>

        <div className="mt-14 flex flex-col items-center gap-2 border-t border-line pt-8 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
            © 2026 Jager Producties — videoproductie voor bedrijven &amp; events
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-dim">
            KVK {KVK}
          </p>
        </div>
      </div>
    </footer>
  );
}
