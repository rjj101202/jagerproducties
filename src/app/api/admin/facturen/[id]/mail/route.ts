import { NextRequest, NextResponse } from "next/server";
import { isIngelogd } from "@/lib/admin/auth";
import { getFactuur, getInstellingen, getKlant } from "@/lib/admin/db";
import { bedankHtml, factuurHtml } from "@/lib/admin/email";

/** Voorbeeld van de mail zoals de klant hem krijgt; ?soort=bedank voor de bedankmail. */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isIngelogd())) {
    return NextResponse.json({ fout: "Niet ingelogd." }, { status: 401 });
  }
  const { id } = await params;
  const factuur = await getFactuur(Number(id));
  if (!factuur) {
    return NextResponse.json({ fout: "Factuur niet gevonden." }, { status: 404 });
  }
  const [klant, instellingen] = await Promise.all([
    getKlant(factuur.klant_id),
    getInstellingen(),
  ]);
  if (!klant) {
    return NextResponse.json({ fout: "Klant niet gevonden." }, { status: 404 });
  }

  const bedank = request.nextUrl.searchParams.get("soort") === "bedank";
  const html = bedank
    ? bedankHtml(factuur, klant, instellingen)
    : factuurHtml(factuur, klant, instellingen);
  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
