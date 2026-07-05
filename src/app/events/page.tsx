import type { Metadata } from "next";
import HeroVideo from "@/components/HeroVideo";
import Reveal from "@/components/Reveal";
import { ArrowLink, CtaBand, Frame, NumberRow, PageHeader, Slate } from "@/components/ui";
import { MEDIA } from "@/lib/site";

export const metadata: Metadata = {
  title: "Video voor events — aftermovies, sport, festivals en verenigingen",
  description:
    "Aftermovies, sportregistraties en festivalvideo's die de energie van je event vasthouden. Gedraaid tussen het publiek, gemonteerd op het ritme van de avond.",
};

const TYPES = [
  {
    nr: "01",
    title: "Aftermovie",
    img: MEDIA.festivalFire,
    alt: "Feestend publiek voor een podium met vuureffecten",
    caption: "De avond in twee minuten",
    meta: "60–180 SEC",
    body: "Het event is voorbij, de aftermovie begint. Eén film die de energie vasthoudt: voor iedereen die erbij was om te delen, en voor iedereen die er volgend jaar bij wíl zijn. Jouw beste verkoopmiddel voor de volgende editie.",
  },
  {
    nr: "02",
    title: "Sportevenement",
    img: MEDIA.floodlitPitch,
    alt: "Verlicht voetbalveld in de avond",
    caption: "Van warming-up tot laatste fluitsignaal",
    meta: "WEDSTRIJD · TOERNOOI",
    body: "Toernooien, wedstrijden, clubdagen. Ik ken het ritme van sport — anticiperen op het moment in plaats van erachteraan filmen. Voor FC De Bilt maakte ik een sportieve clubvideo die club én leden liet zien waar ze bij horen.",
  },
  {
    nr: "03",
    title: "Festival & podium",
    img: MEDIA.arenaLights,
    alt: "Podium met lichtshow en publiek in een volle zaal",
    caption: "Licht, geluid en publiek in één frame",
    meta: "LIVE",
    body: "Draaien in het donker, tussen lichtshow en publiek — dat is een vak apart. Ik film onopvallend, zonder de beleving te storen, en lever beeld waarin je de bas bijna voelt.",
  },
  {
    nr: "04",
    title: "Club & vereniging",
    img: MEDIA.monitorShot,
    alt: "Videograaf controleert beeld op de monitor tijdens een opname",
    caption: "Het verhaal van jouw club",
    meta: "LEDEN · SPONSORS",
    body: "Een clubvideo werft leden, bedankt vrijwilligers en geeft sponsors een podium. Eén draaidag rond een training, wedstrijd of clubavond levert materiaal op waar de vereniging jaren mee vooruit kan.",
  },
];

export default function EventsPage() {
  return (
    <>
      <PageHeader
        kicker="Voor events"
        title="Films die het weer laten gebeuren"
        intro="Een event duurt één avond; de video ervan gaat jaren mee. Ik film tussen het publiek, niet erboven — zodat je de energie terugvoelt bij elke seconde."
      />

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Frame
              caption="Sfeerbeeld: publiek bij avond"
              meta="STOCK · TER ILLUSTRATIE"
            >
              <HeroVideo src={MEDIA.eventsVideo} poster={MEDIA.arenaLights} />
            </Frame>
          </Reveal>
        </div>
      </section>

      <section className="px-5 pb-16 md:px-8 md:pb-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Slate scene="01" tc="00:00:06:00" title="Wat ik voor events maak" />
          </Reveal>

          <div className="mt-14 space-y-20">
            {TYPES.map((d, i) => (
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
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-panel/40 px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <Slate
              scene="02"
              tc="00:04:20:08"
              title="Zo verloopt een eventproductie"
              intro="Events kennen geen tweede take. Daarom zit de voorbereiding aan de voorkant:"
            />
          </Reveal>
          <div className="mt-10 border-b border-line">
            <Reveal>
              <NumberRow index="VOORAF" title="Draaiboek & shotlist">
                <p>
                  We lopen het programma samen door: de momenten die er
                  écht in moeten, de plekken waar ik mag staan en de mensen die
                  in beeld komen. Zo mis ik niets — ook niet wat niet gepland was.
                </p>
              </NumberRow>
            </Reveal>
            <Reveal>
              <NumberRow index="DE DAG" title="Onzichtbaar aanwezig">
                <p>
                  Compacte set-up, geen lampenpark of camera in iemands gezicht.
                  Ik beweeg mee met het event en vang het moment zonder het te
                  verstoren.
                </p>
              </NumberRow>
            </Reveal>
            <Reveal>
              <NumberRow index="ERNA" title="Snel online">
                <p>
                  De buzz is het grootst vlak na afloop. In overleg plannen we de
                  oplevering daarop: eerst een korte teaser voor social, daarna de
                  volledige aftermovie.
                </p>
              </NumberRow>
            </Reveal>
          </div>
          <Reveal className="mt-10">
            <ArrowLink href="/werk">Lees meer over de FC De Bilt-productie</ArrowLink>
          </Reveal>
        </div>
      </section>

      <CtaBand title="Vertel me wanneer je event is — dan hou ik de datum vrij." />
    </>
  );
}
