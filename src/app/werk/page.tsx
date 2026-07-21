import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { ArrowLink, CtaBand, Frame, PageHeader } from "@/components/ui";
import { MEDIA } from "@/lib/site";

export const metadata: Metadata = {
  title: "Werk — producties van Jager Producties",
  description:
    "Bekijk producties van Jager Producties, waaronder patiëntenfilms voor Stichting Duos, de sportieve clubvideo voor FC De Bilt en de horecavideo voor De Maaltuin.",
};

type CaseItem = {
  tc: string;
  client: string;
  title: string;
  img?: string;
  alt?: string;
  /** Embed-URL — vervangt de foto door een videospeler in het frame. */
  video?: string;
  /** Verticale (9:16) video — frame wordt smaller en gecentreerd. */
  portrait?: boolean;
  meta: string;
  body: string;
  link?: { href: string; label: string };
  facts: string[];
};

const CASES: CaseItem[] = [
  {
    tc: "SELECT 01",
    client: "Stichting Duos",
    title: "Patiëntenfilm, arts Erasmus MC",
    video: "https://www.youtube-nocookie.com/embed/X5uMEyhSCbg?start=3&rel=0",
    meta: "ZORG · PATIËNTENFILM",
    body: "Langdurig contract met Stichting Duos voor het maken van patiëntenfilms. Bekijk de YouTube-pagina van Stichting Duos voor de gemaakte video's.",
    link: {
      href: "https://www.youtube.com/@StichtingduosNl2011",
      label: "Naar de YouTube-pagina van Stichting Duos",
    },
    facts: [
      "Opdrachtgever: Stichting Duos",
      "Genre: patiëntenfilm / zorg",
      "Rol: concept, camera, montage",
    ],
  },
  {
    tc: "SELECT 02",
    client: "FC De Bilt",
    title: "Insta-video bekerwedstrijd",
    video:
      "https://player.vimeo.com/video/1006936645?title=0&byline=0&portrait=0&dnt=1",
    portrait: true,
    meta: "SPORT · SOCIAL",
    body: "Insta-video voor een belangrijke bekerwedstrijd van FC De Bilt. Inclusief dronebeelden en audiomontage.",
    facts: [
      "Opdrachtgever: FC De Bilt",
      "Genre: social video / sport",
      "Rol: drone, camera, audiomontage",
    ],
  },
  {
    tc: "SELECT 03",
    client: "Swim to Fight Cancer",
    title: "Aftermovie Stichtse Vecht",
    video:
      "https://player.vimeo.com/video/1014734945?title=0&byline=0&portrait=0&dnt=1",
    meta: "EVENT · AFTERMOVIE",
    body: "Aftermovie van Swim to Fight Cancer in Stichtse Vecht, het zwemevenement waar deelnemers geld ophalen voor de strijd tegen kanker. Ook hier met dronebeelden.",
    facts: [
      "Opdrachtgever: Swim to Fight Cancer Stichtse Vecht",
      "Genre: aftermovie / event",
      "Rol: drone, camera, montage",
    ],
  },
  {
    tc: "SELECT 04",
    client: "Kunstmarkt De Bilt",
    title: "Sfeerimpressie",
    video:
      "https://player.vimeo.com/video/1011277435?title=0&byline=0&portrait=0&dnt=1",
    meta: "EVENT · SFEER",
    body: "Sfeerimpressie van de Kunstmarkt in De Bilt: de kramen, de kunst en de bezoekers, gevangen in een korte film.",
    facts: [
      "Opdrachtgever: Kunstmarkt De Bilt",
      "Genre: sfeerimpressie / event",
      "Rol: camera, montage",
    ],
  },
  {
    tc: "SELECT 05",
    client: "FC De Bilt",
    title: "Sportieve clubvideo",
    img: MEDIA.floodlitPitch,
    alt: "Verlicht amateurvoetbalveld in de avond",
    meta: "SPORT · CLUB",
    body: "Een voetbalclub is meer dan negentig minuten op zaterdag. Voor FC De Bilt draaide ik een sportieve clubvideo die dat gevoel vangt: het veld, de leden, de energie langs de lijn. Een film waarmee de club zich laat zien aan nieuwe leden én aan sponsors.",
    facts: ["Opdrachtgever: FC De Bilt", "Genre: clubvideo / sport", "Rol: concept, camera, montage"],
  },
  {
    tc: "SELECT 06",
    client: "De Maaltuin",
    title: "Horecavideo",
    img: MEDIA.openKitchen,
    alt: "Open restaurantkeuken met grill en koks in warm licht",
    meta: "HORECA · SFEER",
    body: "Bij horeca draait alles om sfeer — en sfeer moet je kunnen proeven vóór je binnenstapt. Voor De Maaltuin maakte ik een horecavideo waarin de keuken, de borden en de gastvrijheid samen het verhaal vertellen. Beeld dat honger maakt.",
    facts: ["Opdrachtgever: De Maaltuin", "Genre: horecavideo", "Rol: concept, camera, montage"],
  },
];

