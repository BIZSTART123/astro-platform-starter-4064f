import React from "react";
import { AbsoluteFill, Sequence, interpolate, useCurrentFrame } from "remotion";
import { FONT, clamp } from "./brand";

/**
 * A plain, personal-looking first frame. WhatsApp uses the first frame as the
 * thumbnail, so this is what people see in the chat before they tap play:
 * a casual check-in, not an ad.
 */
export const OPEN = 36; // 1.2s

export type OpenerText = { line1: string; line2: string };

const Opener: React.FC<OpenerText> = ({ line1, line2 }) => {
  const frame = useCurrentFrame();
  // holds still on frame 0 (the thumbnail), then pushes in and fades into the video
  const push = interpolate(frame, [OPEN - 12, OPEN], [1, 1.12], clamp);
  const fade = interpolate(frame, [OPEN - 10, OPEN], [1, 0], clamp);
  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT,
        background: "radial-gradient(120% 90% at 30% 20%, #3A2E5C 0%, #1B1F3B 55%, #10132A 100%)",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 80px",
        opacity: fade,
        transform: `scale(${push})`,
      }}
    >
      {/* soft "story" glow so it feels like a personal status, not a brand */}
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: 450,
          background: "radial-gradient(circle, rgba(255,170,120,0.35) 0%, transparent 70%)",
          top: 280,
          left: 300,
        }}
      />
      <div style={{ color: "white", fontWeight: 800, fontSize: 132, lineHeight: 1.08, textAlign: "center", letterSpacing: -2 }}>
        {line1}
      </div>
      <div style={{ color: "rgba(255,255,255,0.85)", fontWeight: 600, fontSize: 62, marginTop: 44, textAlign: "center" }}>
        {line2}
      </div>
    </AbsoluteFill>
  );
};

/** Wraps a video so it starts with the personal opener; everything else shifts by OPEN frames. */
export function withOpener<P extends object>(Video: React.FC<P>, text: OpenerText): React.FC<P> {
  const Wrapped: React.FC<P> = (props) => (
    <AbsoluteFill style={{ background: "#10132A" }}>
      <Sequence from={OPEN}>
        <Video {...props} />
      </Sequence>
      <Sequence durationInFrames={OPEN}>
        <Opener {...text} />
      </Sequence>
    </AbsoluteFill>
  );
  return Wrapped;
}
