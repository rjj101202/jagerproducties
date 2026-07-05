import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { ArrowLink, CtaBand, Frame, NumberRow, PageHeader } from "@/components/ui";
import { MEDIA } from "@/lib/site";

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
              src={MEDIA.redCamera}
              alt="Camera-operator achter een cinemacamera op de set"
              caption="Op de set"
              meta="BTS"
              ratio="aspect-[3/4]"
            />
          </Reveal>
          <Reveal delay={120}>
            <div>
              <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-amber">
                Remy Jager — videograaf
              </p>
              <h2 className="mt-4 font-display text-4xl uppercase leading-[1.05] tracking-wide sm:text-5xl">
                Waarom klein werkt
              </h2>
              <div className="mt-6 max-w-2xl space-y-5 text-[16.5px] leading-relaxed text-dim">
                <p>
                  Grote producties hebben grote crews nodig. Maar de meeste
                  bedrijven en events zijn niet geholpen met een productiehuis
                  vol schakels — die zijn geholpen met iemand die komt kijken,
                  goed luistert en dan precies het juiste beeld maakt.
                </p>
                <p>
                  Daarom werkt Jager Producties met één maker. Ik sta zelf
                  achter de camera en zit zelf achter de montage. Voor FC De
                  Bilt betekende dat een clubvideo die voelt als de club zelf;
                  voor De Maaltuin een horecavideo waar je honger van krijgt.
                </p>
                <p>
                  Naast Jager Producties run ik{" "}
                  <a
                    href="https://novaemedia.nl"
                    className="text-ink underline decoration-amber/50 underline-offset-4 hover:decoration-amber"
                  >
                    Novae Media
                  </a>
                  , waarmee ik websites bouw voor ondernemers. Die combinatie is
                  geen toeval: ik weet niet alleen hoe je goed beeld maakt, maar
                  ook waar het online moet renderen — op je site, in je campagne,
                  op je socials.
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
