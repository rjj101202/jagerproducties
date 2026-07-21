import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { NumberRow, PageHeader } from "@/components/ui";
import { MAILTO, TEL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact — plan een kort gesprek",
  description:
    "Neem contact op met Jager Producties: mail info@jagerproducties.nl en vertel kort wat je wilt maken. Je krijgt snel antwoord en na één gesprek een voorstel met vaste prijs.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        kicker="Contact"
        title="En… actie"
        intro="Geen formulieren, geen wachtrij. Mail me rechtstreeks en vertel in drie zinnen wat je wilt maken — dan hoor je snel van me."
      />

      {/* Grote directe contactkaart */}
      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="border border-line bg-panel/60 px-6 py-12 md:px-14 md:py-16">
              <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-dim">
                Mail — snelste route
              </p>
              <a
                href={MAILTO}
                className="mt-3 inline-block font-display text-[9vw] uppercase leading-[1.05] tracking-wide text-amber transition-colors hover:text-ink sm:text-5xl md:text-6xl"
              >
                {/* <wbr> laat het adres netjes ná de @ afbreken op smalle schermen */}
                info@
                <wbr />
                jagerproducties.nl
              </a>
              <div className="mt-10 grid gap-8 border-t border-line pt-8 sm:grid-cols-2">
                <div>
                  <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-dim">
                    Bellen mag ook
                  </p>
                  <p className="mt-2 font-display text-2xl uppercase tracking-wide">
                    {TEL}
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-dim">
                    Werkgebied
                  </p>
                  <p className="mt-2 font-display text-2xl uppercase tracking-wide">
                    Heel Nederland
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Hoe het verdergaat */}
      <section className="border-t border-line bg-panel/40 px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-amber">
              Het draaiboek na je mail
            </p>
            <h2 className="mt-4 font-display text-4xl uppercase leading-[1.05] tracking-wide sm:text-5xl">
              Zo simpel begint het
            </h2>
          </Reveal>
          <div className="mt-10 border-b border-line">
            <Reveal>
              <NumberRow index="CUE 01" title="Jij mailt, ik antwoord snel">
                <p>
                  Drie zinnen zijn genoeg: wat wil je maken, voor wie en
                  wanneer? Je krijgt vlot een reactie — geen automatische
                  bevestiging, gewoon antwoord.
                </p>
              </NumberRow>
            </Reveal>
            <Reveal>
              <NumberRow index="CUE 02" title="Kort gesprek, scherpe vragen">
                <p>
                  Een kwartier bellen of koffie. Ik wil snappen wat de video
                  moet opleveren voor ik iets voorstel — dat scheelt jou tijd en
                  mij aannames.
                </p>
              </NumberRow>
            </Reveal>
            <Reveal>
              <NumberRow index="CUE 03" title="Voorstel met vaste prijs">
                <p>
                  Binnen een paar dagen ligt er een concreet voorstel: concept,
                  planning en één vaste prijs. Offerte op maat — pas als jij
                  akkoord bent, gaat de camera aan.
                </p>
              </NumberRow>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Korte, eerlijke Q&A */}
      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-amber">
              Veelgestelde vragen
            </p>
            <h2 className="mt-4 font-display text-4xl uppercase leading-[1.05] tracking-wide sm:text-5xl">
              Vooraf al even weten
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-px border border-line bg-line md:grid-cols-2">
            {[
              {
                q: "Wat kost een video?",
                a: "Elke productie is anders, dus ik werk niet met standaardpakketten. Na een kort gesprek krijg je een offerte met één vaste prijs — geen uurtje-factuurtje achteraf.",
              },
              {
                q: "Hoe snel kan het?",
                a: "Dat hangt af van agenda en omvang. Voor events geldt: hoe eerder je de datum doorgeeft, hoe zekerder je van de draaidag bent.",
              },
              {
                q: "Moet ik zelf een script hebben?",
                a: "Nee. Het concept en de opbouw denken we samen uit — dat is onderdeel van elke productie. Jij kent je verhaal, ik weet hoe je het filmt.",
              },
              {
                q: "Krijg ik versies voor social?",
                a: "Standaard lever ik naast de hoofdfilm de formaten die je nodig hebt: 16:9, 9:16 en 1:1, klaar om te uploaden.",
              },
            ].map((item) => (
              <div key={item.q} className="bg-coal p-7 md:p-9">
                <h3 className="font-display text-xl uppercase tracking-wide">
                  {item.q}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-dim">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
