import { Easing, interpolate } from "remotion";
import { clamp } from "./theme";

const ease = Easing.bezier(0.45, 0, 0.2, 1);

/** Keyframe helper: ramp from a to b between frames f0 and f1. */
export const ramp = (frame: number, f0: number, f1: number, a: number, b: number) =>
  interpolate(frame, [f0, f1], [a, b], { ...clamp, easing: ease });

/** Mouth movement while a caption is showing. */
export const talking = (frame: number, from: number, to: number) =>
  frame >= from && frame <= to - 6 ? (Math.sin(frame * 0.9) + 1) / 2 : 0;
