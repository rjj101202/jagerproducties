import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

/**
 * Leest een website server-side uit voor de outreach-routine: welke video's
 * er al op staan, welke e-mailadressen er te vinden zijn en de leesbare
 * tekst. De routine zelf mag (netwerkbeperking) geen willekeurige sites
 * ophalen; via dit endpoint kan dat wel, en de video-detectie is zo voor
 * elke prospect hetzelfde.
 */

export type VideoVondst = { soort: string; bron: string; pagina: string };

export type ScanResultaat = {
  url: string;
  titel: string | null;
  beschrijving: string | null;
  videos: VideoVondst[];
  youtubeKanaal: string | null;
  emails: string[];
  paginas: string[];
  externeLinks: string[];
  tekst: string;
};

const MAX_BYTES = 1_500_000;
const TIMEOUT_MS = 10_000;
const UA =
  "Mozilla/5.0 (compatible; JagerProductiesBot/1.0; +https://jagerproducties.nl)";

function isPrivaat(ip: string): boolean {
  if (isIP(ip) === 6) {
    const l = ip.toLowerCase();
    if (l.startsWith("::ffff:")) return isPrivaat(l.slice(7));
    return l === "::1" || l === "::" || l.startsWith("fc") || l.startsWith("fd") || l.startsWith("fe80");
  }
  const [a, b] = ip.split(".").map(Number);
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a >= 224
  );
}

/**
 * DNS-lookup met cache en herkansing. Op Vercel gaf lookup bij meerdere
 * gelijktijdige aanvragen geregeld EBUSY/EAI_AGAIN, waardoor gezonde sites
 * als "niet te lezen" terugkwamen.
 */
const dnsCache = new Map<string, Promise<{ address: string }[]>>();

async function zoekAdressen(host: string): Promise<{ address: string }[]> {
  let p = dnsCache.get(host);
  if (!p) {
    p = (async () => {
      for (let poging = 1; ; poging++) {
        try {
          return await lookup(host, { all: true });
        } catch (e) {
          const code = (e as NodeJS.ErrnoException).code;
          if (code === "ENOTFOUND") throw new Error(`Domein ${host} bestaat niet.`);
          // Op Vercel komt een niet-bestaand domein vaak terug als EBUSY.
          if (poging >= 4 && code === "EBUSY") {
            throw new Error(`Domein ${host} niet gevonden (bestaat waarschijnlijk niet; niet raden).`);
          }
          if (poging >= 4 || (code !== "EBUSY" && code !== "EAI_AGAIN")) throw e;
          await new Promise((r) => setTimeout(r, 300 * poging));
        }
      }
    })();
    if (dnsCache.size > 500) dnsCache.clear();
    dnsCache.set(host, p);
    p.catch(() => dnsCache.delete(host));
  }
  return p;
}

async function controleerUrl(raw: string): Promise<URL> {
  const url = new URL(raw);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Alleen http(s)-adressen.");
  }
  if (url.port && url.port !== "80" && url.port !== "443") {
    throw new Error("Afwijkende poort niet toegestaan.");
  }
  const adressen = await zoekAdressen(url.hostname);
  if (adressen.length === 0 || adressen.some((a) => isPrivaat(a.address))) {
    throw new Error("Adres niet bereikbaar of niet toegestaan.");
  }
  return url;
}

