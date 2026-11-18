import React from "react";
import { AbsoluteFill, Audio, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BLUE, BrandProps, FONT, GREEN, GREEN_DEEP, NAVY, RED, STAR, clamp } from "./brand";

/* ------------------------------------------------------------------ */
/*  Footer ticker: carries the optical info                           */
/* ------------------------------------------------------------------ */
export const Ticker: React.FC<{
  items: string[];
  label?: string;
  bottom?: number;
  speed?: number;
  delay?: number;
}> = ({ items, label = "OPTICAL", bottom = 150, speed = 7, delay = 8 }) => {
  const frame = useCurrentFrame();
  const text = items.join("   •   ") + "   •   ";
  const x = -Math.max(0, frame - delay) * speed;
  const slideUp = interpolate(frame, [delay, delay + 14], [160, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom,
        height: 110,
        display: "flex",
        transform: `translateY(${slideUp}px)`,
        fontFamily: FONT,
        boxShadow: "0 -6px 30px rgba(0,0,0,0.35)",
      }}
    >
      <div
        style={{
          background: GREEN,
          color: NAVY,
          fontWeight: 900,
          fontSize: 38,
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          zIndex: 2,
          letterSpacing: 2,
        }}
      >
        {label}
      </div>
      <div style={{ flex: 1, background: "white", overflow: "hidden", display: "flex", alignItems: "center" }}>
        <div style={{ whiteSpace: "nowrap", transform: `translateX(${x}px)`, color: NAVY, fontWeight: 800, fontSize: 44 }}>
          {text}
          {text}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  End card: logos, offers, benefits, contact                        */
/* ------------------------------------------------------------------ */
export const EndCard: React.FC<BrandProps & { kicker?: string }> = (p) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame, fps, config: { damping: 13, stiffness: 140 } });
  const kick = spring({ frame: frame - 6, fps, config: { damping: 16 } });
  const tileA = spring({ frame: frame - 14, fps, config: { damping: 12 } });
  const tileB = spring({ frame: frame - 22, fps, config: { damping: 12 } });
  const ben = spring({ frame: frame - 32, fps, config: { damping: 16 } });
  const btn = spring({ frame: frame - 42, fps, config: { damping: 12 } });
  const info = spring({ frame: frame - 52, fps, config: { damping: 18 } });
  const breathe = 1 + Math.sin(frame / 6) * 0.025;
  const strike = interpolate(frame, [28, 38], [0, 100], clamp);
  const tile: React.CSSProperties = {
    flex: 1,
    borderRadius: 30,
    padding: "24px 18px 22px",
    textAlign: "center",
    background: "white",
    boxShadow: "0 16px 40px rgba(11,26,58,0.14)",
  };
  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 20,
        background: "linear-gradient(180deg, #FFFFFF 0%, #F4F9FF 50%, #E3F0FF 100%)",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 26, background: BLUE }} />
      <div style={{ position: "absolute", top: 26, left: 0, right: 0, height: 10, background: GREEN }} />

      <div style={{ transform: `scale(${interpolate(logo, [0, 1], [0.6, 1])})`, opacity: logo }}>
        <Img src={staticFile("inversa-rx-optical-logo.png")} style={{ width: 720 }} />
      </div>

      {p.kicker && (
        <div
          style={{
            marginTop: 30,
            color: NAVY,
            fontWeight: 800,
            fontSize: 46,
            textAlign: "center",
            padding: "0 60px",
            opacity: kick,
            transform: `translateY(${interpolate(kick, [0, 1], [24, 0])}px)`,
          }}
        >
          {p.kicker}
        </div>
      )}

      <div style={{ display: "flex", gap: 30, width: 960, marginTop: 40 }}>
        <div style={{ ...tile, border: `5px solid ${BLUE}`, transform: `scale(${tileA})` }}>
          <div style={{ position: "relative", display: "inline-block", color: RED, fontWeight: 800, fontSize: 48 }}>
            {p.examWas}
            <div
              style={{
                position: "absolute",
                left: -6,
                top: "52%",
                height: 6,
                width: `calc(${strike}% + 12px)`,
                background: RED,
                transform: "rotate(-8deg)",
              }}
            />
          </div>
          <div style={{ color: GREEN_DEEP, fontWeight: 900, fontSize: 100, lineHeight: 1, letterSpacing: -2 }}>{p.examDeal}</div>
          <div style={{ color: NAVY, fontWeight: 800, fontSize: 36, marginTop: 10, lineHeight: 1.15 }}>{p.examCondition}*</div>
        </div>
        <div style={{ ...tile, border: `5px solid ${GREEN}`, transform: `scale(${tileB})` }}>
          <svg width="96" height="50" viewBox="0 0 96 50" style={{ marginTop: 6 }}>
            <rect x="4" y="8" width="36" height="30" rx="12" fill="none" stroke={GREEN_DEEP} strokeWidth="7" />
            <rect x="56" y="8" width="36" height="30" rx="12" fill="none" stroke={GREEN_DEEP} strokeWidth="7" />
            <path d="M40 18 Q48 10 56 18" fill="none" stroke={GREEN_DEEP} strokeWidth="6" />
          </svg>
          <div style={{ color: GREEN_DEEP, fontWeight: 900, fontSize: 92, lineHeight: 1, letterSpacing: -2 }}>{p.framesDeal}</div>
          <div style={{ color: NAVY, fontWeight: 800, fontSize: 36, marginTop: 10 }}>{p.framesCondition}</div>
        </div>
      </div>

      <div
        style={{
          marginTop: 26,
          width: 960,
          background: NAVY,
          color: "white",
          borderRadius: 30,
          padding: "24px 34px",
          display: "flex",
          alignItems: "center",
          gap: 26,
          opacity: ben,
          transform: `translateY(${interpolate(ben, [0, 1], [40, 0])}px)`,
        }}
      >
        <svg width="92" height="68" viewBox="0 0 92 68" style={{ flexShrink: 0 }}>
          <rect x="3" y="3" width="86" height="62" rx="10" fill={BLUE} />
          <rect x="3" y="16" width="86" height="12" fill={NAVY} />
          <rect x="12" y="40" width="34" height="8" rx="4" fill="white" />
          <circle cx="72" cy="47" r="10" fill={STAR} />
        </svg>
        <div>
          <div style={{ fontWeight: 900, fontSize: 42, color: GREEN }}>{p.benefits}</div>
          <div style={{ fontWeight: 500, fontSize: 31, marginTop: 6, lineHeight: 1.25, color: "rgba(255,255,255,0.88)" }}>
            {p.benefitsNote}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 34,
          background: BLUE,
          color: "white",
          fontWeight: 900,
          fontSize: 60,
          padding: "24px 60px",
          borderRadius: 999,
          transform: `scale(${btn * breathe})`,
          boxShadow: "0 18px 50px rgba(0,128,251,0.4)",
        }}
      >
        Stop in this week
      </div>

      <div
        style={{
          marginTop: 28,
          textAlign: "center",
          color: NAVY,
          opacity: info,
          transform: `translateY(${interpolate(info, [0, 1], [30, 0])}px)`,
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 62, color: BLUE }}>{p.phone}</div>
        <div style={{ fontWeight: 800, fontSize: 40, marginTop: 6 }}>{p.address}</div>
        <div style={{ fontWeight: 600, fontSize: 31, color: "#4A5878", marginTop: 6 }}>
          {p.appointments} · {p.website}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 20 }}>
          <span style={{ fontWeight: 600, fontSize: 28, color: "#4A5878" }}>Inside</span>
          <Img src={staticFile("inversa-rx-pharmacy-logo.png")} style={{ height: 60 }} />
        </div>
        <div style={{ fontWeight: 500, fontSize: 23, color: "#7A86A0", marginTop: 16, padding: "0 90px", lineHeight: 1.3 }}>
          *{p.finePrint}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/*  Soundtrack: sound effects + music (synth or a Suno file)          */
/* ------------------------------------------------------------------ */
export const Soundtrack: React.FC<{ id: string; p: BrandProps; durationInFrames: number }> = ({ id, p, durationInFrames }) => {
  if (!p.withAudio) return null;
  const musicSrc = p.music ? staticFile(`audio/${p.music}`) : staticFile(`audio/music-${id}.wav`);
  const fadeOut = 20;
  return (
    <>
      <Audio src={staticFile(`audio/sfx-${id}.wav`)} />
      <Audio
        src={musicSrc}
        trimBefore={p.music ? Math.round(p.musicStartSeconds * 30) : undefined}
        volume={(f) =>
          p.musicVolume *
          interpolate(f, [0, 10, durationInFrames - fadeOut, durationInFrames], [0, 1, 1, 0], clamp)
        }
      />
    </>
  );
};
