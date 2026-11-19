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
  /** Your photo in public/. */
  photo: string;
  /**
   * Optional: a real selfie video or a Runway clip in public/ (e.g. "me-runway.mp4").
   * When set, it plays instead of the still photo.
   */
  selfieVideo: string;
};

// Jingle 1 from 0.7s: "when's the last time you really checked your eyes" (6.5s in the song)
// lands on the matching caption, and "come down White Plains Road" on "come see me".
export const defaultItsMeProps: ItsMeProps = {
  ...withJingle(0.7),
  photo: "me-selfie.jpg",
  selfieVideo: "",
};

type Cap = { from: number; to: number; text: React.ReactNode; accent?: boolean };
const CAPTIONS: Cap[] = [
  { from: -14, to: 72, text: <>Hey… it's me 👋</> }, // visible on frame 0 = WhatsApp thumbnail
  { from: 76, to: 160, text: <>Real quick…<br />I gotta ask you something</> },
  {
    from: 166,
    to: 268,
    accent: true,
    text: (
      <>
        When's the last time you <span style={{ color: GREEN }}>REALLY</span> checked your eyes? 👀
      </>
    ),
  },
  { from: 272, to: 358, text: <>I'm not playing…<br />I'm concerned about you ❤️</> },
  { from: 362, to: 438, text: <>Come see me at<br /><span style={{ color: "#7CC4FF" }}>Inversa Rx Optical</span> 👓</> },
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

const Selfie: React.FC<{ photo: string; selfieVideo: string }> = ({ photo, selfieVideo }) => {
  const frame = useCurrentFrame();
  // Slow handheld drift, then a push toward the eyes on the big question.
  const drift = Math.sin(frame / 40) * 6;
  const eyes = interpolate(frame, [166, 210, 262, 290], [0, 1, 1, 0], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const scale = interpolate(frame, [0, CTA], [1.04, 1.12]) + eyes * 0.55;
  const care = interpolate(frame, [272, 300, 352, 362], [0, 1, 1, 0], clamp);
  const media: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover" };
  return (
    <AbsoluteFill style={{ background: "black" }}>
      <AbsoluteFill
        style={{
          transformOrigin: "47% 49%", // between the eyes
          transform: `translate(${drift}px, ${drift * 0.6}px) scale(${scale})`,
        }}
      >
        {selfieVideo ? (
          <OffthreadVideo src={staticFile(selfieVideo)} muted style={media} />
        ) : (
          <Img src={staticFile(photo)} style={media} />
        )}
      </AbsoluteFill>
      {/* warm, slightly darker grade when it gets real */}
      <AbsoluteFill style={{ background: "radial-gradient(70% 55% at 50% 45%, transparent 40%, rgba(20,10,40,0.6) 100%)", opacity: 0.6 + care * 0.4 }} />
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
  const items = opticalTickerItems(props, [`IT'S ME, CHECKING ON YOU`, `WHEN DID YOU LAST CHECK YOUR EYES?`, `COME SEE ME`]);
  return (
    <AbsoluteFill style={{ background: "black", fontFamily: FONT }}>
      <Sequence durationInFrames={CTA} layout="none">
        <Selfie photo={props.photo} selfieVideo={props.selfieVideo} />
        {CAPTIONS.map((c) => (
          <Caption key={c.from} c={c} />
        ))}
        <Sequence from={362} layout="none">
          <LogoPop />
        </Sequence>
        {/* kept off the first frames so the WhatsApp thumbnail is just you */}
        <Sequence from={24} layout="none">
          <Ticker items={items} bottom={120} delay={0} />
        </Sequence>
      </Sequence>
      <Sequence from={CTA} durationInFrames={END - CTA}>
        <EndCard {...props} kicker="I'll take care of you. Come through 👓" />
      </Sequence>
      <Soundtrack id="v5" p={props} durationInFrames={END} />
    </AbsoluteFill>
  );
};

