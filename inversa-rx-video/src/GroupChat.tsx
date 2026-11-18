import React from "react";
import { AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BLUE, BrandProps, FONT, GREEN, NAVY, STAR, opticalTickerItems, withJingle } from "./brand";
import { EndCard, Soundtrack, Ticker } from "./shared";

/* Version 4: "The Boys". A group chat roasts one friend's eyesight, then sends him to Inversa Rx. */

// Edit names here to make it feel like your crew.
const BOYS = {
  dre: { name: "Dre", color: "#E8590C" },
  marcus: { name: "Marcus", color: "#7048E8" },
  tone: { name: "Tone", color: "#0C8599" },
  kev: { name: "Kev", color: "#C2255C" },
} as const;
type Boy = keyof typeof BOYS;

type Msg = { at: number; from: Boy; text: string; big?: boolean };

const MESSAGES: Msg[] = [
  { at: 8, from: "dre", text: "yo who was squinting at the menu last night 😂" },
  { at: 46, from: "marcus", text: "bro had his phone at arm's length 💀💀" },
  { at: 84, from: "tone", text: "nah my eyes are fine" },
  { at: 116, from: "kev", text: "you called me Marcus. TWICE. 😭" },
  { at: 160, from: "dre", text: "fam… when's the last time you REALLY checked your eyes?", big: true },
  { at: 212, from: "marcus", text: "fr tho. we concerned about you bro ❤️" },
  { at: 256, from: "tone", text: "aight aight 😂 where y'all go?" },
  { at: 292, from: "kev", text: "Inversa Rx Optical on White Plains 👓 free eye exam w/ frame purchase + 25% off frames*" },
  { at: 346, from: "tone", text: "say less. pulling up 🙌" },
];
const TYPING = 14;
const CTA = 396;
const END = 546;
export const GROUPCHAT_DURATION = END;

export type GroupChatProps = BrandProps;
// New jingle, delayed 1.4s so "when's the last time you really checked your eyes" lands on Dre's message.
export const defaultGroupChatProps: GroupChatProps = {
  ...withJingle(0, "inversa-rx-jingle-v2.mp3"),
  musicDelaySeconds: 1.4,
};

const bubbleHeight = (m: Msg) => {
  const fs = m.big ? 60 : 48;
  const perLine = m.big ? 22 : 28;
  const lines = Math.ceil(m.text.length / perLine);
  return lines * fs * 1.25 + 52 + 44 + 24;
};

const Avatar: React.FC<{ boy: Boy; size?: number }> = ({ boy, size = 76 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      background: BOYS[boy].color,
      color: "white",
      fontWeight: 900,
      fontSize: size * 0.46,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      border: "4px solid white",
    }}
  >
    {BOYS[boy].name[0]}
  </div>
);

