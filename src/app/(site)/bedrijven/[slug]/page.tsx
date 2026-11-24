import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import PageSlide from "@/components/PageSlide";
import Reveal from "@/components/Reveal";
import { CtaBand, Frame, VideoEmbed } from "@/components/ui";
import { CASES, getCase, nextCase } from "@/lib/cases";

export const dynamicParams = false;

export function generateStaticParams() {
  return CASES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) return {};
  return {
    title: `Casus ${c.client} — ${c.tagline}`,
    description: c.summary,
  };
}

export default async function CasePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = getCase(slug);
  if (!c) notFound();

  const index = CASES.findIndex((x) => x.slug === c.slug);
  const next = nextCase(c.slug);
  const nr = (i: number) => String(i + 1).padStart(2, "0");

  return (
    <PageSlide>
      <div className="border-b border-line px-5 pb-14 pt-32 md:px-8 md:pb-20 md:pt-40">
        <div className="mx-auto max-w-6xl">
          <Link
            href={`/bedrijven#${c.slug}`}
            transitionTypes={["nav-back"]}
            className="group inline-flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.18em] text-dim hover:text-ink"
          >
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:-translate-x-1"
            >
              ◀
            </span>
            Alle casussen
          </Link>
          <p className="mt-8 font-mono text-[12px] uppercase tracking-[0.22em] text-amber">
            Casus {nr(index)} / {String(CASES.length).padStart(2, "0")}
          </p>
          <ViewTransition name={`case-title-${c.slug}`} share="case-title">
            <h1 className="mt-4 w-fit font-display text-6xl uppercase leading-none tracking-wide sm:text-7xl md:text-8xl">
              {c.client}
            </h1>
          </ViewTransition>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-dim">
            {c.tagline}
          </p>
        </div>
      </div>

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-6xl">
          <Frame caption={c.hero.title} meta={c.hero.meta} ratio="aspect-video">
            <VideoEmbed {...c.hero} />
          </Frame>

          <div className="mt-14 grid gap-12 md:grid-cols-[1fr_1fr_260px] md:gap-10">
            {[c.about, c.role].map((block) => (
              <Reveal key={block.title}>
                <h2 className="font-display text-2xl uppercase tracking-wide sm:text-3xl">
                  {block.title}
                </h2>
                {block.body.map((p) => (
                  <p
                    key={p.slice(0, 24)}
                    className="mt-4 text-[16px] leading-relaxed text-dim"
                  >
                    {p}
                  </p>
                ))}
              </Reveal>
            ))}
            <Reveal>
              <ul className="space-y-2 border-l-2 border-amber/60 pl-5">
                {c.facts.map((f) => (
                  <li
                    key={f}
                    className="font-mono text-[12.5px] uppercase tracking-[0.1em] text-ink/80"
                  >
                    {f}
                  </li>
                ))}
              </ul>
              {c.link && (
                <a
                  href={c.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-6 inline-flex items-start gap-2 font-mono text-[12px] uppercase tracking-[0.16em] text-amber"
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
            </Reveal>
          </div>
        </div>
      </section>

      {c.more.length > 0 && (
        <section className="border-t border-line bg-panel/40 px-5 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-6xl">
            <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-amber">
              Meer uit deze casus
            </p>
            <div className="mt-10 space-y-20">
              {c.more.map((v, i) => (
                <Reveal key={v.src}>
                  <div
                    className={`grid items-center gap-8 ${
                      v.portrait
                        ? "md:grid-cols-[minmax(0,360px)_1fr]"
                        : "lg:grid-cols-[1.5fr_1fr]"
                    } ${!v.portrait && i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}
                  >
                    <div className={v.portrait ? "mx-auto w-full max-w-[360px]" : undefined}>
                      <Frame
                        caption={v.title}
                        meta={v.meta}
                        ratio={v.portrait ? "aspect-[9/16]" : "aspect-video"}
                      >
                        <VideoEmbed {...v} />
                      </Frame>
                    </div>
                    <div>
                      <p className="font-mono text-sm text-amber">TAKE {nr(i)}</p>
                      <h3 className="mt-3 font-display text-3xl uppercase tracking-wide">
                        {v.title}
                      </h3>
                      {v.body && (
                        <p className="mt-4 max-w-md text-[16px] leading-relaxed text-dim">
                          {v.body}
                        </p>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-line">
        <Link
          href={`/bedrijven/${next.slug}`}
          transitionTypes={["nav-forward"]}
          className="group block px-5 py-16 transition-colors hover:bg-panel md:px-8 md:py-24"
        >
          <div className="mx-auto flex max-w-6xl items-end justify-between gap-8">
            <div>
              <p className="font-mono text-[12px] uppercase tracking-[0.22em] text-dim">
                Volgende casus · {nr(CASES.indexOf(next))}
              </p>
              <ViewTransition name={`case-title-${next.slug}`} share="case-title">
                <p className="mt-4 w-fit font-display text-5xl uppercase leading-none tracking-wide transition-colors group-hover:text-amber sm:text-7xl">
                  {next.client}
                </p>
              </ViewTransition>
              <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-dim">
                {next.tagline}
              </p>
            </div>
            <span
              aria-hidden
              className="font-mono text-3xl text-amber transition-transform duration-300 group-hover:translate-x-2"
            >
              ▶
            </span>
          </div>
        </Link>
      </section>

      <CtaBand title="Ook zo'n verhaal te vertellen?" />
    </PageSlide>
  );
}
