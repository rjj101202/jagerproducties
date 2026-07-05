import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { ArrowLink, CtaBand, Frame, PageHeader } from "@/components/ui";
import { MEDIA } from "@/lib/site";

export const metadata: Metadata = {
  title: "Werk — producties van Jager Producties",
  description:
    "Bekijk producties van Jager Producties, waaronder de sportieve clubvideo voor FC De Bilt en de horecavideo voor De Maaltuin.",
};

const CASES = [
  {
    tc: "SELECT 01",
    client: "FC De Bilt",
    title: "Sportieve clubvideo",
    img: MEDIA.floodlitPitch,
    alt: "Verlicht amateurvoetbalveld in de avond",
    meta: "SPORT · CLUB",
    body: "Een voetbalclub is meer dan negentig minuten op zaterdag. Voor FC De Bilt draaide ik een sportieve clubvideo die dat gevoel vangt: het veld, de leden, de energie langs de lijn. Een film waarmee de club zich laat zien aan nieuwe leden én aan sponsors.",
    facts: ["Opdrachtgever: FC De Bilt", "Genre: clubvideo / sport", "Rol: concept, camera, montage"],
  },
  {
    tc: "SELECT 02",
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
        intro="Wat hier staat, is echt gemaakt en echt geleverd — geen opgeklopte logowall. De rol is nog jong en groeit per productie. Kwaliteit boven kwantiteit, elke keer."
      />

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl space-y-24">
          {CASES.map((c) => (
            <Reveal key={c.client}>
              <article>
                <Frame src={c.img} alt={c.alt} caption={`${c.client} — ${c.title}`} meta={c.meta} />
                <div className="mt-8 grid gap-8 md:grid-cols-[1fr_280px]">
                  <div>
                    <p className="font-mono text-sm text-amber">{c.tc}</p>
                    <h2 className="mt-3 font-display text-3xl uppercase tracking-wide sm:text-4xl">
                      {c.client}: {c.title}
                    </h2>
                    <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-dim">
                      {c.body}
                    </p>
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
                Select 03 — nog leeg
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
