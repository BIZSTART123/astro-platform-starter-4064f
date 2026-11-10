import React from "react";
import { Audio, Series, staticFile } from "remotion";
import { EndCard, TitleCard, WorldCard } from "./ui";

export const TITLE = 90;
export const CARD = 50;
export const END = 120;

/** Total frames for an episode with the standard title, cards and end card. */
export const episodeFrames = (thenFrames: number, nowFrames: number) =>
  TITLE + CARD + thenFrames + CARD + nowFrames + END;

/** Every episode has the same shape: title, Then, Now, vote card. */
export const EpisodeShell: React.FC<{
  number: number;
  title: string;
  thenPlace?: string;
  nowPlace?: string;
  Then: React.FC;
  thenFrames: number;
  Now: React.FC;
  nowFrames: number;
  audio: string;
}> = ({ number, title, thenPlace = "Jamaica, 1994", nowPlace = "Somewhere in Foreign, 2026", Then, thenFrames, Now, nowFrames, audio }) => (
  <>
    <Series>
      <Series.Sequence name="Title" durationInFrames={TITLE}>
        <TitleCard episode={number} title={title} />
      </Series.Sequence>
      <Series.Sequence name="Then card" durationInFrames={CARD}>
        <WorldCard world="then" place={thenPlace} />
      </Series.Sequence>
      <Series.Sequence name="Then" durationInFrames={thenFrames}>
        <Then />
      </Series.Sequence>
      <Series.Sequence name="Now card" durationInFrames={CARD}>
        <WorldCard world="now" place={nowPlace} />
      </Series.Sequence>
      <Series.Sequence name="Now" durationInFrames={nowFrames}>
        <Now />
      </Series.Sequence>
      <Series.Sequence name="End" durationInFrames={END}>
        <EndCard episode={number} />
      </Series.Sequence>
    </Series>
    <Audio src={staticFile(audio)} />
  </>
);