/** Haalt één pagina op, volgt maximaal 5 redirects (elk gecontroleerd). */
async function haalOp(raw: string): Promise<{ url: string; html: string }> {
  let url = await controleerUrl(raw);
  for (let i = 0; i < 6; i++) {
    const res = await fetch(url, {
      redirect: "manual",
      headers: { "User-Agent": UA, Accept: "text/html,*/*;q=0.5", "Accept-Language": "nl,en;q=0.5" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("location");
      if (!loc) throw new Error(`Redirect zonder adres (${res.status}).`);
      url = await controleerUrl(new URL(loc, url).toString());
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const type = res.headers.get("content-type") ?? "";
    if (!type.includes("html")) throw new Error(`Geen HTML (${type || "onbekend type"}).`);

    const reader = res.body?.getReader();
    if (!reader) return { url: url.toString(), html: "" };
    const delen: Uint8Array[] = [];
    let totaal = 0;
    while (totaal < MAX_BYTES) {
      const { done, value } = await reader.read();
      if (done) break;
      delen.push(value);
      totaal += value.length;
    }
    await reader.cancel().catch(() => {});
    const html = new TextDecoder("utf-8", { fatal: false }).decode(
      Buffer.concat(delen.map((d) => Buffer.from(d)))
    );
    return { url: url.toString(), html };
  }
  throw new Error("Te veel redirects.");
}

const VIDEO_PATRONEN: { soort: string; re: RegExp }[] = [
  { soort: "youtube", re: /(?:youtube(?:-nocookie)?\.com\/(?:embed|watch\?v=|shorts)\/?[\w-]{6,}|youtu\.be\/[\w-]{6,})/gi },
  { soort: "vimeo", re: /(?:player\.vimeo\.com\/video\/\d+|vimeo\.com\/\d{6,})/gi },
  { soort: "wistia", re: /(?:fast\.wistia\.(?:net|com)\/embed\/[\w/.-]+|wistia\.com\/medias\/\w+)/gi },
  { soort: "vidyard", re: /play\.vidyard\.com\/[\w-]+/gi },
  { soort: "facebook-video", re: /facebook\.com\/plugins\/video\.php[^"'\s]*/gi },
  { soort: "videobestand", re: /[^"'\s()]+\.(?:mp4|webm|mov|m3u8)(?:\?[^"'\s()]*)?/gi },
  { soort: "video-element", re: /<video[\s>]/gi },
];

function vindVideos(html: string, pagina: string): VideoVondst[] {
  const vondsten: VideoVondst[] = [];
  for (const { soort, re } of VIDEO_PATRONEN) {
    for (const m of html.matchAll(re)) {
      vondsten.push({ soort, bron: m[0].slice(0, 200), pagina });
    }
  }
  return vondsten;
}

const EMAIL_RE = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,24}/gi;

function vindEmails(html: string): string[] {
  const ontcijferd = html
    .replace(/&#64;|&commat;|\s?\[at\]\s?|\s?\(at\)\s?/gi, "@")
    .replace(/%40/g, "@");
  return [...ontcijferd.matchAll(EMAIL_RE)]
    .map((m) => m[0].toLowerCase().replace(/^mailto:/, ""))
    .filter((e) => !/\.(png|jpe?g|gif|svg|webp|avif|css|js)$/.test(e))
    .filter((e) => !/(sentry|wixpress|example\.|domain\.|@e-?mail\.|yourdomain|voorbeeld|@2x)/.test(e))
    // invul-voorbeelden uit formulieren, zoals jouw@email.nl of naam@bedrijf.nl
    .filter((e) => !/^(jouw|jij|uw|naam|voornaam|your|name|test|email|mail)@/.test(e));
}

function leesbareTekst(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<(br|\/p|\/h[1-6]|\/li|\/div|\/section)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/[ \t]+/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .trim();
}

function meta(html: string, re: RegExp): string | null {
  const m = html.match(re);
  return m ? leesbareTekst(m[1]).slice(0, 300) || null : null;
}

/** Interne links naar pagina's waar contactgegevens of video's vaak staan. */
function interessanteLinks(html: string, basis: URL): string[] {
  const woorden = /contact|over-?ons|about|wie-zijn|team|vacature|werken-bij|evenement|event|programma|nieuws|media|video/i;
  const gezien = new Set<string>();
  for (const m of html.matchAll(/href\s*=\s*["']([^"'#]+)["']/gi)) {
    try {
      const u = new URL(m[1], basis);
      if (u.hostname !== basis.hostname) continue;
      if (!woorden.test(u.pathname)) continue;
      if (/\.(pdf|jpe?g|png|zip|docx?)$/i.test(u.pathname)) continue;
      u.hash = "";
      gezien.add(u.toString());
    } catch {
      /* ongeldige href */
    }
  }
  // contactpagina's eerst, die leveren meestal het mailadres op
  return [...gezien].sort((a, b) => Number(/contact/i.test(b)) - Number(/contact/i.test(a)));
}

export async function scanWebsite(invoer: string): Promise<ScanResultaat> {
  const start = invoer.match(/^https?:\/\//i) ? invoer : `https://${invoer}`;
  const home = await haalOp(start);
  const basis = new URL(home.url);

  const paginas = [home.url];
  let videos = vindVideos(home.html, home.url);
  let emails = vindEmails(home.html);
  const extra = interessanteLinks(home.html, basis)
    .filter((u) => u !== home.url)
    .slice(0, 5);
  // Geen contactpagina gelinkt (bv. menu via JavaScript)? Probeer de gangbare paden.
  if (!extra.some((u) => /contact/i.test(u))) {
    extra.unshift(`${basis.origin}/contact`);
  }

  // Twee tegelijk: rustiger voor de site en voor DNS dan alles parallel.
  for (let i = 0; i < extra.length; i += 2) {
    const resultaten = await Promise.allSettled(extra.slice(i, i + 2).map((u) => haalOp(u)));
    for (const r of resultaten) {
      if (r.status !== "fulfilled" || paginas.includes(r.value.url)) continue;
      paginas.push(r.value.url);
      videos = videos.concat(vindVideos(r.value.html, r.value.url));
      emails = emails.concat(vindEmails(r.value.html));
    }
  }

  const kanaal = home.html.match(
    /https?:\/\/(?:www\.)?youtube\.com\/(?:@[\w.-]+|channel\/[\w-]+|c\/[\w-]+|user\/[\w-]+)/i
  );

  const uniekeVideos = new Map<string, VideoVondst>();
  for (const v of videos) uniekeVideos.set(`${v.soort}|${v.bron}`, v);

  return {
    url: home.url,
    titel: meta(home.html, /<title[^>]*>([\s\S]*?)<\/title>/i),
    beschrijving: meta(
      home.html,
      /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i
    ),
    videos: [...uniekeVideos.values()].slice(0, 25),
    youtubeKanaal: kanaal ? kanaal[0] : null,
    emails: [...new Set(emails)].slice(0, 15),
    paginas,
    externeLinks: externeSites(home.html, basis),
    tekst: leesbareTekst(home.html).slice(0, 6000),
  };
}

/** Platforms die nooit zelf een prospect zijn. */
const GEEN_PROSPECT =
  /(^|\.)(facebook|instagram|linkedin|twitter|x|youtube|youtu|tiktok|vimeo|google|apple|microsoft|whatsapp|pinterest|wikipedia|indeed|jobbird|werkzoeken|nationalevacaturebank|ticketmaster|eventbrite|paylogic|wordpress|wix|jouwweb|mailchimp|cookiebot|gstatic|cloudflare|bit|linktr)\.[a-z.]+$/i;

/**
 * Externe sites waarnaar een pagina linkt, als homepage-URL. Handig op
 * lijstpagina's (evenementenagenda, verenigingsoverzicht van een gemeente):
 * zo komt de routine aan echte websites in plaats van te raden.
 */
function externeSites(html: string, basis: URL): string[] {
  const eigen = basis.hostname.replace(/^www\./, "");
  const sites = new Map<string, string>();
  for (const m of html.matchAll(/<a\s[^>]*href\s*=\s*["'](https?:\/\/[^"'#\s]+)["']/gi)) {
    try {
      const u = new URL(m[1]);
      const host = u.hostname.toLowerCase().replace(/^www\./, "");
      if (!/\.[a-z]{2,}$/.test(host)) continue;
      if (host === eigen || host.endsWith(`.${eigen}`) || GEEN_PROSPECT.test(host)) continue;
      if (!sites.has(host)) sites.set(host, `${u.protocol}//${u.hostname}/`);
    } catch {
      /* ongeldige href */
    }
  }
  return [...sites.values()].slice(0, 80);
}
