import { createHmac, createHash, timingSafeEqual, randomBytes } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "admin_sessie";
const GELDIG_DAGEN = 30;

function geheim(): string {
  const s = process.env.ADMIN_SECRET ?? process.env.ADMIN_PASSWORD;
  if (!s) throw new Error("ADMIN_PASSWORD ontbreekt in de omgeving.");
  return createHash("sha256").update(`jager-admin:${s}`).digest("hex");
}

function onderteken(vervalt: number): string {
  const mac = createHmac("sha256", geheim()).update(String(vervalt)).digest("hex");
  return `${vervalt}.${mac}`;
}

function veiligGelijk(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function wachtwoordKlopt(invoer: string): boolean {
  const echt = process.env.ADMIN_PASSWORD;
  if (!echt) return false;
  return veiligGelijk(invoer, echt);
}

export async function logIn(): Promise<void> {
  const vervalt = Date.now() + GELDIG_DAGEN * 24 * 60 * 60 * 1000;
  const store = await cookies();
  store.set(COOKIE, onderteken(vervalt), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: GELDIG_DAGEN * 24 * 60 * 60,
  });
}

export async function logUit(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function isIngelogd(): Promise<boolean> {
  const store = await cookies();
  const waarde = store.get(COOKIE)?.value;
  if (!waarde) return false;
  const [vervaltStr] = waarde.split(".");
  const vervalt = Number(vervaltStr);
  if (!Number.isFinite(vervalt) || vervalt < Date.now()) return false;
  return veiligGelijk(waarde, onderteken(vervalt));
}

/** Voor pagina's: stuurt niet-ingelogde bezoekers naar het loginscherm. */
export async function vereisAdmin(): Promise<void> {
  if (!(await isIngelogd())) redirect("/admin/login");
}

/** Voor server actions en route handlers: gooit in plaats van redirect. */
export async function vereisAdminOfGooi(): Promise<void> {
  if (!(await isIngelogd())) throw new Error("Niet ingelogd.");
}

export function nieuwToken(): string {
  return randomBytes(16).toString("hex");
}