const Bubble: React.FC<{ m: Msg; frame: number }> = ({ m, frame }) => {
  const { fps } = useVideoConfig();
  const pop = spring({ frame: frame - m.at - TYPING, fps, config: { damping: 13, stiffness: 220 } });
  if (frame < m.at) return null;
  const typing = frame < m.at + TYPING;
  // Tone is "you" in the thread: his bubbles sit on the right, like your own messages.
  const mine = m.from === "tone";
  return (
    <div
      style={{
        display: "flex",
        gap: 18,
        alignItems: "flex-end",
        alignSelf: mine ? "flex-end" : "flex-start",
        flexDirection: mine ? "row-reverse" : "row",
        marginBottom: 24,
        maxWidth: 930,
      }}
    >
      {!mine && <Avatar boy={m.from} />}
      {typing ? (
        <div style={{ display: "flex", gap: 12, padding: "28px 32px", background: "white", borderRadius: 36, borderBottomLeftRadius: 10 }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{ width: 16, height: 16, borderRadius: 8, background: "#9AA6BF", transform: `translateY(${Math.sin((frame - i * 4) / 3) * 6}px)` }}
            />
          ))}
        </div>
      ) : (
        <div
          style={{
            padding: m.big ? "22px 34px 28px" : "18px 30px 24px",
            borderRadius: 36,
            borderBottomLeftRadius: mine ? 36 : 10,
            borderBottomRightRadius: mine ? 10 : 36,
            background: mine ? `linear-gradient(135deg, ${BLUE}, #009EFA)` : "white",
            color: mine ? "white" : NAVY,
            boxShadow: "0 8px 24px rgba(11,26,58,0.12)",
            border: m.big ? `5px solid ${GREEN}` : "none",
            transformOrigin: mine ? "bottom right" : "bottom left",
            transform: `scale(${interpolate(pop, [0, 1], [0.5, 1])})`,
            opacity: pop,
          }}
        >
          {!mine && <div style={{ color: BOYS[m.from].color, fontWeight: 800, fontSize: 32, marginBottom: 4 }}>{BOYS[m.from].name}</div>}
          <div style={{ fontWeight: m.big ? 900 : 600, fontSize: m.big ? 60 : 48, lineHeight: 1.25, letterSpacing: m.big ? -1 : 0 }}>
            {m.big ? (
              <>
                fam… when's the last time you <span style={{ color: BLUE }}>REALLY</span> checked your eyes?
              </>
            ) : (
              m.text
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const Thread: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const AREA = 1210;
  const scrollFor = (upTo: (m: Msg) => boolean) => {
    let acc = 0;
    let t = 0;
    for (const m of MESSAGES) {
      if (upTo(m)) {
        acc += bubbleHeight(m);
        t = Math.max(0, acc - AREA);
      }
    }
    return t;
  };
  const lastAt = [...MESSAGES].reverse().find((m) => frame >= m.at)?.at ?? 0;
  const ease = spring({ frame: frame - lastAt, fps, config: { damping: 20 } });
  const scroll = interpolate(ease, [0, 1], [scrollFor((m) => m.at < lastAt), scrollFor((m) => m.at <= lastAt)]);
  const typer = MESSAGES.find((m) => frame >= m.at && frame < m.at + TYPING && m.from !== "tone");

  return (
    <AbsoluteFill style={{ fontFamily: FONT, background: "linear-gradient(180deg, #EAF1FB 0%, #F6F2EC 100%)" }}>
      <AbsoluteFill style={{ opacity: 0.3, backgroundImage: `radial-gradient(${STAR} 2px, transparent 2px)`, backgroundSize: "60px 60px" }} />
      {/* group header */}
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
          padding: "0 40px 30px",
          gap: 24,
          boxShadow: "0 6px 24px rgba(11,26,58,0.08)",
          zIndex: 2,
        }}
      >
        <div style={{ display: "flex", width: 200, height: 100, position: "relative", flexShrink: 0 }}>
          {(["dre", "marcus", "kev"] as Boy[]).map((b, i) => (
            <div key={b} style={{ position: "absolute", left: i * 58, top: 10, zIndex: 3 - i }}>
              <Avatar boy={b} size={78} />
            </div>
          ))}
        </div>
        <div>
          <div style={{ color: NAVY, fontWeight: 900, fontSize: 52 }}>The Boys 🏀</div>
          <div style={{ color: typer ? BLUE : "#6B7690", fontWeight: 600, fontSize: 34 }}>
            {typer ? `${BOYS[typer.from].name} is typing…` : "Dre, Marcus, Kev, You"}
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", top: 280, left: 36, right: 36, height: AREA + 40, overflow: "hidden" }}>
        <div style={{ display: "flex", flexDirection: "column", transform: `translateY(${-scroll}px)` }}>
          {MESSAGES.map((m) => (
            <Bubble key={m.at} m={m} frame={frame} />
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const GroupChat: React.FC<GroupChatProps> = (props) => {
  const items = opticalTickerItems(props, [
    `THE BOYS HAVE SPOKEN`,
    `PHONE AT ARM'S LENGTH IS NOT A VIBE`,
    `PULL UP TO ${props.brand.toUpperCase()}`,
  ]);
  return (
    <AbsoluteFill style={{ background: "white" }}>
      <Sequence durationInFrames={CTA} layout="none">
        <Thread />
        <Ticker items={items} bottom={120} />
      </Sequence>
      <Sequence from={CTA} durationInFrames={END - CTA}>
        <EndCard {...props} kicker="Pull up. We got you 👓" />
      </Sequence>
      <Soundtrack id="v4" p={props} durationInFrames={END} />
    </AbsoluteFill>
  );
};

export const GROUPCHAT_SFX_FRAMES = MESSAGES.map((m) => m.at + TYPING);
