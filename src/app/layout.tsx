import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono, Oswald } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Playhead from "@/components/Playhead";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
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
      <body className="flex min-h-full flex-col">
        <Playhead />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
