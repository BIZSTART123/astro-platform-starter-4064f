import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BLUE, BrandProps, FONT, GOLD, GREEN, STAR, clamp, opticalTickerItems, withJingle } from "./brand";
import { EndCard, Soundtrack, Ticker } from "./shared";

/* Version 6: "Clear Vision Jutsu". Our take on the hand-sign transformation trend, for eye care. */

export type JutsuProps = BrandProps & {
  photoBefore: string; // the "before": you, pre-transformation
  photoAfter: string; // the reveal: you in glasses
  /** optional action clips in public/clips/: [setup, hand signs, reveal] (see SHOT_LIST.md) */
  clips: string[];
};

// Jingle 1 from 22.3s: the chorus kicks in at 1.7s and "we'll get your eyes right" lands on the reveal.
export const defaultJutsuProps: JutsuProps = {
  ...withJingle(22.3),
  photoBefore: "me-coffee.jpg",
  photoAfter: "me-glasses.jpg",
  clips: ["", "", ""],
};

const T = { setup: 0, signs: 78, poof: 168, reveal: 186, turn: 300, cta: 362, end: 512 };
export const JUTSU_DURATION = T.end;
export const JUTSU_SIGN_FRAMES = [84, 98, 112, 126, 140, 152];
const SIGNS = ["👁️", "✋", "🤞", "☝️", "🙏🏾", "👓"];

const Media: React.FC<{ photo: string; clip?: string; focus: string; scale: number; blur?: number; from?: number }> = ({
  photo,
  clip,
  focus,
  scale,
  blur = 0,
  from = 0,
}) => {
  const style: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", objectPosition: focus, filter: blur ? `blur(${blur}px)` : undefined };
  return (
    <AbsoluteFill style={{ transformOrigin: focus, transform: `scale(${scale})` }}>
      {clip ? (
        <Sequence from={from} layout="none">
          <OffthreadVideo src={staticFile(clip)} muted style={style} />
        </Sequence>
      ) : (
        <Img src={staticFile(photo)} style={style} />
      )}
    </AbsoluteFill>
  );
};

const Caption: React.FC<{ children: React.ReactNode; top?: number; big?: boolean; at?: number }> = ({ children, top = 1180, big, at = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 12, stiffness: 200 } });
  return (
    <div style={{ position: "absolute", left: 50, right: 50, top, textAlign: "center", opacity: s, transform: `scale(${interpolate(s, [0, 1], [0.8, 1])})` }}>
      <span
        style={{
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: big ? 96 : 70,
          lineHeight: 1.25,
          color: "white",
          background: big ? "rgba(11,26,58,0.85)" : "rgba(0,0,0,0.55)",
          boxDecorationBreak: "clone",
          WebkitBoxDecorationBreak: "clone",
          padding: "6px 22px",
          borderRadius: 18,
        }}
      >
        {children}
      </span>
    </div>
  );
};

/** Anime-style speed lines radiating from the centre. */
const SpeedLines: React.FC<{ intensity: number }> = ({ intensity }) => {
  const frame = useCurrentFrame();
  return (
    <svg width="1080" height="1920" style={{ position: "absolute", opacity: intensity, mixBlendMode: "screen" }}>
      {Array.from({ length: 70 }).map((_, i) => {
        const a = (i / 70) * Math.PI * 2 + random(`a${i}`) * 0.08;
        const r0 = 330 + random(`r${i}-${Math.floor(frame / 2)}`) * 260;
        const w = 2 + random(`w${i}`) * 6;
        return (
          <line
            key={i}
            x1={540 + Math.cos(a) * r0}
            y1={900 + Math.sin(a) * r0}
            x2={540 + Math.cos(a) * 1500}
            y2={900 + Math.sin(a) * 1500}
            stroke="white"
            strokeWidth={w}
            strokeOpacity={0.55}
          />
        );
      })}
    </svg>
  );
};

/** Smoke "poof" for the transformation. */
const Poof: React.FC = () => {
  const frame = useCurrentFrame();
  const flash = interpolate(frame, [0, 3, 16], [1, 1, 0], clamp);
  return (
    <AbsoluteFill>
      {Array.from({ length: 26 }).map((_, i) => {
        const a = (i / 26) * Math.PI * 2;
        const dist = interpolate(frame, [0, 40], [40, 420 + random(`d${i}`) * 260], { ...clamp, easing: Easing.out(Easing.cubic) });
        const size = interpolate(frame, [0, 40], [120, 380 + random(`s${i}`) * 200], clamp);
        const op = interpolate(frame, [0, 6, 46], [0, 0.95, 0], clamp);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 540 + Math.cos(a) * dist - size / 2,
              top: 900 + Math.sin(a) * dist - size / 2,
              width: size,
              height: size,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(225,230,240,0.85) 45%, rgba(200,205,220,0) 70%)",
              opacity: op,
              filter: "blur(4px)",
            }}
          />
        );
      })}
      <AbsoluteFill style={{ background: "white", opacity: flash }} />
    </AbsoluteFill>
  );
};

