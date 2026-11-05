import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { PageHeader } from "@/components/ui";
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
        intro="Geen formulier of wachtrij, stuur me een mailtje of bel me en kunnen we samen wat moois gaan maken!"
      />

      {/* Grote directe contactkaart */}
      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="border border-line bg-panel/60 px-6 py-12 md:px-14 md:py-16">
              <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-dim">
                Mail: snelste route
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
    </>
  );
}
