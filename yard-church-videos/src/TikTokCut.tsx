import React from "react";
import { AbsoluteFill, Audio, Easing, interpolate, Sequence, Series, staticFile, useCurrentFrame } from "remotion";
import { CARD, END, TITLE } from "./EpisodeShell";
import { CaptionLayout, EndCard, TitleCard, WorldCard } from "./ui";
import { C, clamp, slab, work } from "./theme";

/** TikTok timings: hook first, then a fast title and short cards. */
export const HOOK = 75;
const T_TITLE = 45;
const T_CARD = 30;
const T_END = 90;

export const tiktokFrames = (thenFrames: number, nowFrames: number) =>
  HOOK + T_TITLE + T_CARD + thenFrames + T_CARD + nowFrames + T_END;

const HookText: React.FC<{ text: string }> = ({ text }) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, 8], [1.25, 1], { ...clamp, easing: Easing.bezier(0.2, 1.4, 0.4, 1) });
  return (
    <div style={{ position: "absolute", left: 70, right: 70, top: 170, display: "flex", justifyContent: "center", scale: s }}>
      <div style={{ fontFamily: slab, fontSize: 86, lineHeight: 1.08, color: "#fff", textAlign: "center",
        background: C.mahogany, padding: "26px 34px", borderRadius: 26, boxShadow: "0 10px 40px rgba(0,0,0,0.45)" }}>
        {text}
      </div>
    </div>
  );
};

const NextUp: React.FC<{ next?: string }> = ({ next }) =>
  next ? (
    <div style={{ position: "absolute", left: 80, right: 160, top: 220, textAlign: "center", fontFamily: work, fontWeight: 700,
      fontSize: 48, color: C.mahogany }}>
      Next: {next}
    </div>
  ) : null;

/**
 * Re-cut of an episode for TikTok / Reels / Shorts. Opens on the punchline
 * (`hookFrom`, a frame in the Now scene) with hook text, then plays the
 * episode with shorter title, cards and end card. Audio is cut to match.
 */
export const TikTokCut: React.FC<{
  number: number;
  title: string;
  hook: string;
  hookFrom: number;
  next?: string;
  Then: React.FC;
  thenFrames: number;
  Now: React.FC;
  nowFrames: number;
  audio: string;
}> = ({ number, title, hook, hookFrom, next, Then, thenFrames, Now, nowFrames, audio }) => {
  const src = staticFile(audio);
  const then0 = TITLE + CARD;
  const now0 = then0 + thenFrames + CARD;
  const end0 = now0 + nowFrames;
  return (
    <CaptionLayout.Provider value={{ bottom: 420, right: 170 }}>
      <Series>
        <Series.Sequence name="Hook" durationInFrames={HOOK}>
          <AbsoluteFill>
            <Sequence from={-hookFrom}><Now /></Sequence>
            <HookText text={hook} />
          </AbsoluteFill>
          <Audio src={src} trimBefore={now0 + hookFrom} durationInFrames={HOOK} />
        </Series.Sequence>
        <Series.Sequence name="Title" durationInFrames={T_TITLE}>
          <TitleCard episode={number} title={title} />
          <Audio src={src} trimBefore={0} durationInFrames={T_TITLE} />
        </Series.Sequence>
        <Series.Sequence name="Then card" durationInFrames={T_CARD}>
          <WorldCard world="then" place="Jamaica, 1994" />
          <Audio src={src} trimBefore={TITLE} durationInFrames={T_CARD} />
        </Series.Sequence>
        <Series.Sequence name="Then" durationInFrames={thenFrames}>
          <Then />
          <Audio src={src} trimBefore={then0} durationInFrames={thenFrames} />
        </Series.Sequence>
        <Series.Sequence name="Now card" durationInFrames={T_CARD}>
          <WorldCard world="now" place="Somewhere in Foreign, 2026" />
          <Audio src={src} trimBefore={now0 - CARD} durationInFrames={T_CARD} />
        </Series.Sequence>
        <Series.Sequence name="Now" durationInFrames={nowFrames}>
          <Now />
          <Audio src={src} trimBefore={now0} durationInFrames={nowFrames} />
        </Series.Sequence>
        <Series.Sequence name="End" durationInFrames={T_END}>
          <EndCard episode={number} />
          <NextUp next={next} />
          <Audio src={src} trimBefore={end0} durationInFrames={Math.min(END, T_END)} />
        </Series.Sequence>
      </Series>
    </CaptionLayout.Provider>
  );
};
