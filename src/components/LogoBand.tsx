/* eslint-disable @next/next/no-img-element */
import { CLIENT_LOGOS } from "@/lib/site";

/**
 * Doorlopende band met logo's van opdrachtgevers, direct onder de hero.
 * Elke helft herhaalt de reeks zodat hij breder is dan elk scherm; de
 * track schuift precies één helft op en loopt zo naadloos rond.
 */
export default function LogoBand() {
  const REPEAT = 3;
  const half = Array.from({ length: REPEAT }, (_, r) =>
    CLIENT_LOGOS.map((logo) => ({ logo, copy: r }))
  ).flat();

  const row = (key: string, hidden: boolean) => (
    <ul key={key} aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {half.map(({ logo, copy }) => (
        <li
          key={`${logo.name}-${copy}`}
          aria-hidden={hidden || copy > 0 || undefined}
          className="flex items-center px-8 md:px-12"
        >
          <img
            src={logo.src}
            alt={hidden || copy > 0 ? "" : logo.name}
            width={logo.width}
            height={logo.height}
            loading="lazy"
            style={{ height: logo.displayHeight, width: "auto" }}
            className={`max-w-none transition duration-300 ${
              logo.badge
                ? "opacity-60 grayscale hover:opacity-100 hover:grayscale-0"
                : "opacity-60 brightness-0 invert hover:opacity-100"
            }`}
          />
        </li>
      ))}
    </ul>
  );

  return (
    <section
      aria-label="Opdrachtgevers"
      className="overflow-hidden border-b border-line py-8 md:py-10"
    >
      <p className="mb-6 text-center font-mono text-[11px] uppercase tracking-[0.22em] text-dim">
        Gefilmd voor onder meer
      </p>
      <div className="marquee-mask">
        <div className="marquee-track">
          {row("a", false)}
          {row("b", true)}
        </div>
      </div>
    </section>
  );
}