export default function WerkPage() {
  return (
    <>
      <PageHeader
        kicker="Werk"
        title="De selects"
        intro="Ons werk, variërend van bedrijfsvideo's tot testimonials en van social media campagnes tot aftermovies."
      />

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl space-y-24">
          {CASES.map((c) => (
            <Reveal key={c.tc}>
              <article>
                <div className={c.portrait ? "mx-auto max-w-[400px]" : undefined}>
                  <Frame
                    src={c.img}
                    alt={c.alt}
                    caption={`${c.client} — ${c.title}`}
                    meta={c.meta}
                    ratio={
                      c.video
                        ? c.portrait
                          ? "aspect-[9/16]"
                          : "aspect-video"
                        : undefined
                    }
                  >
                    {c.video ? (
                      <iframe
                        src={c.video}
                        title={`${c.client} — ${c.title}`}
                        loading="lazy"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 h-full w-full"
                      />
                    ) : undefined}
                  </Frame>
                </div>
                <div className="mt-8 grid gap-8 md:grid-cols-[1fr_280px]">
                  <div>
                    <p className="font-mono text-sm text-amber">{c.tc}</p>
                    <h2 className="mt-3 font-display text-3xl uppercase tracking-wide sm:text-4xl">
                      {c.client}: {c.title}
                    </h2>
                    <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-dim">
                      {c.body}
                    </p>
                    {c.link && (
                      <a
                        href={c.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group mt-5 inline-flex items-center gap-2 font-mono text-[13px] uppercase tracking-[0.18em] text-amber"
                      >
                        <span
                          aria-hidden
                          className="transition-transform duration-300 group-hover:translate-x-1"
                        >
                          ▶
                        </span>
                        <span className="underline decoration-amber/40 underline-offset-4 group-hover:decoration-amber">
                          {c.link.label}
                        </span>
                      </a>
                    )}
                  </div>
                  <ul className="h-fit space-y-2 border-l-2 border-amber/60 pl-5 md:mt-10">
                    {c.facts.map((f) => (
                      <li
                        key={f}
                        className="font-mono text-[12.5px] uppercase tracking-[0.1em] text-ink/80"
                      >
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}

          {/* Eerlijk over de rest van de rol */}
          <Reveal>
            <div className="border border-dashed border-line px-6 py-12 text-center md:px-12 md:py-16">
              <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-amber">
                Select 07 — nog leeg
              </p>
              <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl uppercase leading-tight tracking-wide sm:text-4xl">
                Deze plek is gereserveerd voor jouw productie
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-dim">
                Ik zet hier alleen werk neer dat ik echt heb gemaakt. Liever een
                korte, eerlijke rol dan een pagina vol geleende logo&apos;s.
                Beeldmateriaal van de volgende productie kan hier over een paar
                weken staan.
              </p>
              <ArrowLink href="/contact" className="mt-8">
                Claim deze plek
              </ArrowLink>
            </div>
          </Reveal>
        </div>
      </section>

      <CtaBand title="Zien we jouw naam in de volgende select?" />
    </>
  );
}
