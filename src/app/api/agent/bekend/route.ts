import { NextRequest, NextResponse } from "next/server";
import { bearerKlopt } from "@/lib/outreach/agent-auth";
import { aantalVandaagAangemaakt, bekendeDomeinen } from "@/lib/outreach/db";
import { MAX_NIEUW_PER_DAG } from "@/lib/outreach/validatie";

export const dynamic = "force-dynamic";

/**
 * GET /api/agent/bekend — voor de outreach-routine: alle domeinen die al
 * benaderd zijn of klant zijn (overslaan), plus hoeveel prospects er
 * vandaag nog bij mogen.
 */
export async function GET(req: NextRequest) {
  if (!bearerKlopt(req.headers.get("authorization"), "AGENT_SECRET")) {
    return NextResponse.json({ fout: "unauthorized" }, { status: 401 });
  }
  const [domeinen, vandaag] = await Promise.all([bekendeDomeinen(), aantalVandaagAangemaakt()]);
  return NextResponse.json({
    ok: true,
    nogToegestaanVandaag: Math.max(0, MAX_NIEUW_PER_DAG - vandaag),
    domeinen,
  });
}
