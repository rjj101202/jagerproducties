/**
 * Casussen voor bedrijven: overzicht op /bedrijven, detailpagina op
 * /bedrijven/[slug]. Volgorde hier = volgorde op de site (en de
 * "volgende casus"-flow op de detailpagina's).
 */

export type CaseVideo = {
  title: string;
  /** Eigen bestand in public/videos (mp4) óf een embed-URL (Vimeo/YouTube). */
  src: string;
  /** Poster voor eigen video's (public/videos/*.jpg). */
  poster?: string;
  /** Verticale (9:16) video. */
  portrait?: boolean;
  meta: string;
  body?: string;
};

export type Case = {
  slug: string;
  client: string;
  /** Eén regel onder de naam, ook gebruikt in het overzicht. */
  tagline: string;
  /** Korte uitleg op de overzichtspagina. */
  summary: string;
  /** Video die je in het overzicht én bovenaan de casuspagina ziet. */
  hero: CaseVideo;
  about: { title: string; body: string[] };
  role: { title: string; body: string[] };
  facts: string[];
  /** Overige video's binnen deze casus. */
  more: CaseVideo[];
  link?: { href: string; label: string };
};

export const CASES: Case[] = [
  {
    slug: "revolt",
    client: "Revolt",
    tagline: "Laden als abonnement, uitgelegd in beeld",
    summary:
      "Revolt levert elektrische laadpalen in abonnementsvorm: geen grote investering vooraf, maar een vast bedrag per maand voor laadpaal, installatie en beheer. Voor Revolt maakte ik de brand video en een reeks video's die laten zien hoe het werkt.",
    hero: {
      title: "Revolt — brand video",
      src: "/videos/revolt-brand.mp4",
      poster: "/videos/revolt-brand.jpg",
      meta: "BRAND · 16:9",
    },
    about: {
      title: "Over Revolt",
      body: [
        "Revolt maakt elektrisch rijden makkelijk voor bedrijven. In plaats van zelf laadpalen te kopen, te laten installeren en te onderhouden, neem je bij Revolt een abonnement. Revolt regelt de hardware, de installatie en het beheer; jij betaalt een vast bedrag per maand.",
        "Dat model is sterk, maar vraagt wel om uitleg. Wat krijg je precies? Waarom nu? En hoe werkt zo'n laadpaal in de praktijk?",
      ],
    },
    role: {
      title: "Wat ik maakte",
      body: [
        "Eerst de brand video: één film die laat zien waar Revolt voor staat, samen op weg naar zero emissies. Daarna een uitlegvideo over stroomtekort en netcongestie, met een woordvoerder in beeld, en korte how-to video's die gebruikers stap voor stap laten zien hoe ze een laadsessie starten en stoppen.",
        "Zo heeft Revolt één consistente beeldtaal: van het grote verhaal op de website tot de praktische uitleg bij de laadpaal zelf.",
      ],
    },
    facts: [
      "Opdrachtgever: Revolt",
      "Genre: brand video, explainer, how-to",
      "Rol: concept, camera, montage",
      "Formaat: 16:9",
    ],
    more: [
      {
        title: "Stroomtekort",
        src: "/videos/revolt-stroomtekort.mp4",
        poster: "/videos/revolt-stroomtekort.jpg",
        meta: "EXPLAINER · 16:9",
        body: "Wat betekent stroomtekort voor jouw bedrijf, en hoe helpt slim laden? Een woordvoerder legt het uit, afgewisseld met beeld van de laadpalen op locatie.",
      },
      {
        title: "Laden starten",
        src: "/videos/revolt-campagne.mp4",
        poster: "/videos/revolt-campagne.jpg",
        meta: "HOW-TO · 16:9",
        body: "Stap voor stap: kabel erin, pas tegen de lezer, laden maar. Korte instructievideo voor gebruikers van een Revolt-laadpaal.",
      },
      {
        title: "Laden stoppen",
        src: "/videos/revolt-disconnect.mp4",
        poster: "/videos/revolt-disconnect.jpg",
        meta: "HOW-TO · 16:9",
        body: "Het vervolg: zo rond je een laadsessie af en koppel je de kabel los. Dezelfde stijl, zodat de serie als één geheel voelt.",
      },
    ],
  },
  {
    slug: "stichting-duos",
    client: "Stichting Duos",
    tagline: "Patiënten en artsen vertellen over onderzoek en behandeling",
    summary:
      "Voor Stichting Duos maak ik patiëntenvideo's: patiënten vertellen over hun ervaring met een studie of medicijn, en een arts legt uit hoe het onderzoek of de behandeling werkt.",
    hero: {
      title: "Stichting Duos — Lutetium-behandeling en nieuwe radioligands",
      src: "https://www.youtube-nocookie.com/embed/X5uMEyhSCbg?start=3&rel=0",
      meta: "ZORG · 16:9",
    },
    about: {
      title: "Over Stichting Duos",
      body: [
        "Stichting Duos (Dutch Uro-Oncology Studygroup) brengt patiënten, artsen en onderzoekers samen rond urologische kanker, zoals prostaatkanker. De stichting maakt kennis over studies en nieuwe behandelingen toegankelijk voor de mensen om wie het uiteindelijk draait: de patiënten.",
      ],
    },
    role: {
      title: "Wat ik doe",
      body: [
        "Ik maak patiëntenvideo's. Daarin vertellen patiënten in hun eigen woorden over hun deelname aan een studie of hun ervaring met een bepaald medicijn. Een arts legt vervolgens uit hoe die studie of behandeling werkt: wat er gebeurt, voor wie het bedoeld is en wat het oplevert.",
        "Dat vraagt om rust op de set. Patiënten moeten zich op hun gemak voelen voor de camera, en de uitleg van de arts moet helder blijven voor iedereen. Het is een langdurige samenwerking: inmiddels staan er meerdere video's op het YouTube-kanaal van Stichting Duos.",
      ],
    },
    facts: [
      "Opdrachtgever: Stichting Duos",
      "Genre: patiëntenvideo / zorg",
      "Rol: interviews, camera, montage",
      "Samenwerking: doorlopend",
    ],
    more: [
      {
        title: "Salvage brachytherapie bij prostaatkanker",
        src: "https://www.youtube-nocookie.com/embed/Yf-cb5QnegI?start=19&rel=0",
        meta: "ZORG · 16:9",
        body: "Een patiënt vertelt over zijn behandeling, en een arts legt uit wat salvage brachytherapie is en wanneer het wordt ingezet.",
      },
    ],
    link: {
      href: "https://www.youtube.com/@StichtingduosNl2011",
      label: "Alle video's op het YouTube-kanaal van Stichting Duos",
    },
  },
  {
    slug: "mpower",
    client: "MPower",
    tagline: "Brand video en social content",
    summary:
      "Voor MPower maakte ik een brand video die laat zien wat de organisatie doet en voor wie, gedraaid op locatie tussen de mensen om wie het gaat. Daarnaast een serie korte video's voor social.",
    hero: {
      title: "MPower — brand video",
      src: "https://player.vimeo.com/video/1046776509?title=0&byline=0&portrait=0&dnt=1",
      meta: "BRAND · 16:9",
    },
    about: {
      title: "Over MPower",
      body: [
        "MPower wilde een film die in één minuut laat voelen waar de organisatie voor staat. Geen opsomming van diensten, maar echte mensen op echte locaties.",
      ],
    },
    role: {
      title: "Wat ik maakte",
      body: [
        "De brand video vormt de basis: één film voor de website, presentaties en social. Uit dezelfde draaidagen maakte ik daarnaast korte verticale video's (shorts), elk over één onderdeel, zodat MPower maandenlang content heeft om te delen.",
      ],
    },
    facts: [
      "Opdrachtgever: MPower",
      "Genre: brand video, social",
      "Rol: concept, camera, montage",
      "Formaat: 16:9 en 9:16",
    ],
    more: [
      {
        title: "Short: Techniekhok",
        src: "https://player.vimeo.com/video/1056811949?title=0&byline=0&portrait=0&dnt=1",
        portrait: true,
        meta: "SOCIAL · 9:16",
        body: "Een van de korte video's voor social: één plek, één verhaal, in een paar seconden verteld.",
      },
    ],
  },
];

export function getCase(slug: string) {
  return CASES.find((c) => c.slug === slug);
}

export function nextCase(slug: string) {
  const i = CASES.findIndex((c) => c.slug === slug);
  return CASES[(i + 1) % CASES.length];
}
