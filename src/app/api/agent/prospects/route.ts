import { NextRequest, NextResponse } from "next/server";
import { bearerKlopt } from "@/lib/outreach/agent-auth";
import { aantalVandaagAangemaakt, dubbelReden, maakProspect } from "@/lib/outreach/db";
import { MAX_NIEUW_PER_DAG, valideerProspect } from "@/lib/outreach/validatie";

export const dynamic = "force-dynamic";

/**
 * POST /api/agent/prospects — de outreach-routine levert een prospect af,
 * inclusief de persoonlijke mail. Die komt op status 'klaar' en gaat met de
 * volgende verzend-run mee (zie /api/cron/outreach).
 *
 * 201 aangemaakt · 401 geen toegang · 409 al bekend (overslaan) ·
 * 422 ongeldig (melding zegt wat er mis is) · 429 daglimiet bereikt (stoppen)
 */
export async function POST(req: NextRequest) {
  if (!bearerKlopt(req.headers.get("authorization"), "AGENT_SECRET")) {
    return NextResponse.json({ fout: "unauthorized" }, { status: 401 });
  }

  let prospect;
  try {
    prospect = valideerProspect(await req.json());
  } catch (e) {
    return NextResponse.json(
      { fout: e instanceof Error ? e.message : String(e) },
      { status: 422 }
    );
  }

  if ((await aantalVandaagAangemaakt()) >= MAX_NIEUW_PER_DAG) {
    return NextResponse.json(
      { fout: `Daglimiet van ${MAX_NIEUW_PER_DAG} nieuwe prospects bereikt. Stop voor vandaag.` },
      { status: 429 }
    );
  }

  const dubbel = await dubbelReden(prospect.domein, prospect.email, prospect.tekst);
  if (dubbel) return NextResponse.json({ fout: dubbel }, { status: 409 });

  try {
    const id = await maakProspect(prospect);
    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/unique|duplicate/i.test(msg)) {
      return NextResponse.json({ fout: "Al bekend." }, { status: 409 });
    }
    throw e;
  }
}
