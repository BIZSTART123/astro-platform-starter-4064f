// Inversa Rx brand tokens (from the Inversa Rx brand guide) and shared props.

export const FPS = 30;

// Brand guide colors
export const BLUE = "#0080FB"; // PMS 285 C
export const SKY = "#009EFA"; // PMS 2925 C
export const GREEN = "#68DF83"; // PMS 361 C
export const GREEN_MID = "#00C970"; // PMS 354 C
export const GREEN_DEEP = "#007970"; // gradient end, readable on white
export const STAR = "#FBB03B"; // PMS 1365 C
export const MIST = "#D9DAE2"; // PMS 5315 C
export const NAVY = "#0B1A3A"; // text, from the Optical logo

// News look (version 1)
export const RED = "#E1141E";
export const RED_DARK = "#8E0A10";
export const GOLD = "#FFC21A";

export const FONT = "Inter, 'Inter Display', 'Noto Color Emoji', 'DejaVu Sans', sans-serif";
export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export type BrandProps = {
  /** Name used in headlines and the ticker. */
  brand: string;
  address: string;
  crossStreet: string;
  phone: string;
  website: string;
  instagram: string;
  appointments: string;
  examDeal: string;
  examWas: string;
  examCondition: string;
  framesDeal: string;
  framesCondition: string;
  benefits: string;
  benefitsNote: string;
  finePrint: string;
  /**
   * Background music file in public/audio (e.g. "suno-v1.mp3").
   * Leave empty to use the built-in synthesized track.
   */
  music: string;
  /** Skip into the Suno track, e.g. 12 to start at its hook instead of its intro. */
  musicStartSeconds: number;
  musicVolume: number;
  sfxVolume: number;
  withAudio: boolean;
};

// Matches the "OTC & Vision Benefits Accepted" flyer.
export const defaultBrandProps: BrandProps = {
  brand: "Inversa Rx Optical",
  address: "3545 White Plains Rd, Bronx",
  crossStreet: "Corner of White Plains Rd & E 213th St",
  phone: "(929) 717-4415",
  website: "InversaRx.com/optical",
  instagram: "@inversarx_pharmacy",
  appointments: "Eye exams by appointment",
  examDeal: "FREE",
  examWas: "$75",
  examCondition: "eye exam with frame purchase",
  framesDeal: "25% OFF",
  framesCondition: "all frames",
  benefits: "OTC & vision benefits accepted",
  benefitsNote: "Bring your benefit card. We'll check your eligibility and balance.",
  finePrint:
    "Free exam requires a frame purchase. Eligible cards, participating plans only. Coverage varies by plan and available balance.",
  music: "",
  musicStartSeconds: 0,
  musicVolume: 0.55,
  sfxVolume: 1,
  withAudio: true,
};

/** The real optical info for the footer ticker, with version-specific lines mixed in. */
export const opticalTickerItems = (p: BrandProps, extras: string[]) => {
  const info = [
    `FREE EYE EXAM (${p.examWas} VALUE) WITH FRAME PURCHASE*`,
    `${p.framesDeal} ${p.framesCondition.toUpperCase()}`,
    `${p.benefits.toUpperCase()}: BRING YOUR BENEFIT CARD`,
    `EYE EXAMS • PRESCRIPTION EYEGLASSES • READING GLASSES`,
    `${p.address.toUpperCase()} • ${p.phone}`,
    `BETTER VISION. BETTER LIFE.`,
  ];
  const out: string[] = [];
  const n = Math.max(info.length, extras.length);
  for (let i = 0; i < n; i++) {
    if (extras[i]) out.push(extras[i]);
    if (info[i]) out.push(info[i]);
  }
  return out;
};

/**
 * The Inversa Rx jingle, cued per version so the sung lines land on the matching visuals.
 * Lyric timings in the song: verse "when's the last time you really checked your eyes" 6.5s,
 * chorus "Inversa Rx… better vision, better life" 24.0s.
 */
export const withJingle = (startSeconds: number, file = "inversa-rx-jingle.mp3"): BrandProps => ({
  ...defaultBrandProps,
  music: file,
  musicStartSeconds: startSeconds,
  musicVolume: 0.95,
  sfxVolume: 0.45,
});
