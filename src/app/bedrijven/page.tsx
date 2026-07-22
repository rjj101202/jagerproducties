import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { ArrowLink, CtaBand, Frame, PageHeader, Slate } from "@/components/ui";
import { MEDIA } from "@/lib/site";

export const metadata: Metadata = {
  title: "Video voor bedrijven — bedrijfsfilm, recruitment, product & social",
  description:
    "Bedrijfsfilms, recruitmentvideo's, productvideo's en social content die je merk laten zien zoals het echt is. Eén videograaf, korte lijnen, oplevering in elk formaat.",
};

const DIENSTEN = [
  {
    nr: "01",
    title: "Bedrijfsfilm",
    img: MEDIA.office,
    alt: "Team aan het werk in een licht, modern kantoor",
    caption: "Het bedrijf zoals het echt is",
    meta: "60–120 SEC",
    body: "Het visitekaartje in beweging: wie je bent, hoe je werkt en waarom klanten voor je kiezen. Geen stockgevoel, maar jouw mensen op jouw vloer. Sterk op je homepage, in pitches en op beurzen.",
    points: ["Hoofdfilm 60–120 sec", "Cutdown voor social", "Stills uit het beeldmateriaal"],
  },
  {
    nr: "02",
    title: "Recruitmentvideo",
    img: MEDIA.cameraOperator,
    alt: "Cameraman filmt een gesprek in warm licht",
    caption: "Collega's aan het woord",
    meta: "45–90 SEC",
    body: "Vacatureteksten beloven; beeld bewijst. Een recruitmentvideo laat kandidaten alvast binnen: de werkvloer, de sfeer, collega's die eerlijk vertellen. Dat scheelt mismatches en trekt de mensen die passen.",
    points: ["Interviews op locatie", "Sfeerbeeld van de werkvloer", "9:16-versies voor vacaturecampagnes"],
  },
  {
    nr: "03",
    title: "Productvideo",
    img: MEDIA.filmRig,
    alt: "Professionele cinemacamera met monitor op een set",
    caption: "Het product in het beste licht",
    meta: "30–60 SEC",
    body: "Van machine tot menukaart: een productvideo laat zien wat foto's niet kunnen — werking, detail en gevoel. Strak belicht, strak gemonteerd, gemaakt om te converteren op productpagina en social.",
    points: ["Studio- of locatieshoot", "Detailshots & werking", "Versies per kanaal"],
  },
  {
    nr: "04",
    title: "Social content",
    img: MEDIA.videographerOutdoor,
    alt: "Videograaf met camera buiten aan het werk",
    caption: "Kort werk dat blijft plakken",
    meta: "SERIES · 9:16",
    body: "Eén draaidag, een serie korte video's: reels, shorts en stories die je kanalen wekenlang vullen. Gedraaid met hetzelfde oog als de grote films, maar gesneden op het tempo van de scroll.",
    points: ["Contentdag op locatie", "Serie van korte edits", "Aangeleverd per platform"],
  },
];

export default function BedrijvenPage() {
  return (
    <>
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
              title="Wat ik voor bedrijven maak"
            />
          </Reveal>

          <div className="mt-14 space-y-20">
            {DIENSTEN.map((d, i) => (
              <Reveal key={d.nr}>
                <div
                  className={`grid items-center gap-8 lg:grid-cols-2 ${
                    i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <Frame
                    src={d.img}
                    alt={d.alt}
                    caption={d.caption}
                    meta={d.meta}
                    ratio="aspect-[16/9]"
                  />
                  <div>
                    <p className="font-mono text-sm text-amber">TAKE {d.nr}</p>
                    <h3 className="mt-3 font-display text-3xl uppercase tracking-wide sm:text-4xl">
                      {d.title}
                    </h3>
                    <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-dim">
                      {d.body}
                    </p>
                    <ul className="mt-5 space-y-1.5">
                      {d.points.map((p) => (
                        <li
                          key={p}
                          className="flex items-baseline gap-3 font-mono text-[13px] uppercase tracking-[0.1em] text-ink/80"
                        >
                          <span aria-hidden className="text-amber">▶</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Slate
              scene="02"
              tc="00:01:45:00"
              title="Werk voor bedrijven"
              intro="Een greep uit recent werk: een brand video en een reel, gemaakt voor MPower."
            />
          </Reveal>

          <div className="mt-14 space-y-16">
            <Reveal>
              <Frame
                caption="MPower — brand video"
                meta="BRAND · 16:9"
                ratio="aspect-video"
              >
                <iframe
                  src="https://player.vimeo.com/video/1046776509?title=0&byline=0&portrait=0&dnt=1"
                  title="MPower — brand video"
                  loading="lazy"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </Frame>
            </Reveal>

            <Reveal>
              <div className="mx-auto max-w-[400px]">
                <Frame
                  caption="MPower — reel"
                  meta="SOCIAL · 9:16"
                  ratio="aspect-[9/16]"
                >
                  <iframe
                    src="https://player.vimeo.com/video/1056811949?title=0&byline=0&portrait=0&dnt=1"
                    title="MPower — reel"
                    loading="lazy"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </Frame>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-panel/40 px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Slate
              scene="03"
              tc="00:03:10:12"
              title="Zo blijft het behapbaar"
              intro="Grote productiewaarde zonder groot productiehuis. Dit mag je verwachten:"
            />
          </Reveal>
          <div className="mt-10 grid gap-px border border-line bg-line sm:grid-cols-3">
            {[
              {
                t: "Eén aanspreekpunt",
                b: "Je schakelt rechtstreeks met de maker — geen accountmanager ertussen.",
              },
              {
                t: "Vaste prijs vooraf",
                b: "Na één gesprek krijg je een voorstel met een vaste prijs. Offerte op aanvraag, geen verrassingen achteraf.",
              },
              {
                t: "Alle formats",
                b: "16:9, 9:16 en 1:1 — je video werkt op je site, in presentaties én op social.",
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
    </>
  );
}
