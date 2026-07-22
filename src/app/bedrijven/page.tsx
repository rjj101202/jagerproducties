import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import { ArrowLink, CtaBand, Frame, PageHeader, Slate } from "@/components/ui";

export const metadata: Metadata = {
  title: "Video voor bedrijven — bedrijfsfilm, recruitment, product & social",
  description:
    "Bedrijfsfilms, recruitmentvideo's, productvideo's en social content die je merk laten zien zoals het echt is. Eén videograaf, korte lijnen, oplevering in elk formaat.",
};

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

            <Reveal>
              <Frame
                caption="De Borrelplank van — podcastserie over theater"
                meta="PODCAST · 16:9"
                ratio="aspect-video"
              >
                <iframe
                  src="https://player.vimeo.com/video/1020932745?title=0&byline=0&portrait=0&dnt=1"
                  title="De Borrelplank van — podcastserie over theater"
                  loading="lazy"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full"
                />
              </Frame>
            </Reveal>
          </div>
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
