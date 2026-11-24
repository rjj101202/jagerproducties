import { timingSafeEqual } from "node:crypto";

/** Bearer-check met een geheim uit de omgeving (AGENT_SECRET, CRON_SECRET). */
export function bearerKlopt(header: string | null, envNaam: "AGENT_SECRET" | "CRON_SECRET"): boolean {
  const geheim = process.env[envNaam];
  if (!geheim || !header?.startsWith("Bearer ")) return false;
  const a = Buffer.from(header.slice(7));
  const b = Buffer.from(geheim);
  return a.length === b.length && timingSafeEqual(a, b);
}
