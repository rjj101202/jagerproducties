import { NextRequest, NextResponse } from "next/server";
import { getFactuurViaToken, getInstellingen } from "@/lib/admin/db";
import { epcQrPng } from "@/lib/admin/epc";
import { berekenTotalen } from "@/lib/admin/types";

/**
 * Publieke betaal-QR voor in de factuurmail. Het token is per factuur
 * willekeurig en onraadbaar; de afbeelding toont alleen betaalgegevens
 * die ook al in de mail zelf staan.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const factuur = await getFactuurViaToken(token);
  if (!factuur) {
    return NextResponse.json({ fout: "Onbekend token." }, { status: 404 });
  }
  const instellingen = await getInstellingen();
  if (!instellingen.iban) {
    return NextResponse.json({ fout: "Geen IBAN ingesteld." }, { status: 404 });
  }

  const png = await epcQrPng({
    naam: instellingen.naam_rekeninghouder,
    iban: instellingen.iban,
    bedragCent: berekenTotalen(factuur.regels).totaal_cent,
    omschrijving: `Factuur ${factuur.nummer}`,
  });

  return new NextResponse(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
