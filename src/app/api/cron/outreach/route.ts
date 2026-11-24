import { NextRequest, NextResponse } from "next/server";
import { bearerKlopt } from "@/lib/outreach/agent-auth";
import {
  aantalVandaagVerzonden,
  getConfig,
  markeerFout,
  markeerVerzonden,
  teVersturen,
} from "@/lib/outreach/db";
import { verstuurOutreachMail } from "@/lib/outreach/mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

/** Mails moeten minstens zo lang klaarstaan, zodat Remy ze in de admin kan nakijken. */
const WACHT_UREN = 2;

/**
 * GET /api/cron/outreach — Vercel Cron (zie vercel.json, werkdagen). Stuurt
 * tot `per_dag` (instelling op /admin/outreach) klaarstaande mails via
 * Resend. Staat outreach uit in de admin, dan gebeurt er niets.
 */
export async function GET(req: NextRequest) {
  if (!bearerKlopt(req.headers.get("authorization"), "CRON_SECRET")) {
    return NextResponse.json({ fout: "unauthorized" }, { status: 401 });
  }

  const config = await getConfig();
  if (!config.aan) {
    return NextResponse.json({ ok: true, overgeslagen: "outreach staat uit" });
  }

  const ruimte = config.per_dag - (await aantalVandaagVerzonden());
  const batch = await teVersturen(ruimte, WACHT_UREN);

  let verzonden = 0;
  const fouten: string[] = [];
  for (const p of batch) {
    try {
      await verstuurOutreachMail(p);
      await markeerVerzonden(p.id);
      verzonden++;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      await markeerFout(p.id, msg);
      fouten.push(`${p.naam}: ${msg}`);
    }
    // Resend staat 2 verzoeken per seconde toe
    await new Promise((r) => setTimeout(r, 600));
  }

  return NextResponse.json({ ok: true, verzonden, fouten });
}
