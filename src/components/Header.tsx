"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/werk", label: "Werk", tc: "01" },
  { href: "/bedrijven", label: "Bedrijven", tc: "02" },
  { href: "/events", label: "Events", tc: "03" },
  { href: "/over", label: "Over", tc: "04" },
  { href: "/contact", label: "Contact", tc: "05" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Menu sluiten bij navigatie + scroll-lock als het open staat
  useEffect(() => setOpen(false), [pathname]);
  // ?menu in de URL opent het menu (handig voor visuele controle)
  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("menu")) setOpen(true);
  }, []);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <>
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-coal/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <Link
          href="/"
          className="flex items-baseline gap-2 font-display text-lg uppercase tracking-[0.08em]"
        >
          <span>Jager</span>
          <span aria-hidden className="translate-y-[-1px] text-amber">
            ▶
          </span>
          <span className="text-dim">Producties</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Hoofdmenu">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group font-mono text-[13px] uppercase tracking-[0.14em] transition-colors ${
                  active ? "text-amber" : "text-dim hover:text-ink"
                }`}
              >
                <span aria-hidden className="mr-1 text-[10px] text-ink/35">
                  {item.tc}
                </span>
                {item.label}
              </Link>
            );
          })}
          <span
            aria-hidden
            className="hidden items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-dim lg:flex"
          >
            <span className="rec-dot inline-block h-2 w-2 rounded-full bg-rec" />
            REC
          </span>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Menu sluiten" : "Menu openen"}
          className="flex items-center gap-3 font-mono text-[13px] uppercase tracking-[0.18em] text-ink md:hidden"
        >
          <span aria-hidden className="rec-dot inline-block h-2 w-2 rounded-full bg-rec" />
          {open ? "Sluit" : "Menu"}
        </button>
      </div>
    </header>

      {/* Mobiel overlay-menu: de donkere montagekamer.
          Buiten de <header>, want backdrop-blur maakt de header een
          containing block voor fixed-positioned kinderen. */}
      {open && (
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col justify-between overflow-y-auto bg-coal md:hidden">
          <nav className="px-5 pt-8" aria-label="Mobiel menu">
            <ul className="divide-y divide-line border-y border-line">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-baseline justify-between py-5"
                  >
                    <span className="font-display text-4xl uppercase tracking-wide text-ink group-hover:text-amber">
                      {item.label}
                    </span>
                    <span className="font-mono text-xs text-dim">
                      00:{item.tc}:00
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="px-5 pb-10 pt-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-dim">
              Videoproductie voor bedrijven &amp; events
            </p>
            <a
              href="mailto:info@jagerproducties.nl"
              className="mt-2 inline-block font-display text-xl uppercase tracking-wide text-amber"
            >
              info@jagerproducties.nl
            </a>
          </div>
        </div>
      )}
    </>
  );
}
