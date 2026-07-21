import Link from "next/link";
import type { ReactNode } from "react";
import { MAILTO, TEL } from "@/lib/site";

/** Sectiekop als filmslate: scene-nummer + timecode + titel. */
export function Slate({
  scene,
  tc,
  title,
  intro,
}: {
  scene: string;
  tc: string;
  title: string;
  intro?: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[12px] uppercase tracking-[0.22em] text-dim">
        <span className="text-amber">Scene {scene}</span>
        <span aria-hidden className="hidden h-px w-10 bg-line sm:block" />
        <span>TC {tc}</span>
      </p>
      <h2 className="mt-4 font-display text-4xl uppercase leading-[1.05] tracking-wide sm:text-5xl">
        {title}
      </h2>
      {intro && (
        <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-dim">
          {intro}
        </p>
      )}
    </div>
  );
}

/** Paginakop voor subpagina's. */
export function PageHeader({
  kicker,
  title,
  intro,
}: {
  kicker: string;
  title: string;
  intro: string;
}) {
  return (
    <div className="border-b border-line px-5 pb-14 pt-32 md:px-8 md:pb-20 md:pt-40">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-amber">
          {kicker}
        </p>
        <h1 className="title-rise mt-4 max-w-4xl font-display text-5xl uppercase leading-[1.02] tracking-wide sm:text-6xl md:text-7xl">
          {title}
        </h1>
        <p className="title-rise-late mt-6 max-w-2xl text-lg leading-relaxed text-dim">
          {intro}
        </p>
      </div>
    </div>
  );
}

/** Zoekerhoekjes (viewfinder corners) om een frame heen. */
function Corners() {
  const base = "absolute h-4 w-4 border-amber/80";
  return (
    <span aria-hidden className="pointer-events-none absolute inset-3 z-10">
      <span className={`${base} left-0 top-0 border-l-2 border-t-2`} />
      <span className={`${base} right-0 top-0 border-r-2 border-t-2`} />
      <span className={`${base} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${base} bottom-0 right-0 border-b-2 border-r-2`} />
    </span>
  );
}

/**
 * Letterbox-frame: breed beeld met zoekerhoekjes en een mono-onderschrift,
 * alsof je naar één shot uit de montage kijkt.
 */
export function Frame({
  src,
  alt,
  caption,
  meta,
  ratio = "aspect-[21/9]",
  children,
}: {
  src?: string;
  alt?: string;
  caption: string;
  meta: string;
  ratio?: string;
  children?: ReactNode;
}) {
  return (
    <figure>
      <div
        className={`group relative overflow-hidden border border-line bg-panel ${ratio}`}
      >
        <Corners />
        {children ?? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt ?? caption}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        )}
      </div>
      <figcaption className="flex items-baseline justify-between gap-4 border-x border-b border-line bg-panel px-4 py-3">
        <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-ink">
          {caption}
        </span>
        <span className="shrink-0 font-mono text-[12px] tracking-[0.16em] text-dim">
          {meta}
        </span>
      </figcaption>
    </figure>
  );
}

/** Genummerde rij (dienst / stap): mono-index links, inhoud rechts. */
export function NumberRow({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-3 border-t border-line py-8 md:grid-cols-[100px_1fr] md:gap-8 md:py-10">
      <span className="font-mono text-sm text-amber">{index}</span>
      <div>
        <h3 className="font-display text-2xl uppercase tracking-wide sm:text-3xl">
          {title}
        </h3>
        <div className="mt-3 max-w-2xl text-[15.5px] leading-relaxed text-dim">
          {children}
        </div>
      </div>
    </div>
  );
}

/** Afsluitende CTA-band, op elke pagina. */
export function CtaBand({
  title = "Eén kort gesprek is genoeg om te weten of het klikt.",
  note = "Geen verplichtingen, geen standaardpakketten. Je krijgt na het gesprek een voorstel op maat.",
}: {
  title?: string;
  note?: string;
}) {
  return (
    <section className="border-t border-line bg-panel/60">
      <div className="mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">
        <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-amber">
          Laatste scene — jouw cue
        </p>
        <h2 className="mt-4 max-w-3xl font-display text-4xl uppercase leading-[1.05] tracking-wide sm:text-5xl">
          {title}
        </h2>
        <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-dim">{note}</p>
        <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
          <a
            href={MAILTO}
            className="inline-flex items-center gap-3 border border-amber bg-amber px-7 py-4 font-mono text-[13px] uppercase tracking-[0.18em] text-coal transition-colors hover:bg-transparent hover:text-amber"
          >
            <span aria-hidden>▶</span> Mail: info@jagerproducties.nl
          </a>
          <span className="font-mono text-[13px] uppercase tracking-[0.18em] text-dim">
            of bel: <span className="text-ink">{TEL}</span>
          </span>
        </div>
      </div>
    </section>
  );
}

/** Tekstlink in mono-stijl met play-pijl. */
export function ArrowLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 font-mono text-[13px] uppercase tracking-[0.18em] text-amber ${className}`}
    >
      <span
        aria-hidden
        className="transition-transform duration-300 group-hover:translate-x-1"
      >
        ▶
      </span>
      <span className="underline decoration-amber/40 underline-offset-4 group-hover:decoration-amber">
        {children}
      </span>
    </Link>
  );
}
