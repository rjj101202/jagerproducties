import Link from "next/link";
import { vereisAdmin } from "@/lib/admin/auth";
import { uitloggenActie } from "../actions";

const NAV = [
  { href: "/admin", tekst: "Overzicht" },
  { href: "/admin/facturen", tekst: "Facturen" },
  { href: "/admin/klanten", tekst: "Klanten" },
  { href: "/admin/instellingen", tekst: "Instellingen" },
];

export default async function BeheerLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  await vereisAdmin();

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24">
      <header className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-line py-5">
        <Link
          href="/admin"
          className="font-display text-lg font-medium uppercase tracking-wider text-amber"
        >
          Jager Admin
        </Link>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mono text-xs uppercase tracking-wider text-dim transition hover:text-ink"
            >
              {item.tekst}
            </Link>
          ))}
        </nav>
        <form action={uitloggenActie} className="ml-auto">
          <button
            type="submit"
            className="cursor-pointer font-mono text-xs uppercase tracking-wider text-dim transition hover:text-rec"
          >
            Uitloggen
          </button>
        </form>
      </header>
      {children}
    </div>
  );
}
