import QRCode from "qrcode";

/**
 * EPC069-12 "SEPA Credit Transfer" QR-payload — het formaat dat de apps van
 * ING, Rabobank, ABN AMRO, bunq etc. herkennen als betaalinstructie.
 */
export function epcPayload(opts: {
  naam: string;
  iban: string;
  bedragCent: number;
  omschrijving: string;
}): string {
  const bedrag = (opts.bedragCent / 100).toFixed(2);
  return [
    "BCD",
    "002",
    "1", // tekenset: UTF-8
    "SCT",
    "", // BIC (optioneel sinds versie 002)
    opts.naam.slice(0, 70),
    opts.iban.replace(/\s/g, "").toUpperCase(),
    `EUR${bedrag}`,
    "", // purpose code
    "", // gestructureerd kenmerk
    opts.omschrijving.slice(0, 140),
    "",
  ].join("\n");
}

export async function epcQrPng(opts: Parameters<typeof epcPayload>[0]): Promise<Buffer> {
  return QRCode.toBuffer(epcPayload(opts), {
    type: "png",
    errorCorrectionLevel: "M",
    margin: 2,
    width: 320,
  });
}

export async function epcQrDataUrl(opts: Parameters<typeof epcPayload>[0]): Promise<string> {
  return QRCode.toDataURL(epcPayload(opts), {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 320,
  });
}
