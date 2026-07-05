import Link from "next/link";
import HeroVideo from "@/components/HeroVideo";
import Reveal from "@/components/Reveal";
import { ArrowLink, CtaBand, Frame, NumberRow, Slate } from "@/components/ui";
import { MAILTO, MEDIA } from "@/lib/site";

const STEPS: { nr: string; title: string; body: string }[] = [
  {
    nr: "STAP 01",
    title: "Gesprek & concept",
    body: "We bellen of drinken koffie. Wat moet de video doen, voor wie, en waar ga je hem inzetten? Daarna krijg je een concreet voorstel: concept, planning en prijs.",
  },
  {
    nr: "STAP 02",
    title: "De draaidag",
    body: "Eén videograaf, compacte set, geen circus. Ik werk met een shotlist maar houd ruimte voor het moment — daar zitten meestal de beste beelden.",
  },
  {
    nr: "STAP 03",
    title: "Montage & kleur",
    body: "Monteren, kleurgraden, geluid en muziek. Je kijkt tussentijds mee en er zit standaard een feedbackronde in — geen verrassingen bij oplevering.",
  },
  {
    nr: "STAP 04",
    title: "Oplevering in elk formaat",
    body: "De hoofdfilm plus versies voor waar je publiek zit: 16:9 voor site en presentatie, 9:16 en 1:1 voor social. Klaar om te publiceren.",
  },
];

