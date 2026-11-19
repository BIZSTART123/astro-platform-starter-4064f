import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BrandProps, FONT, GREEN, clamp, opticalTickerItems, withJingle } from "./brand";
import { EndCard, Soundtrack, Ticker } from "./shared";

/* Version 5: "It's Me". Your own selfie, talking to the viewer in first-person captions. */

export type ItsMeProps = BrandProps & {
  /** Your photos in public/ (git-ignored, they stay on this machine). */
  photo: string; // car selfie: "hey it's me" + the eye zoom (also the thumbnail)
  photoCoffee: string; // "I was literally just thinking about you"
  photoSmile: string; // "'cause I care about you"
  photoGlasses: string; // come see me at Inversa Rx Optical
  /**
   * Optional: a real selfie video or a Runway clip in public/ (e.g. "me-runway.mp4").
   * When set, it plays instead of the still photo.
   */
  selfieVideo: string;
  /** Optional first name, e.g. "Marcus". Empty = generic version for the blast. */
  name: string;
};

// Jingle 1 from 0.7s: "when's the last time you really checked your eyes" (6.5s in the song)
// lands on the matching caption, and "come down White Plains Road" on "come see me".
export const defaultItsMeProps: ItsMeProps = {
  ...withJingle(0.7),
  photo: "me-selfie.jpg",
  photoCoffee: "me-coffee.jpg",
  photoSmile: "me-smile.jpg",
  photoGlasses: "me-glasses.jpg",
  selfieVideo: "",
  name: "",
};

type Cap = { from: number; to: number; text: React.ReactNode; accent?: boolean };
// Written to one person, never to "everyone": it's a blast that feels like a 1-on-1.
const captions = (name: string): Cap[] => [
  // visible on frame 0 = the WhatsApp thumbnail
  { from: -14, to: 72, text: name ? <>Hey {name}… it's me 👋</> : <>Hey… it's me 👋</> },
  { from: 76, to: 160, text: <>I was literally just<br />thinking about you 🙏🏾</> },
  {
    from: 166,
    to: 268,
    accent: true,
    text: (
      <>
        Real talk… when's the last time you <span style={{ color: GREEN }}>REALLY</span> checked your eyes? 👀
      </>
    ),
  },
  { from: 272, to: 358, text: <>I'm only asking<br />'cause I care about you ❤️</> },
  { from: 362, to: 438, text: <>Come see me at<br /><span style={{ color: "#7CC4FF" }}>Inversa Rx Optical</span>. I got you 👓</> },
];
const CTA = 440;
const END = 590;
export const ITSME_DURATION = END;

const Caption: React.FC<{ c: Cap }> = ({ c }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - c.from;
  const pop = spring({ frame: local, fps, config: { damping: 12, stiffness: 200 } });
  const out = interpolate(frame, [c.to - 6, c.to], [1, 0], clamp);
  if (frame < c.from || frame > c.to) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: c.accent ? 1060 : 1180,
        textAlign: "center",
        opacity: pop * out,
        transform: `scale(${interpolate(pop, [0, 1], [0.8, 1])})`,
      }}
    >
      <span
        style={{
          display: "inline",
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: c.accent ? 86 : 76,
          lineHeight: 1.25,
          color: "white",
          background: c.accent ? "rgba(11,26,58,0.82)" : "rgba(0,0,0,0.55)",
          boxDecorationBreak: "clone",
          WebkitBoxDecorationBreak: "clone",
          padding: "6px 22px",
          borderRadius: 18,
          textShadow: "0 3px 12px rgba(0,0,0,0.5)",
        }}
      >
        {c.text}
      </span>
    </div>
  );
};

type Shot = {
  src: string;
  from: number;
  to: number;
  /** where the face is, as CSS object-position / transform-origin */
  focus: string;
  zoom: [number, number];
  eased?: boolean;
  /** portrait-mode blur around the subject (hides busy or branded backdrops) */
  portrait?: boolean;
  /** centre of the sharp area for portrait mode (defaults to focus) */
  mask?: string;
};

const FADE = 8;

