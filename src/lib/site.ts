export const SITE_NAME = "Jager Producties";
export const SITE_URL = "https://jagerproducties.nl";
export const EMAIL = "info@jagerproducties.nl";
export const TEL = "06 81 09 88 95";
export const KVK = "90470826";

export const MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent(
  "Videoproject — laten we praten"
)}`;

/**
 * Alle media is gratis stock (Pexels). Elke URL is met een HEAD-request
 * geverifieerd (HTTP 200) vóór gebruik.
 */
export const MEDIA = {
  /** Hero: eigen intro-video Jager Producties (public/intro.mp4) */
  heroVideo: "/intro.mp4",
  /** Poster/fallback hero: openingsframe uit de eigen intro (public/hero-poster.jpg) */
  heroPoster: "/hero-poster.jpg",
  /** Portret Remy Jager (public/remy.jpg) */
  remyPortrait: "/remy.jpg",
  /** Events: luchtshot concertpubliek (Tom Fisk, Pexels 3941289) */
  eventsVideo:
    "https://videos.pexels.com/video-files/3941289/3941289-sd_960_540_30fps.mp4",

  cameraOperator:
    "https://images.pexels.com/photos/2608519/pexels-photo-2608519.jpeg?auto=compress&cs=tinysrgb&w=1600",
  filmRig:
    "https://images.pexels.com/photos/29206704/pexels-photo-29206704.jpeg?auto=compress&cs=tinysrgb&w=1600",
  monitorShot:
    "https://images.pexels.com/photos/6714952/pexels-photo-6714952.jpeg?auto=compress&cs=tinysrgb&w=1600",
  videographerOutdoor:
    "https://images.pexels.com/photos/5314217/pexels-photo-5314217.jpeg?auto=compress&cs=tinysrgb&w=1600",
  redCamera:
    "https://images.pexels.com/photos/3928550/pexels-photo-3928550.jpeg?auto=compress&cs=tinysrgb&w=1200",
  floodlitPitch:
    "https://images.pexels.com/photos/399187/pexels-photo-399187.jpeg?auto=compress&cs=tinysrgb&w=1600",
  openKitchen:
    "https://images.pexels.com/photos/5251019/pexels-photo-5251019.jpeg?auto=compress&cs=tinysrgb&w=1600",
  darkKitchen:
    "https://images.pexels.com/photos/19553654/pexels-photo-19553654.jpeg?auto=compress&cs=tinysrgb&w=1200",
  festivalFire:
    "https://images.pexels.com/photos/36257830/pexels-photo-36257830.jpeg?auto=compress&cs=tinysrgb&w=1600",
  arenaLights:
    "https://images.pexels.com/photos/2263435/pexels-photo-2263435.jpeg?auto=compress&cs=tinysrgb&w=1600",
  office:
    "https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=1600",
} as const;

/**
 * Logo's van opdrachtgevers voor de band onder de hero (public/klanten/).
 * `displayHeight` is per logo afgesteld zodat brede en vierkante logo's
 * optisch even zwaar ogen. `badge`: logo met eigen vlak (cirkel/blok), dat
 * in grijstinten blijft i.p.v. als wit silhouet.
 */
export const CLIENT_LOGOS: {
  name: string;
  src: string;
  width: number;
  height: number;
  displayHeight: number;
  badge?: boolean;
}[] = [
  { name: "De Maaltuin", src: "/klanten/de-maaltuin.png", width: 428, height: 160, displayHeight: 48 },
  { name: "Erasmus MC", src: "/klanten/erasmus-mc.svg", width: 254, height: 109, displayHeight: 52 },
  { name: "Cooper", src: "/klanten/cooper.png", width: 1256, height: 160, displayHeight: 20 },
  { name: "Winkelcentrum Oostpoort", src: "/klanten/oostpoort.png", width: 773, height: 126, displayHeight: 22 },
  { name: "Swim to Fight Cancer", src: "/klanten/swim-to-fight-cancer.png", width: 160, height: 160, displayHeight: 54, badge: true },
  { name: "De Nieuwe Gevers", src: "/klanten/de-nieuwe-gevers.svg", width: 160, height: 200, displayHeight: 58, badge: true },
];
