export const SITE_NAME = "Jager Producties";
export const SITE_URL = "https://jagerproducties.nl";
export const EMAIL = "info@jagerproducties.nl";
/** Placeholder — Remy vult het echte nummer in. */
export const TEL_PLACEHOLDER = "06 — vul in";

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
  /** Poster/fallback hero: monitor over de schouder op set (Pexels 6714952) */
  heroPoster:
    "https://images.pexels.com/photos/6714952/pexels-photo-6714952.jpeg?auto=compress&cs=tinysrgb&w=1600",
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
