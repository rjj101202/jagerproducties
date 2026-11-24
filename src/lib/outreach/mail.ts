import { Resend } from "resend";
import { SITE_URL } from "@/lib/site";
import { getInstellingen } from "@/lib/admin/db";
import type { Prospect } from "./db";

function ontsmet(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** Platte tekst naar eenvoudige HTML: alinea's, regelafbrekingen en klikbare links. */
function tekstNaarHtml(tekst: string): string {
  return tekst
    .trim()
    .split(/\n{2,}/)
    .map((alinea) => {
      const html = ontsmet(alinea)
        .replace(/(https?:\/\/[^\s<]+[^\s<.,;:!?)])/g, '<a href="$1" style="color:#1a1a1a;">$1</a>')
        .replace(/\n/g, "<br>");
      return `<p style="margin:0 0 14px;line-height:1.55;">${html}</p>`;
    })
    .join("");
}

export function afmeldUrl(p: Prospect): string {
  return `${SITE_URL}/afmelden?t=${p.afmeld_token}`;
}

export function outreachHtml(p: Prospect): string {
  return `<!doctype html>
<html lang="nl">
<body style="margin:0;padding:0;background:#ffffff;font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;font-size:15px;">
  <div style="max-width:580px;padding:16px;">
    ${tekstNaarHtml(p.tekst)}
    <p style="margin:28px 0 0;font-size:12px;color:#888;line-height:1.5;">
      Jager Producties · <a href="${SITE_URL}" style="color:#888;">jagerproducties.nl</a><br>
      Liever geen mail meer van mij? <a href="${afmeldUrl(p)}" style="color:#888;">Afmelden</a>
    </p>
  </div>
</body>
</html>`;
}

export function outreachTekst(p: Prospect): string {
  return `${p.tekst.trim()}\n\n--\nJager Producties · ${SITE_URL}\nLiever geen mail meer van mij? Afmelden: ${afmeldUrl(p)}\n`;
}

export async function verstuurOutreachMail(p: Prospect): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY ontbreekt.");
  const instellingen = await getInstellingen();
  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from: `Remy Jager | ${instellingen.bedrijfsnaam} <${instellingen.email}>`,
    to: p.email,
    replyTo: instellingen.email,
    subject: p.onderwerp,
    text: outreachTekst(p),
    html: outreachHtml(p),
    headers: {
      "List-Unsubscribe": `<${SITE_URL}/api/afmelden?t=${p.afmeld_token}>, <mailto:${instellingen.email}?subject=Afmelden>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  });
  if (error) throw new Error(error.message);
}
