import { NextRequest, NextResponse } from "next/server";
import { bearerKlopt } from "@/lib/outreach/agent-auth";
import { scanWebsite } from "@/lib/outreach/scan";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * GET /api/agent/scan?url=<website> — leest een website uit voor de
 * outreach-routine: video's op de site, e-mailadressen, tekst.
 */
export async function GET(req: NextRequest) {
  if (!bearerKlopt(req.headers.get("authorization"), "AGENT_SECRET")) {
    return NextResponse.json({ fout: "unauthorized" }, { status: 401 });
  }
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ fout: "Parameter url ontbreekt." }, { status: 400 });
  }
  try {
    const resultaat = await scanWebsite(url);
    return NextResponse.json({ ok: true, ...resultaat });
  } catch (e) {
    const fout = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, fout: `Site niet te lezen: ${fout}` }, { status: 422 });
  }
}
