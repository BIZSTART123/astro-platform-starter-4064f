import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fonts are bundled in public/fonts so rendering never needs the network.
loadFont({ family: "Alfa Slab One", url: staticFile("fonts/AlfaSlabOne.woff2"), weight: "400" });
loadFont({ family: "Work Sans", url: staticFile("fonts/WorkSans.woff2"), weight: "100 900" });
loadFont({ family: "Inter", url: staticFile("fonts/Inter.woff2"), weight: "100 900" });

export const slab = "'Alfa Slab One', Georgia, serif";
export const work = "'Work Sans', system-ui, sans-serif";
export const inter = "'Inter', system-ui, sans-serif";

export const FPS = 30;
export const W = 1080;
export const H = 1920;
export const sec = (s: number) => Math.round(s * FPS);

export const C = {
  wall: "#bcd8c4",
  wallShade: "#9cc2a8",
  mahogany: "#6b2f12",
  mahoganyLight: "#8f4520",
  gold: "#e0a43a",
  sun: "#fff1c9",
  thenBg: "#f7ead2",
  thenInk: "#3b210f",
  nowBg: "#0d0c1d",
  nowInk: "#ecebff",
  violet: "#8b84ff",
  blue: "#59b6ff",
  skinDeep: "#5a321d",
  skinMid: "#7a4a2e",
  skinWarm: "#94603c",
  hair: "#1a120d",
  white: "#fbf8f2",
};

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;
