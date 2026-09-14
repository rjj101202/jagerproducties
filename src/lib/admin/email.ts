import { Resend } from "resend";
import { SITE_URL } from "@/lib/site";
import {
  aantalNL,
  berekenTotalen,
  datumNL,
  euro,
  Factuur,
  Instellingen,
  Klant,
} from "./types";
import { maakFactuurPdf } from "./pdf";

function ontsmet(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function factuurHtml(factuur: Factuur, klant: Klant, i: Instellingen): string {
  const t = berekenTotalen(factuur.regels);
  const qrUrl = `${SITE_URL}/api/qr/${factuur.qr_token}`;
  const aanhef = klant.contactpersoon
    ? `Beste ${ontsmet(klant.contactpersoon)}`
    : `Beste ${ontsmet(klant.naam)}`;

  const regels = factuur.regels
    .map(
      (r) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #eee;">${ontsmet(r.omschrijving)}</td>
        <td align="right" style="padding:8px 0;border-bottom:1px solid #eee;white-space:nowrap;">${aantalNL(r.aantal)} × ${euro(r.prijs_cent)}</td>
        <td align="right" style="padding:8px 0 8px 16px;border-bottom:1px solid #eee;white-space:nowrap;">${euro(Math.round(r.aantal * r.prijs_cent))}</td>
      </tr>`
    )
    .join("");

  const btwRegels = Object.entries(t.btw_per_tarief)
    .map(
      ([tarief, cent]) => `
      <tr>
        <td colspan="2" align="right" style="padding:2px 0;color:#666;">Btw ${tarief}%</td>
        <td align="right" style="padding:2px 0 2px 16px;">${euro(cent)}</td>
      </tr>`
    )
    .join("");

  return `<!doctype html>
<html lang="nl">
<body style="margin:0;padding:0;background:#f4f4f2;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;">
  <div style="max-width:560px;margin:0 auto;padding:24px 16px;">
    <div style="background:#ffffff;border-radius:10px;padding:32px;">
      <div style="font-size:18px;font-weight:bold;letter-spacing:1px;margin-bottom:24px;">${ontsmet(i.bedrijfsnaam).toUpperCase()}</div>

      <p style="margin:0 0 16px;">${aanhef},</p>
      <p style="margin:0 0 24px;line-height:1.5;">
        Hierbij ontvang je factuur <strong>${ontsmet(factuur.nummer)}</strong>.
        De volledige factuur zit als PDF in de bijlage.
      </p>

      <table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;margin-bottom:8px;">
        ${regels}
        <tr>
          <td colspan="2" align="right" style="padding:8px 0 2px;color:#666;">Subtotaal excl. btw</td>
          <td align="right" style="padding:8px 0 2px 16px;">${euro(t.subtotaal_cent)}</td>
        </tr>
        ${btwRegels}
        <tr>
          <td colspan="2" align="right" style="padding:8px 0;font-weight:bold;font-size:16px;">Te betalen</td>
          <td align="right" style="padding:8px 0 8px 16px;font-weight:bold;font-size:16px;white-space:nowrap;">${euro(t.totaal_cent)}</td>
        </tr>
      </table>

      <div style="background:#f5f3ef;border-radius:8px;padding:20px;margin:16px 0 24px;">
        <table cellpadding="0" cellspacing="0"><tr>
          <td valign="top" style="padding-right:16px;">
            <img src="${qrUrl}" width="110" height="110" alt="Betaal-QR-code" style="display:block;border-radius:4px;" />
          </td>
          <td valign="top" style="font-size:14px;line-height:1.6;">
            <strong>Betalen</strong><br/>
            Scan de QR-code met de app van je bank, of maak
            <strong>${euro(t.totaal_cent)}</strong> over op<br/>
            <strong>${ontsmet(i.iban)}</strong><br/>
            t.n.v. ${ontsmet(i.naam_rekeninghouder)}<br/>
            o.v.v. <strong>${ontsmet(factuur.nummer)}</strong><br/>
            <span style="color:#666;">vóór ${datumNL(factuur.vervaldatum)}</span>
          </td>
        </tr></table>
      </div>

      <p style="margin:0 0 4px;line-height:1.5;">Vragen over deze factuur? Reageer gerust op deze mail.</p>
      <p style="margin:16px 0 0;line-height:1.5;">
        Met vriendelijke groet,<br/>
        <strong>Remy Jager</strong><br/>
        ${ontsmet(i.bedrijfsnaam)}
      </p>
    </div>

    <div style="text-align:center;color:#999;font-size:11px;padding:16px 8px;line-height:1.6;">
      ${[
        ontsmet(i.bedrijfsnaam),
        ontsmet([i.adres, [i.postcode, i.plaats].filter(Boolean).join(" ")].filter(Boolean).join(", ")),
        `KvK ${ontsmet(i.kvk)}`,
        i.btw_nummer ? `Btw ${ontsmet(i.btw_nummer)}` : "",
        ontsmet(i.email),
        ontsmet(i.telefoon),
      ]
        .filter(Boolean)
        .join(" · ")}
    </div>
  </div>
</body>
</html>`;
}

export async function verstuurFactuurMail(
  factuur: Factuur,
  klant: Klant,
  instellingen: Instellingen
): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    throw new Error("RESEND_API_KEY ontbreekt — zie README-ADMIN.md voor de setup.");
  }
  if (!instellingen.iban) {
    throw new Error("Vul eerst je IBAN in bij Instellingen voordat je een factuur verstuurt.");
  }

  const resend = new Resend(key);
  const pdf = await maakFactuurPdf(factuur, klant, instellingen);
  const t = berekenTotalen(factuur.regels);

  const { error } = await resend.emails.send({
    from: `${instellingen.bedrijfsnaam} <${instellingen.email}>`,
    to: [klant.email],
    replyTo: instellingen.email,
    subject: `Factuur ${factuur.nummer} — ${instellingen.bedrijfsnaam} (${euro(t.totaal_cent)})`,
    html: factuurHtml(factuur, klant, instellingen),
    attachments: [
      {
        filename: `factuur-${factuur.nummer}.pdf`,
        content: pdf,
      },
    ],
  });

  if (error) {
    throw new Error(`Versturen mislukt: ${error.message}`);
  }
}
