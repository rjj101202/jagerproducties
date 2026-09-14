import { redirect } from "next/navigation";
import { inloggenActie } from "../actions";
import { isIngelogd } from "@/lib/admin/auth";
import { foutmelding, invoer, knop, kop, label, paneel } from "../ui";

export default async function LoginPagina({
  searchParams,
}: {
  searchParams: Promise<{ fout?: string }>;
}) {
  if (await isIngelogd()) redirect("/admin");
  const { fout } = await searchParams;

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className={`${paneel} w-full max-w-sm`}>
        <h1 className={`${kop} mb-6`}>Admin</h1>
        {fout ? <p className={foutmelding}>Onjuist wachtwoord.</p> : null}
        <form action={inloggenActie}>
          <label className={label} htmlFor="wachtwoord">
            Wachtwoord
          </label>
          <input
            id="wachtwoord"
            name="wachtwoord"
            type="password"
            autoFocus
            required
            className={`${invoer} mb-4`}
          />
          <button type="submit" className={`${knop} w-full justify-center`}>
            Inloggen
          </button>
        </form>
      </div>
    </div>
  );
}
