import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { ArrowLink, CtaBand, Frame, NumberRow, PageHeader } from "@/components/ui";
import { EMAIL, MEDIA, TEL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Over — videograaf Remy Jager",
  description:
    "Jager Producties is het videoproductiebedrijf van Remy Jager: één maker die concept, camera en montage in eigen hand houdt. Klein, persoonlijk en scherp op beeld.",
};

export default function OverPage() {
  return (
    <>
      <PageHeader
        kicker="Over de maker"
        title="Eén paar ogen, van script tot master"
        intro="Jager Producties is bewust klein: videograaf Remy Jager doet concept, camera én montage zelf. Wat je bespreekt aan de koffietafel, is precies wat je terugziet op de tijdlijn."
      />

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-[380px_1fr]">
          <Reveal>
            <Frame
              src={MEDIA.remyPortrait}
              alt="Portret van Remy Jager"
              caption="Remy Jager"
              meta="DE MAKER"
              ratio="aspect-[3/4]"
            />
          </Reveal>
          <Reveal delay={120}>
            <div>
              <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-amber">
                Remy Jager — videograaf
              </p>
              <h2 className="mt-4 font-display text-4xl uppercase leading-[1.05] tracking-wide sm:text-5xl">
                Even voorstellen
              </h2>
              <div className="mt-6 max-w-2xl space-y-5 text-[16.5px] leading-relaxed text-dim">
                <p>
                  Mijn naam is Remy Jager, 26 jaar en masterstudent aan de
                  Universiteit Utrecht, én woonachtig in Utrecht. Ik ben naast
                  mijn studie ook met veel plezier videograaf. Ik geniet van alle
                  verschillende plekken waar ik hierdoor terecht kom: de ene keer
                  bij een winkelcentrum, dan weer bij een voetbalclub, een
                  restaurant of een theater. Je spreekt zo veel leuke en
                  interessante mensen, en ziet veel van het land.
                </p>
                <p>
                  Ook heb ik, al zeg ik het zelf ;), een goed oog voor beelden van
                  mensen. Ik kan mensen vastleggen zonder dat ze het doorhebben, en
                  daardoor leg ik echt de emotie van een evenement of een bedrijf
                  goed vast. Naast events en bedrijven heb ik ook ervaring met
                  bruiloften, en doe ik dit ook nog af en toe.
                </p>
                <p>
                  Ik film met een Sony A7III, voorzien van een goede lens, en een
                  DJI Gimbal om stabiel te kunnen filmen. Ook heb ik een drone en
                  beschik ik over goede audio-opnameapparatuur. Ik kan zowel
                  verticaal (voor op de socials) als horizontaal stabiel filmen.
                </p>
                <p>
                  Bel me op{" "}
                  <a
                    href={`tel:${TEL.replace(/\s/g, "")}`}
                    className="text-ink underline decoration-amber/50 underline-offset-4 hover:decoration-amber"
                  >
                    {TEL}
                  </a>
                  , of mail op{" "}
                  <a
                    href={`mailto:${EMAIL}`}
                    className="text-ink underline decoration-amber/50 underline-offset-4 hover:decoration-amber"
                  >
                    {EMAIL}
                  </a>{" "}
                  voor contact.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-line bg-panel/40 px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-amber">
              Regieaanwijzingen
            </p>
            <h2 className="mt-4 font-display text-4xl uppercase leading-[1.05] tracking-wide sm:text-5xl">
              Waar ik in geloof
            </h2>
          </Reveal>
          <div className="mt-10 border-b border-line">
            <Reveal>
              <NumberRow index="REGEL 01" title="Echt boven perfect">
                <p>
                  De beste shots zijn zelden de meest geregisseerde. Ik bouw
                  ruimte in voor het onverwachte moment — daar zit het verhaal.
                </p>
              </NumberRow>
            </Reveal>
            <Reveal>
              <NumberRow index="REGEL 02" title="Eerlijk over wat er is">
                <p>
                  Geen geleende showreels of gekochte logo&apos;s. Wat op deze
                  site staat, heb ik zelf gemaakt. Klein portfolio, echte
                  producties.
                </p>
              </NumberRow>
            </Reveal>
            <Reveal>
              <NumberRow index="REGEL 03" title="Beeld moet werken">
                <p>
                  Een mooie film die niets doet, is decor. Elke productie begint
                  daarom bij de vraag: wat moet deze video opleveren — leden,
                  klanten, kandidaten, kaartverkoop?
                </p>
              </NumberRow>
            </Reveal>
          </div>
          <Reveal className="mt-10">
            <ArrowLink href="/werk">Bekijk het werk</ArrowLink>
          </Reveal>
        </div>
      </section>

      <CtaBand title="Benieuwd of het klikt? Eén mailtje is genoeg." />
    </>
  );
}
