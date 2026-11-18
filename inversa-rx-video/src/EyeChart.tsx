import React from "react";
import { AbsoluteFill, Easing, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BLUE, BrandProps, FONT, GREEN, NAVY, RED, clamp, withJingle, opticalTickerItems } from "./brand";
import { EndCard, Soundtrack, Ticker } from "./shared";

/* Version 3: "Eye Chart". An eye chart that asks the question, then a tiny line that matters. */

const LINES = [
  { text: "WHEN", size: 200, top: 360, at: 20, ratio: "20/200" },
  { text: "DID YOU", size: 140, top: 620, at: 44, ratio: "20/100" },
  { text: "LAST GET", size: 110, top: 820, at: 68, ratio: "20/70" },
  { text: "YOUR EYES", size: 86, top: 975, at: 92, ratio: "20/50" },
  { text: "CHECKED?", size: 68, top: 1100, at: 116, ratio: "20/40" },
];
const TINY = { top: 1200, at: 146, size: 25 };
const ZOOM_START = 170;
const ZOOM_END = 222;
const FOCUS_END = 262; // glasses land, text sharpens
const CARE = 268; // concern card
const CTA = 372;
const END = 522;
export const EYECHART_DURATION = END;
export const EYECHART_SFX_FRAMES = [...LINES.map((l) => l.at), TINY.at, ZOOM_START, FOCUS_END - 8, CARE];

export type EyeChartProps = BrandProps;
export const defaultEyeChartProps: EyeChartProps = withJingle(24.0);

const Chart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const zoom = interpolate(frame, [ZOOM_START, ZOOM_END], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const scale = interpolate(zoom, [0, 1], [1, 2.9]);
  const shiftY = interpolate(zoom, [0, 1], [0, 900 - (TINY.top + 48)]);
  const blur = interpolate(frame, [ZOOM_START, ZOOM_END, FOCUS_END - 14, FOCUS_END], [0, 7, 7, 0], clamp);
  const glasses = spring({ frame: frame - (FOCUS_END - 30), fps, config: { damping: 14 } });
  const tiny = spring({ frame: frame - TINY.at, fps, config: { damping: 18 } });

  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: "linear-gradient(180deg, #EEF2F7 0%, #DDE5EF 100%)" }}>
      {/* the chart (zooms in on the tiny line) */}
      <AbsoluteFill
        style={{
          transformOrigin: `540px ${TINY.top + 48}px`,
          transform: `translateY(${shiftY}px) scale(${scale})`,
        }}
      >
        {/* light box */}
        <div
          style={{
            position: "absolute",
            top: 250,
            left: 70,
            right: 70,
            height: 1100,
            background: "#FFFFFD",
            borderRadius: 18,
            boxShadow: "0 30px 80px rgba(11,26,58,0.18), inset 0 0 0 10px #F1F1EC",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 280,
            left: 0,
            right: 0,
            textAlign: "center",
            color: "#8A94AA",
            fontWeight: 700,
            fontSize: 28,
            letterSpacing: 8,
            opacity: interpolate(frame, [0, 10], [0, 1], clamp),
          }}
        >
          INVERSA RX OPTICAL · QUICK EYE TEST
        </div>
        {LINES.map((l, i) => {
          const s = spring({ frame: frame - l.at, fps, config: { damping: 14, stiffness: 170 } });
          return (
            <div key={l.text} style={{ position: "absolute", top: l.top, left: 0, right: 0, height: l.size }}>
              <div
                style={{
                  position: "absolute",
                  left: 100,
                  top: l.size / 2 - 14,
                  fontSize: 22,
                  color: "#9AA3B5",
                  fontWeight: 700,
                  opacity: s,
                }}
              >
                {i + 1}
              </div>
              <div
                style={{
                  position: "absolute",
                  right: 96,
                  top: l.size / 2 - 14,
                  fontSize: 22,
                  color: "#9AA3B5",
                  fontWeight: 700,
                  opacity: s,
                }}
              >
                {l.ratio}
              </div>
              <div
                style={{
                  textAlign: "center",
                  fontWeight: 900,
                  fontSize: l.size,
                  lineHeight: 1,
                  color: i === 4 ? RED : NAVY,
                  letterSpacing: l.size * 0.06,
                  opacity: s,
                  transform: `scale(${interpolate(s, [0, 1], [1.25, 1])})`,
                }}
              >
                {l.text}
              </div>
            </div>
          );
        })}
        {/* the tiny line that matters */}
        <div
          style={{
            position: "absolute",
            top: TINY.top,
            left: 0,
            right: 0,
            textAlign: "center",
            fontWeight: 800,
            fontSize: TINY.size,
            color: NAVY,
            letterSpacing: 1,
            lineHeight: 1.3,
            opacity: tiny,
            filter: `blur(${blur}px)`,
          }}
        >
          if this line is blurry…
          <br />
          honestly, I'm
          <br />
          concerned about you.
        </div>
      </AbsoluteFill>

      {/* glasses drop in and bring it into focus */}
      <div
        style={{
          position: "absolute",
          top: 680,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          transform: `translateY(${interpolate(glasses, [0, 1], [-1300, 0])}px)`,
          opacity: frame >= ZOOM_END ? 1 : 0,
        }}
      >
        <svg width="1060" height="460" viewBox="0 0 1060 460">
          {[0, 1].map((i) => {
            const x = 30 + i * 540;
            return (
              <rect key={i} x={x} y={40} width={460} height={380} rx={120} fill="rgba(0,128,251,0.06)" stroke={NAVY} strokeWidth={30} />
            );
          })}
          <path d="M490 140 Q530 95 570 140" fill="none" stroke={NAVY} strokeWidth={26} strokeLinecap="round" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

