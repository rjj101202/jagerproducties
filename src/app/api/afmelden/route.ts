import { NextRequest, NextResponse } from "next/server";
import { afmelden } from "@/lib/outreach/db";

export const dynamic = "force-dynamic";

/** POST /api/afmelden?t=<token> — one-click afmelden vanuit de mailclient (RFC 8058). */
export async function POST(req: NextRequest) {
  await afmelden(req.nextUrl.searchParams.get("t") ?? "");
  return NextResponse.json({ ok: true });
}
