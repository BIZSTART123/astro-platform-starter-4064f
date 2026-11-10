import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { C, clamp, H, inter, slab, W, work } from "./theme";

const pop = (frame: number, start: number) =>
  interpolate(frame, [start, start + 8], [0.85, 1], { ...clamp, easing: Easing.bezier(0.2, 1.4, 0.4, 1) });

/** Speaker caption in the lower third. `world` picks the Then or Now style. */
export const Caption: React.FC<{
  from: number;
  to: number;
  who: string;
  text: string;
  world: "then" | "now";
}> = ({ from, to, who, text, world }) => {
  const frame = useCurrentFrame();
  if (frame < from || frame > to) return null;
  const then = world === "then";
  const out = interpolate(frame, [to - 6, to], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        left: 80,
        right: 80,
        bottom: 150,
        opacity: out,
        scale: pop(frame, from),
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 14,
      }}
    >
      <div
        style={{
          fontFamily: then ? work : inter,
          fontWeight: 700,
          fontSize: 38,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: then ? C.thenBg : C.nowBg,
          background: then ? C.mahoganyLight : C.violet,
          padding: "8px 20px",
          borderRadius: 999,
        }}
      >
        {who}
      </div>
      <div
        style={{
          fontFamily: then ? work : inter,
          fontWeight: 700,
          fontSize: 60,
          lineHeight: 1.2,
          color: then ? C.thenInk : C.nowInk,
          background: then ? "rgba(247,234,210,0.95)" : "rgba(13,12,29,0.9)",
          border: then ? `4px solid ${C.mahoganyLight}` : `3px solid ${C.violet}`,
          padding: "26px 34px",
          borderRadius: 24,
        }}
      >
        {text}
      </div>
    </div>
  );
};

/** Opening split card: Yard Church on top, Foreign Church below. */
export const TitleCard: React.FC<{ episode: number; title: string }> = ({ episode, title }) => {
  const frame = useCurrentFrame();
  const topIn = interpolate(frame, [0, 14], [-W, 0], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const botIn = interpolate(frame, [8, 22], [W, 0], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const vs = interpolate(frame, [20, 30], [0, 1], { ...clamp, easing: Easing.bezier(0.2, 1.6, 0.4, 1) });
  const ep = interpolate(frame, [36, 50], [0, 1], clamp);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{ position: "absolute", top: 0, left: 0, width: W, height: H / 2, translate: `${topIn}px 0`,
        background: "radial-gradient(120% 100% at 30% 20%, #f7d79a, #c99a52 50%, #6e8a72 100%)",
        display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 140 }}>
        <div style={{ fontFamily: slab, fontSize: 150, lineHeight: 0.95, color: "#fff", textAlign: "center",
          textShadow: "0 6px 30px rgba(60,30,5,0.5)" }}>YARD<br />CHURCH</div>
      </div>
      <div style={{ position: "absolute", top: H / 2, left: 0, width: W, height: H / 2, translate: `${botIn}px 0`,
        background: "radial-gradient(110% 90% at 50% 0%, #4a3fb8, #1b1747 55%, #07070f)",
        display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 140 }}>
        <div style={{ fontFamily: slab, fontSize: 150, lineHeight: 0.95, color: "#fff", textAlign: "center",
          textShadow: "0 6px 30px rgba(0,0,0,0.6)" }}>FOREIGN<br />CHURCH</div>
      </div>
      <div style={{ position: "absolute", left: W / 2 - 90, top: H / 2 - 90, width: 180, height: 180, borderRadius: 90,
        background: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: slab, fontSize: 76, color: "#1c2420", scale: vs }}>vs</div>
      <div style={{ position: "absolute", left: 80, right: 80, bottom: 130, opacity: ep, translate: `0 ${(1 - ep) * 30}px`,
        textAlign: "center", fontFamily: work, fontWeight: 700, color: "#fff", fontSize: 52 }}>
        Episode {episode} · {title}
      </div>
    </AbsoluteFill>
  );
};

/** "THEN" / "NOW" bumper between the two halves. */
export const WorldCard: React.FC<{ world: "then" | "now"; place: string }> = ({ world, place }) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [0, 10], [1.4, 1], { ...clamp, easing: Easing.bezier(0.16, 1, 0.3, 1) });
  const o = interpolate(frame, [0, 6], [0, 1], clamp);
  const then = world === "then";
  return (
    <AbsoluteFill style={{
      background: then
        ? "radial-gradient(120% 90% at 30% 20%, #f7d79a, #c99a52 55%, #6e8a72)"
        : "radial-gradient(110% 90% at 50% 0%, #4a3fb8, #1b1747 55%, #07070f)",
      alignItems: "center", justifyContent: "center", gap: 30,
    }}>
      <div style={{ fontFamily: then ? slab : inter, fontWeight: 700, fontSize: then ? 260 : 240, color: "#fff",
        letterSpacing: then ? 0 : 20, scale: s, opacity: o, textShadow: "0 8px 40px rgba(0,0,0,0.35)" }}>
        {then ? "THEN" : "NOW"}
      </div>
      <div style={{ fontFamily: then ? work : inter, fontWeight: 500, fontSize: 56, color: "#fff", opacity: o }}>{place}</div>
    </AbsoluteFill>
  );
};

/** Closing vote card. */
export const EndCard: React.FC<{ episode: number }> = ({ episode }) => {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [0, 12], [0, 1], clamp);
  const b = interpolate(frame, [12, 24], [0, 1], { ...clamp, easing: Easing.bezier(0.2, 1.5, 0.4, 1) });
  const pulse = 1 + Math.sin(frame / 6) * 0.03;
  return (
    <AbsoluteFill style={{ background: "#e7efe9", alignItems: "center", justifyContent: "center", gap: 60, padding: 80 }}>
      <div style={{ fontFamily: slab, fontSize: 110, lineHeight: 1.05, color: C.mahogany, textAlign: "center", opacity: a }}>
        Which church won this round?
      </div>
      <div style={{ display: "flex", gap: 40, scale: b }}>
        <div style={{ fontFamily: slab, fontSize: 80, color: "#fff", background: C.mahogany, padding: "26px 60px",
          borderRadius: 999, scale: pulse }}>THEN</div>
        <div style={{ fontFamily: inter, fontWeight: 700, fontSize: 80, color: C.nowInk, background: C.nowBg,
          padding: "26px 60px", borderRadius: 999 }}>NOW</div>
      </div>
      <div style={{ fontFamily: work, fontWeight: 500, fontSize: 52, color: "#3b4a40", textAlign: "center", opacity: a }}>
        Tell us in the comments.
      </div>
      <div style={{ position: "absolute", bottom: 130, fontFamily: work, fontWeight: 700, fontSize: 40, color: "#56635b",
        letterSpacing: 3, textTransform: "uppercase" }}>
        Yard Church vs Foreign Church · Ep {episode}
      </div>
    </AbsoluteFill>
  );
};