const Care: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wipe = interpolate(frame, [0, 16], [0, 100], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const a = spring({ frame: frame - 10, fps, config: { damping: 15 } });
  const b = spring({ frame: frame - 40, fps, config: { damping: 15 } });
  const c = spring({ frame: frame - 62, fps, config: { damping: 15 } });
  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT,
        clipPath: `circle(${wipe * 1.5}% at 50% 50%)`,
        background: `linear-gradient(160deg, ${BLUE} 0%, #0061C2 100%)`,
        alignItems: "center",
        justifyContent: "center",
        padding: "0 80px",
        textAlign: "center",
        color: "white",
      }}
    >
      <div style={{ opacity: a, transform: `scale(${interpolate(a, [0, 1], [0.6, 1])})` }}>
        <Img src={staticFile("inversa-rx-symbol.png")} style={{ width: 200 }} />
      </div>
      <div
        style={{
          marginTop: 40,
          fontWeight: 900,
          fontSize: 100,
          lineHeight: 1.05,
          letterSpacing: -2,
          opacity: a,
          transform: `translateY(${interpolate(a, [0, 1], [40, 0])}px)`,
        }}
      >
        When did you last
        <br />
        <span style={{ color: GREEN }}>really</span> check
        <br />
        your eyes?
      </div>
      <div style={{ marginTop: 50, fontWeight: 700, fontSize: 54, opacity: b, transform: `translateY(${interpolate(b, [0, 1], [30, 0])}px)` }}>
        Not a joke this time. We care.
      </div>
      <div
        style={{
          marginTop: 30,
          fontWeight: 600,
          fontSize: 42,
          color: "rgba(255,255,255,0.85)",
          opacity: c,
          transform: `translateY(${interpolate(c, [0, 1], [30, 0])}px)`,
        }}
      >
        Only an eye exam can really tell.
      </div>
    </AbsoluteFill>
  );
};

export const EyeChart: React.FC<EyeChartProps> = (props) => {
  const items = opticalTickerItems(props, [
    `QUICK EYE TEST IN PROGRESS`,
    `SQUINTING AT THIS? THAT'S A SIGN`,
    `WE'RE CONCERNED ABOUT YOU. REALLY.`,
  ]);
  return (
    <AbsoluteFill style={{ background: "white" }}>
      <Sequence durationInFrames={CTA} layout="none">
        <Chart />
        <Sequence from={CARE} durationInFrames={CTA - CARE} layout="none">
          <Care />
        </Sequence>
        <Ticker items={items} bottom={120} />
      </Sequence>
      <Sequence from={CTA} durationInFrames={END - CTA}>
        <EndCard {...props} kicker="Better vision starts with one visit." />
      </Sequence>
      <Soundtrack id="v3" p={props} durationInFrames={END} />
    </AbsoluteFill>
  );
};

