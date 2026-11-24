import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { afmelden } from "@/lib/outreach/db";
import { knop, kop, paneel } from "../admin/ui";

export const metadata: Metadata = {
  title: "Afmelden",
  robots: { index: false, follow: false },
};

async function afmeldActie(formData: FormData): Promise<void> {
  "use server";
  const token = String(formData.get("t") ?? "");
  await afmelden(token);
  redirect("/afmelden?klaar=1");
}

/**
 * Afmelden voor outreach-mails. Bewust met een knop i.p.v. direct bij het
 * openen van de link: virusscanners in mailservers openen links automatisch.
 */
export default async function AfmeldPagina({
  searchParams,
}: {
  searchParams: Promise<{ t?: string; klaar?: string }>;
}) {
  const { t, klaar } = await searchParams;

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-4 py-24">
      <div className={paneel}>
        <h1 className={`${kop} mb-4`}>Afmelden</h1>
        {klaar ? (
          <p className="text-sm text-dim">
            Je bent afgemeld. Je krijgt geen mails meer van Jager Producties.
          </p>
        ) : t ? (
          <form action={afmeldActie}>
            <input type="hidden" name="t" value={t} />
            <p className="mb-6 text-sm text-dim">
              Wil je geen mails meer ontvangen van Jager Producties? Bevestig hieronder.
            </p>
            <button type="submit" className={knop}>
              Afmelden
            </button>
          </form>
        ) : (
          <p className="text-sm text-dim">
            Deze afmeldlink is niet compleet. Mail naar info@jagerproducties.nl, dan haal ik
            je handmatig van de lijst.
          </p>
        )}
      </div>
    </main>
  );
}