const ShotView: React.FC<{ shot: Shot }> = ({ shot }) => {
  const frame = useCurrentFrame();
  if (frame < shot.from || frame > shot.to) return null;
  const p = interpolate(frame, [Math.max(0, shot.from), shot.to], [0, 1], {
    ...clamp,
    easing: shot.eased ? Easing.inOut(Easing.cubic) : undefined,
  });
  const scale = interpolate(p, [0, 1], shot.zoom);
  const fade = shot.from <= 0 ? 1 : interpolate(frame, [shot.from, shot.from + FADE], [0, 1], clamp);
  const drift = Math.sin(frame / 40) * 6;
  const img: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", objectPosition: shot.focus };
  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <AbsoluteFill style={{ transformOrigin: shot.focus, transform: `translate(${drift}px, ${drift * 0.6}px) scale(${scale})` }}>
        {shot.portrait ? (
          <>
            <Img src={staticFile(shot.src)} style={{ ...img, filter: "blur(48px) saturate(0.15) brightness(1.05)", transform: "scale(1.15)" }} />
            <AbsoluteFill
              style={{
                WebkitMaskImage: `radial-gradient(ellipse 27% 46% at ${shot.mask ?? shot.focus}, black 72%, transparent 100%)`,
                maskImage: `radial-gradient(ellipse 27% 46% at ${shot.mask ?? shot.focus}, black 72%, transparent 100%)`,
              }}
            >
              <Img src={staticFile(shot.src)} style={img} />
            </AbsoluteFill>
          </>
        ) : (
          <Img src={staticFile(shot.src)} style={img} />
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Selfie: React.FC<{ p: ItsMeProps }> = ({ p }) => {
  const frame = useCurrentFrame();
  const care = interpolate(frame, [272, 300, 352, 362], [0, 1, 1, 0], clamp);
  // Each shot runs a few frames past the next one's start so the cuts crossfade.
  const shots: Shot[] = [
    { src: p.photo, from: -999, to: 76 + FADE, focus: "47% 49%", zoom: [1.04, 1.08] },
    { src: p.photoCoffee, from: 72, to: 166 + FADE, focus: "60% 38%", zoom: [1.14, 1.24] },
    { src: p.photo, from: 162, to: 272 + FADE, focus: "47% 49%", zoom: [1.08, 1.7], eased: true },
    { src: p.photoSmile, from: 268, to: 362 + FADE, focus: "50% 24%", zoom: [1.5, 1.62], portrait: true, mask: "50% 40%" },
    { src: p.photoGlasses, from: 358, to: CTA, focus: "50% 44%", zoom: [1.22, 1.32] },
  ];
  return (
    <AbsoluteFill style={{ background: "black" }}>
      {p.selfieVideo ? (
        <AbsoluteFill style={{ transform: `scale(${interpolate(frame, [0, CTA], [1.02, 1.1])})` }}>
          <OffthreadVideo src={staticFile(p.selfieVideo)} muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </AbsoluteFill>
      ) : (
        shots.map((s) => <ShotView key={`${s.src}-${s.from}`} shot={s} />)
      )}
      {/* warm, slightly darker grade when it gets real */}
      <AbsoluteFill style={{ background: "radial-gradient(70% 55% at 50% 45%, transparent 40%, rgba(20,10,40,0.6) 100%)", opacity: 0.5 + care * 0.3 }} />
      {/* soft bottom shade so captions and the ticker read */}
      <AbsoluteFill style={{ background: "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.55) 100%)" }} />
    </AbsoluteFill>
  );
};

const LogoPop: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 12 } });
  return (
    <div
      style={{
        position: "absolute",
        top: 170,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        transform: `translateY(${interpolate(s, [0, 1], [-200, 0])}px)`,
        opacity: s,
      }}
    >
      <div style={{ background: "white", borderRadius: 28, padding: "22px 34px", boxShadow: "0 18px 50px rgba(0,0,0,0.35)" }}>
        <Img src={staticFile("inversa-rx-optical-logo.png")} style={{ width: 560 }} />
      </div>
    </div>
  );
};

export const ItsMe: React.FC<ItsMeProps> = (props) => {
  const items = opticalTickerItems(props, [`COME SEE ME`, `I GOT YOU`, `WHEN DID YOU LAST CHECK YOUR EYES?`]);
  return (
    <AbsoluteFill style={{ background: "black", fontFamily: FONT }}>
      <Sequence durationInFrames={CTA} layout="none">
        <Selfie p={props} />
        {captions(props.name).map((c) => (
          <Caption key={c.from} c={c} />
        ))}
        <Sequence from={362} layout="none">
          <LogoPop />
        </Sequence>
        {/* the info ticker waits until after the big question, so the opening is just you talking */}
        <Sequence from={276} layout="none">
          <Ticker items={items} bottom={120} delay={0} />
        </Sequence>
      </Sequence>
      <Sequence from={CTA} durationInFrames={END - CTA}>
        <EndCard {...props} kicker="I'll take care of you myself. Come through 👓" />
      </Sequence>
      <Soundtrack id="v5" p={props} durationInFrames={END} />
    </AbsoluteFill>
  );
};