const Sparkles: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill>
      {Array.from({ length: 18 }).map((_, i) => {
        const x = 120 + random(`x${i}`) * 840;
        const y = 300 + random(`y${i}`) * 900;
        const t = (frame + random(`t${i}`) * 40) % 40;
        const s = interpolate(t, [0, 10, 20], [0, 1, 0], clamp);
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, fontSize: 40 + random(`f${i}`) * 40, transform: `scale(${s})`, color: i % 2 ? STAR : "white" }}>
            ✦
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const Jutsu: React.FC<JutsuProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [clipSetup, clipSigns, clipReveal] = [props.clips?.[0], props.clips?.[1], props.clips?.[2]];

  // hand-sign punches: each sign gives the frame a zoom kick and a shake
  const kick = JUTSU_SIGN_FRAMES.reduce((acc, f) => acc + Math.max(0, 1 - Math.abs(frame - f) / 5), 0);
  const charge = interpolate(frame, [T.signs, T.poof], [0, 1], clamp);
  const shake = frame >= T.signs && frame < T.poof + 10 ? (random(`sh${frame}`) - 0.5) * (8 + charge * 26) : 0;
  const before = frame < T.reveal;
  const revealSharp = interpolate(frame, [T.reveal, T.reveal + 26], [14, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const revealZoom = interpolate(frame, [T.reveal, T.turn], [1.55, 1.25], { ...clamp, easing: Easing.out(Easing.cubic) });
  const signIdx = JUTSU_SIGN_FRAMES.findIndex((f, i) => frame >= f && frame < (JUTSU_SIGN_FRAMES[i + 1] ?? T.poof));

  const items = opticalTickerItems(props, [`CLEAR VISION JUTSU 👓`, `SQUINTING HAS BEEN DEFEATED`, `YOUR TURN: COME SEE ME`]);

  return (
    <AbsoluteFill style={{ background: "black", fontFamily: FONT }}>
      <Sequence durationInFrames={T.cta} layout="none">
        <AbsoluteFill style={{ transform: `translate(${shake}px, ${shake * 0.6}px)` }}>
          {before ? (
            <Media
              photo={props.photoBefore}
              clip={frame < T.signs ? clipSetup : clipSigns}
              from={frame < T.signs ? 0 : T.signs}
              focus="60% 30%"
              scale={1.25 + kick * 0.08 + charge * 0.25}
              // squinty, slightly blurry "before"
              blur={clipSigns && frame >= T.signs ? 0 : 1.5}
            />
          ) : (
            <Media photo={props.photoAfter} clip={clipReveal} from={T.reveal} focus="50% 40%" scale={revealZoom} blur={revealSharp} />
          )}
        </AbsoluteFill>

        {/* before: dim, flat look; after: bright and crisp */}
        <AbsoluteFill style={{ background: before ? "rgba(10,10,30,0.25)" : "transparent" }} />
        <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.55) 100%)" }} />

        {/* setup (visible on frame 0: the WhatsApp thumbnail) */}
        <Sequence durationInFrames={T.signs} layout="none">
          <Caption at={-20}>
            Me when you say you "see fine"…
            <br />
            but you're squinting at the menu 😑
          </Caption>
        </Sequence>

        {/* hand signs */}
        <Sequence from={T.signs} durationInFrames={T.poof - T.signs} layout="none">
          <SpeedLines intensity={0.35 + charge * 0.5} />
          <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 47%, transparent 30%, rgba(0,128,251,${0.15 + charge * 0.35}) 100%)` }} />
          {signIdx >= 0 && (
            <div
              key={signIdx}
              style={{
                position: "absolute",
                top: 1150,
                left: 0,
                right: 0,
                textAlign: "center",
                fontSize: 220,
                transform: `scale(${interpolate(frame - JUTSU_SIGN_FRAMES[signIdx], [0, 5], [1.8, 1], clamp)})`,
              }}
            >
              {SIGNS[signIdx]}
            </div>
          )}
          <div style={{ position: "absolute", top: 230, left: 0, right: 0, textAlign: "center" }}>
            <span style={{ fontWeight: 900, fontSize: 64, letterSpacing: 6, color: GOLD, textShadow: "0 0 30px rgba(255,194,26,0.8), 4px 4px 0 #000" }}>
              CHARGING… {Math.round(charge * 100)}%
            </span>
          </div>
        </Sequence>

        {/* the poof */}
        <Sequence from={T.poof} durationInFrames={50} layout="none">
          <Poof />
        </Sequence>

        {/* reveal */}
        <Sequence from={T.reveal} durationInFrames={T.turn - T.reveal} layout="none">
          <Sparkles />
          <div style={{ position: "absolute", top: 200, left: 0, right: 0, textAlign: "center" }}>
            {(() => {
              const s = spring({ frame: frame - T.reveal - 6, fps, config: { damping: 9, stiffness: 180 } });
              return (
                <div style={{ transform: `scale(${s}) rotate(-4deg)`, display: "inline-block" }}>
                  <div style={{ fontWeight: 900, fontSize: 104, lineHeight: 1, color: "white", textShadow: `6px 6px 0 ${BLUE}, 0 0 40px rgba(0,128,251,0.7)` }}>
                    ✨ CLEAR VISION
                  </div>
                  <div style={{ fontWeight: 900, fontSize: 140, lineHeight: 1, color: GREEN, textShadow: "6px 6px 0 #0B1A3A" }}>JUTSU 👓</div>
                </div>
              );
            })()}
          </div>
          <Caption at={30} top={1240}>
            Blurry → HD in one visit 😎
          </Caption>
        </Sequence>

        {/* your turn */}
        <Sequence from={T.turn} durationInFrames={T.cta - T.turn} layout="none">
          <Caption at={0} big top={1100}>
            Your turn 👀
            <br />
            Come see me at <span style={{ color: "#7CC4FF" }}>Inversa Rx Optical</span>
          </Caption>
        </Sequence>

        {/* the ticker waits until after the reveal so the opening feels like a real post */}
        <Sequence from={T.reveal + 20} layout="none">
          <Ticker items={items} bottom={120} delay={0} />
        </Sequence>
      </Sequence>

      <Sequence from={T.cta} durationInFrames={T.end - T.cta}>
        <EndCard {...props} kicker="Your turn ✨ Come see me 👓" />
      </Sequence>
      <Soundtrack id="v6" p={props} durationInFrames={T.end} />
    </AbsoluteFill>
  );
};
