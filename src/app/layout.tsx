import type { Metadata } from "next";
import localFont from "next/font/local";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

// Fonts staan lokaal in ./fonts (Google Fonts, latin-subset), zodat de
// build niets van fonts.googleapis.com hoeft op te halen.
const oswald = localFont({
  src: "./fonts/oswald.woff2",
  variable: "--font-oswald",
  weight: "400 600",
  display: "swap",
});

const archivo = localFont({
  src: "./fonts/archivo.woff2",
  variable: "--font-archivo",
  weight: "400 600",
  display: "swap",
});

const plexMono = localFont({
  src: [
    { path: "./fonts/plex-mono-400.woff2", weight: "400" },
    { path: "./fonts/plex-mono-500.woff2", weight: "500" },
  ],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Videoproductie voor bedrijven en events`,
    template: `%s — ${SITE_NAME}`,
  },
  description:
    "Jager Producties maakt video die blijft hangen: bedrijfsfilms, recruitmentvideo's, aftermovies en sportregistraties. Van eerste idee tot laatste frame, door videograaf Remy Jager.",
  openGraph: {
    siteName: SITE_NAME,
    locale: "nl_NL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`${oswald.variable} ${archivo.variable} ${plexMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Zet de js-klasse vóór de first paint: reveals verbergen alleen met JS */}
        <script
          dangerouslySetInnerHTML={{
            __html: "document.documentElement.classList.add('js')",
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