export default function Home() {
  return (
    <>
      {/* ——— HERO: fullscreen shot uit de montage ——— */}
      <section className="grain relative flex h-svh max-h-[1100px] min-h-[640px] flex-col justify-end overflow-hidden">
        <HeroVideo src={MEDIA.heroVideo} poster={MEDIA.heroPoster} />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-coal via-coal/45 to-coal/25"
        />

        {/* mono-metadata bovenin het frame */}
        <div className="absolute inset-x-0 top-16 z-10 mx-auto flex max-w-6xl items-center justify-between px-5 pt-5 font-mono text-[11px] uppercase tracking-[0.22em] text-ink/70 md:px-8">
          <span>Shot 001 — A-cam</span>
          <span className="hidden sm:inline">4K · 25 fps</span>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 md:px-8 md:pb-24">
          <p className="title-rise font-mono text-[12px] uppercase tracking-[0.25em] text-amber">
            Videoproductie voor bedrijven &amp; events
          </p>
          <h1 className="title-rise mt-5 max-w-4xl font-display text-[13vw] uppercase leading-[0.98] tracking-wide sm:text-7xl md:text-8xl">
            Beeld dat
            <br />
            blijft hangen
          </h1>
          <p className="title-rise-late mt-6 max-w-xl text-lg leading-relaxed text-ink/85">
            Van bedrijfsfilm tot aftermovie: Jager Producties draait, monteert
            en levert video waar je publiek naar blíjft kijken. Eén maker, van
            eerste idee tot laatste frame.
          </p>
          <div className="title-rise-late mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
            <a
              href={MAILTO}
              className="inline-flex items-center gap-3 border border-amber bg-amber px-7 py-4 font-mono text-[13px] uppercase tracking-[0.18em] text-coal transition-colors hover:bg-transparent hover:text-amber"
            >
              <span aria-hidden>▶</span> Plan een kort gesprek
            </a>
            <ArrowLink href="/werk">Bekijk het werk</ArrowLink>
          </div>
        </div>
      </section>

      {/* ——— SCENE 01: voor wie — double bill ——— */}
      <section className="px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Slate
              scene="01"
              tc="00:00:12:00"
              title="Twee soorten films, één maker"
              intro="Bedrijven en events vragen elk om een ander ritme. Kies je kant van de affiche."
            />
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              {
                href: "/bedrijven",
                img: MEDIA.cameraOperator,
                alt: "Cameraman filmt een interviewopstelling in warm licht",
                kicker: "Voor bedrijven",
                title: "Films die je merk vertellen",
                items: [
                  "Bedrijfsfilm",
                  "Recruitmentvideo",
                  "Productvideo",
                  "Social content",
                ],
              },
              {
                href: "/events",
                img: MEDIA.festivalFire,
                alt: "Publiek met geheven armen voor een podium met vuureffecten",
                kicker: "Voor events",
                title: "Films die het weer laten gebeuren",
                items: [
                  "Aftermovie",
                  "Sportevenement",
                  "Festival & podium",
                  "Club & vereniging",
                ],
              },
            ].map((card, i) => (
              <Reveal key={card.href} delay={i * 120}>
                <Link
                  href={card.href}
                  className="group relative block aspect-[4/5] overflow-hidden border border-line sm:aspect-[3/4] md:aspect-[4/5] lg:aspect-[3/4]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={card.img}
                    alt={card.alt}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-coal via-coal/35 to-transparent"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                    <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-amber">
                      {card.kicker}
                    </p>
                    <h3 className="mt-2 font-display text-3xl uppercase leading-tight tracking-wide sm:text-4xl">
                      {card.title}
                    </h3>
                    <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[12px] uppercase tracking-[0.14em] text-ink/75">
                      {card.items.map((it) => (
                        <li key={it}>· {it}</li>
                      ))}
                    </ul>
                    <span className="mt-5 inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.18em] text-amber">
                      <span
                        aria-hidden
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      >
                        ▶
                      </span>
                      Bekijk {card.kicker.toLowerCase().replace("voor ", "")}
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ——— SCENE 02: uitgelicht werk ——— */}
      <section className="border-t border-line bg-panel/40 px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Slate
              scene="02"
              tc="00:01:24:16"
              title="Uit de selects"
              intro="Twee producties die laten zien hoe ik werk: dichtbij, met gevoel voor de plek en de mensen."
            />
          </Reveal>

          <div className="mt-12 space-y-14">
            <Reveal>
              <Frame
                src={MEDIA.floodlitPitch}
                alt="Verlicht amateurvoetbalveld in de avond"
                caption="FC De Bilt — sportieve clubvideo"
                meta="SPORT · CLUB"
              />
            </Reveal>
            <Reveal>
              <Frame
                src={MEDIA.openKitchen}
                alt="Open restaurantkeuken met grill en koks in warm licht"
                caption="De Maaltuin — horecavideo"
                meta="HORECA · SFEER"
              />
            </Reveal>
          </div>

          <Reveal className="mt-10">
            <ArrowLink href="/werk">Naar het volledige werk</ArrowLink>
          </Reveal>
        </div>
      </section>

      {/* ——— SCENE 03: werkwijze ——— */}
      <section className="px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Slate
              scene="03"
              tc="00:02:48:05"
              title="Van eerste idee tot laatste frame"
              intro="Geen productiehuis met tien schakels — je werkt van begin tot eind met dezelfde maker."
            />
          </Reveal>
          <div className="mt-12 border-b border-line">
            {STEPS.map((s, i) => (
              <Reveal key={s.nr} delay={i * 80}>
                <NumberRow index={s.nr} title={s.title}>
                  <p>{s.body}</p>
                </NumberRow>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ——— SCENE 04: de maker ——— */}
      <section className="border-t border-line bg-panel/40 px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <Reveal>
            <Frame
              src={MEDIA.videographerOutdoor}
              alt="Videograaf met camera aan het werk op locatie"
              caption="Achter de camera"
              meta="ON LOCATION"
              ratio="aspect-[4/3]"
            />
          </Reveal>
          <Reveal delay={120}>
            <div>
              <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-amber">
                Scene 04 — De maker
              </p>
              <h2 className="mt-4 font-display text-4xl uppercase leading-[1.05] tracking-wide sm:text-5xl">
                Remy Jager
              </h2>
              <p className="mt-5 text-[17px] leading-relaxed text-dim">
                Videograaf. Ik geloof in klein en dichtbij: één maker die je
                verhaal snapt, zelf draait en zelf monteert. Daardoor blijft de
                lijn kort en het beeld persoonlijk — van het eerste
                belletje tot de master die je online zet.
              </p>
              <ArrowLink href="/over" className="mt-7">
                Meer over de maker
              </ArrowLink>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
