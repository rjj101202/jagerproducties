import { NextRequest, NextResponse } from "next/server";
import { isIngelogd } from "@/lib/admin/auth";
import { getFactuur, getInstellingen, getKlant } from "@/lib/admin/db";
import { maakFactuurPdf } from "@/lib/admin/pdf";

export async function GET(
  _request: NextRequest,
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

  const pdf = await maakFactuurPdf(factuur, klant, instellingen);
  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="factuur-${factuur.nummer}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
