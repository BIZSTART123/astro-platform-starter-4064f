import React from "react";
import { AbsoluteFill, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BLUE, BrandProps, FONT, GREEN, NAVY, SKY, withJingle, opticalTickerItems } from "./brand";
import { EndCard, Soundtrack, Ticker } from "./shared";

/* Version 2: "Concerned Friend". A text thread from Inversa Rx that checks in on you. */

type Msg = { at: number; text: string; me?: boolean; big?: boolean };

const MESSAGES: Msg[] = [
  { at: 12, text: "Hey 👋 it's been a minute!" },
  { at: 52, text: "Quick question… and be honest 👀" },
  { at: 96, text: "When was the last time you REALLY checked your eyes?", big: true },
  { at: 158, text: "Squinting at your phone doesn't count 😅" },
  { at: 204, text: "Also… are your glasses older than your phone? 📱👓" },
  { at: 262, text: "Not being dramatic. I'm genuinely concerned about you ❤️" },
  { at: 320, text: "ok ok… I'll stop in 🙈", me: true },
];
const TYPING = 16; // frames of "typing…" before each bubble
const CTA = 372;
const END = 522;
export const CONCERNED_DURATION = END;

export type ConcernedProps = BrandProps;
export const defaultConcernedProps: ConcernedProps = withJingle(4.5);

// Rough height of a bubble, used to scroll the thread as it fills.
const bubbleHeight = (m: Msg) => {
  const fs = m.big ? 64 : 50;
  const perLine = m.big ? 20 : 27;
  const lines = Math.ceil(m.text.length / perLine);
  return lines * fs * 1.25 + 56 + 28;
};

const TypingDots: React.FC<{ frame: number }> = ({ frame }) => (
  <div style={{ display: "flex", gap: 12, padding: "30px 34px", background: "white", borderRadius: 40, borderBottomLeftRadius: 10 }}>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        style={{
          width: 18,
          height: 18,
          borderRadius: 9,
          background: "#9AA6BF",
          transform: `translateY(${Math.sin((frame - i * 4) / 3) * 6}px)`,
        }}
      />
    ))}
  </div>
);

const Bubble: React.FC<{ m: Msg; frame: number }> = ({ m, frame }) => {
  const { fps } = useVideoConfig();
  const local = frame - m.at - (m.me ? 0 : TYPING);
  const pop = spring({ frame: local, fps, config: { damping: 13, stiffness: 220 } });
  const showTyping = !m.me && frame >= m.at && frame < m.at + TYPING;
  const side: React.CSSProperties = m.me ? { alignSelf: "flex-end" } : { alignSelf: "flex-start" };
  if (frame < m.at) return null;
  if (showTyping) {
    return (
      <div style={{ ...side, marginBottom: 28 }}>
        <TypingDots frame={frame} />
      </div>
    );
  }
  return (
    <div
      style={{
        ...side,
        maxWidth: 840,
        marginBottom: 28,
        padding: m.big ? "30px 40px" : "26px 36px",
        borderRadius: 40,
        borderBottomLeftRadius: m.me ? 40 : 10,
        borderBottomRightRadius: m.me ? 10 : 40,
        background: m.me ? `linear-gradient(135deg, ${BLUE}, ${SKY})` : "white",
        color: m.me ? "white" : NAVY,
        fontWeight: m.big ? 900 : 600,
        fontSize: m.big ? 64 : 50,
        lineHeight: 1.25,
        letterSpacing: m.big ? -1 : 0,
        boxShadow: "0 8px 24px rgba(11,26,58,0.12)",
        border: m.big ? `5px solid ${GREEN}` : "none",
        transformOrigin: m.me ? "bottom right" : "bottom left",
        transform: `scale(${interpolate(pop, [0, 1], [0.5, 1])})`,
        opacity: pop,
      }}
    >
      {m.big ? (
        <>
          When was the last time you <span style={{ color: BLUE }}>REALLY</span> checked your eyes?
        </>
      ) : (
        m.text
      )}
    </div>
  );
};

const Thread: React.FC<{ brand: string }> = ({ brand }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const AREA = 1240; // visible thread height
  // Scroll so the newest bubble stays in view.
  let shown = 0;
  let target = 0;
  for (const m of MESSAGES) {
    if (frame >= m.at) {
      shown += bubbleHeight(m);
      target = Math.max(0, shown - AREA);
    }
  }
  const lastAt = [...MESSAGES].reverse().find((m) => frame >= m.at)?.at ?? 0;
  const ease = spring({ frame: frame - lastAt, fps, config: { damping: 20 } });
  let prevTarget = 0;
  {
    let acc = 0;
    for (const m of MESSAGES) {
      if (m.at < lastAt) {
        acc += bubbleHeight(m);
        prevTarget = Math.max(0, acc - AREA);
      }
    }
  }
  const scroll = interpolate(ease, [0, 1], [prevTarget, target]);
  const typing = MESSAGES.some((m) => !m.me && frame >= m.at && frame < m.at + TYPING);

  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: "linear-gradient(180deg, #E8F2FF 0%, #F3FBF6 100%)" }}>
      {/* subtle pattern */}
      <AbsoluteFill
        style={{
          opacity: 0.35,
          backgroundImage: `radial-gradient(${GREEN} 2px, transparent 2px)`,
          backgroundSize: "56px 56px",
        }}
      />
      {/* header */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 250,
          background: "white",
          display: "flex",
          alignItems: "flex-end",
          padding: "0 44px 34px",
          gap: 26,
          boxShadow: "0 6px 24px rgba(11,26,58,0.08)",
          zIndex: 2,
        }}
      >
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            background: "#F2F8FF",
            border: `4px solid ${GREEN}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Img src={staticFile("inversa-rx-symbol.png")} style={{ width: 78 }} />
        </div>
        <div>
          <div style={{ color: NAVY, fontWeight: 900, fontSize: 52 }}>{brand}</div>
          <div style={{ color: typing ? BLUE : "#4CAF6E", fontWeight: 600, fontSize: 36 }}>{typing ? "typing…" : "online"}</div>
        </div>
      </div>

      {/* messages */}
      <div style={{ position: "absolute", top: 290, left: 44, right: 44, height: AREA + 40, overflow: "hidden" }}>
        <div style={{ display: "flex", flexDirection: "column", transform: `translateY(${-scroll}px)` }}>
          {MESSAGES.map((m) => (
            <Bubble key={m.at} m={m} frame={frame} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Concerned: React.FC<ConcernedProps> = (props) => {
  const items = opticalTickerItems(props, [
    `WE MISS YOU AT ${props.brand.toUpperCase()}`,
    `WHEN DID YOU LAST CHECK YOUR EYES?`,
    `SQUINTING IS NOT A STRATEGY`,
  ]);
  return (
    <AbsoluteFill style={{ background: "white" }}>
      <Sequence durationInFrames={CTA} layout="none">
        <Thread brand={props.brand} />
        <Ticker items={items} bottom={120} />
      </Sequence>
      <Sequence from={CTA} durationInFrames={END - CTA}>
        <EndCard {...props} kicker="Let's take care of those eyes 💙" />
      </Sequence>
      <Soundtrack id="v2" p={props} durationInFrames={END} />
    </AbsoluteFill>
  );
};

export const CONCERNED_SFX_FRAMES = MESSAGES.map((m) => m.at + (m.me ? 0 : TYPING));
