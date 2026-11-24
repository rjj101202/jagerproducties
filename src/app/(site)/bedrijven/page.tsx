import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition } from "react";
import PageSlide from "@/components/PageSlide";
import Reveal from "@/components/Reveal";
import {
  ArrowLink,
  CtaBand,
  Frame,
  PageHeader,
  Slate,
  VideoEmbed,
} from "@/components/ui";
import { CASES } from "@/lib/cases";

export const metadata: Metadata = {
  title: "Video voor bedrijven — bedrijfsfilm, recruitment, product & social",
  description:
    "Bedrijfsfilms, recruitmentvideo's, productvideo's en social content die je merk laten zien zoals het echt is. Eén videograaf, korte lijnen, oplevering in elk formaat.",
};

export default function BedrijvenPage() {
  return (
    <PageSlide>
      <PageHeader
        kicker="Voor bedrijven"
        title="Films die je merk vertellen"
        intro="Een goede bedrijfsvideo voelt niet als reclame, maar als een eerlijk verhaal dat toevallig heel goed gefilmd is. Dat is precies wat ik maak: beeld waarin klanten en kandidaten jouw bedrijf herkennen."
      />

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Slate
              scene="01"
              tc="00:00:08:00"
              title="Casussen"
              intro="Drie opdrachtgevers, drie verhalen. Bekijk de film en klik door naar de casus voor de achtergrond en de andere video's uit het project."
            />
          </Reveal>

          <nav
            aria-label="Casussen"
            className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-3"
          >
            {CASES.map((c, i) => (
              <a
                key={c.slug}
                href={`#${c.slug}`}
                className="group flex items-baseline gap-4 bg-coal px-5 py-4 transition-colors hover:bg-panel"
              >
                <span className="font-mono text-[12px] text-amber">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-lg uppercase tracking-wide">
                  {c.client}
                </span>
                <span
                  aria-hidden
                  className="ml-auto font-mono text-[12px] text-dim transition-transform group-hover:translate-y-0.5"
                >
                  ↓
                </span>
              </a>
            ))}
          </nav>

          <div className="mt-20 space-y-24 md:space-y-32">
            {CASES.map((c, i) => (
              <article
                key={c.slug}
                id={c.slug}
                className="scroll-mt-28"
                aria-labelledby={`case-${c.slug}`}
              >
                <div className="mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
                  <div>
                    <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-amber">
                      Casus {String(i + 1).padStart(2, "0")} /{" "}
                      {String(CASES.length).padStart(2, "0")}
                    </p>
                    <ViewTransition name={`case-title-${c.slug}`} share="case-title">
                      <h3
                        id={`case-${c.slug}`}
                        className="mt-3 w-fit font-display text-5xl uppercase leading-none tracking-wide sm:text-6xl"
                      >
                        {c.client}
                      </h3>
                    </ViewTransition>
                  </div>
                  <p className="max-w-sm font-mono text-[12.5px] uppercase tracking-[0.12em] text-dim">
                    {c.tagline}
                  </p>
                </div>

                <Reveal>
                  <Frame
                    caption={c.hero.title}
                    meta={c.hero.meta}
                    ratio="aspect-video"
                  >
                    <VideoEmbed {...c.hero} />
                  </Frame>
                </Reveal>

                <Reveal>
                  <div className="mt-8 grid items-start gap-8 md:grid-cols-[1fr_320px]">
                    <p className="max-w-2xl text-[17px] leading-relaxed text-dim">
                      {c.summary}
                    </p>
                    <Link
                      href={`/bedrijven/${c.slug}`}
                      transitionTypes={["nav-forward"]}
                      className="group flex items-center justify-between gap-4 border border-amber px-6 py-5 transition-colors hover:bg-amber"
                    >
                      <span>
                        <span className="block font-mono text-[12px] uppercase tracking-[0.18em] text-amber group-hover:text-coal">
                          Bekijk de casus
                        </span>
                        <span className="mt-1 block font-mono text-[11.5px] uppercase tracking-[0.14em] text-dim group-hover:text-coal/70">
                          {c.more.length + 1} video
                          {c.more.length + 1 === 1 ? "" : "'s"} · achtergrond
                        </span>
                      </span>
                      <span
                        aria-hidden
                        className="font-mono text-amber transition-transform duration-300 group-hover:translate-x-1 group-hover:text-coal"
                      >
                        ▶
                      </span>
                    </Link>
                  </div>
                </Reveal>
              </article>
            ))}
          </div>

          <Reveal className="mt-24 border-t border-line pt-14">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.4fr]">
              <div>
                <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-amber">
                  Ook gemaakt
                </p>
                <h3 className="mt-3 font-display text-3xl uppercase tracking-wide">
                  De Borrelplank van
                </h3>
                <p className="mt-3 max-w-md text-[15.5px] leading-relaxed text-dim">
                  Een podcastserie over theater, op video vastgelegd.
                </p>
              </div>
              <Frame
                caption="De Borrelplank van — podcastserie over theater"
                meta="PODCAST · 16:9"
                ratio="aspect-video"
              >
                <VideoEmbed
                  src="https://player.vimeo.com/video/1020932745?title=0&byline=0&portrait=0&dnt=1"
                  title="De Borrelplank van — podcastserie over theater"
                />
              </Frame>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line bg-panel/40 px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Slate
              scene="02"
              tc="00:03:10:12"
              title="Zo blijft het behapbaar"
              intro="Grote productiewaarde zonder groot productiehuis. Dit mag je verwachten:"
            />
          </Reveal>
          <div className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-3">
            {[
              {
                t: "Eén aanspreekpunt",
                b: "Je schakelt rechtstreeks met de maker, zonder accountmanager ertussen.",
              },
              {
                t: "Vaste prijs vooraf",
                b: "Na één gesprek krijg je een voorstel met een vaste prijs. Offerte op aanvraag, geen verrassingen achteraf.",
              },
              {
                t: "Alle formats",
                b: "16:9, 9:16 en 1:1: je video werkt op je site, in presentaties én op social.",
              },
            ].map((c) => (
              <div key={c.t} className="bg-coal p-7">
                <h3 className="font-display text-xl uppercase tracking-wide">
                  {c.t}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-dim">{c.b}</p>
              </div>
            ))}
          </div>
          <Reveal className="mt-10">
            <ArrowLink href="/werk">Bekijk eerst het werk</ArrowLink>
          </Reveal>
        </div>
      </section>

      <CtaBand title="Vertel me wat je bedrijf te vertellen heeft." />
    </PageSlide>
  );
}
