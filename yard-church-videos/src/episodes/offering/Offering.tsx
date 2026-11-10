import React from "react";
import { Audio, Series, staticFile } from "remotion";
import { EndCard, TitleCard, WorldCard } from "../../ui";
import { OFFERING_THEN_FRAMES, OfferingThen } from "./ThenScene";
import { OFFERING_NOW_FRAMES, OfferingNow } from "./NowScene";

export const OFFERING_TIMELINE = {
  title: 90,
  thenCard: 50,
  then: OFFERING_THEN_FRAMES,
  nowCard: 50,
  now: OFFERING_NOW_FRAMES,
  end: 120,
};
export const OFFERING_FRAMES = Object.values(OFFERING_TIMELINE).reduce((a, b) => a + b, 0);

export const Offering: React.FC = () => (
  <>
    <Series>
      <Series.Sequence name="Title" durationInFrames={90}>
        <TitleCard episode={3} title="The Offering" />
      </Series.Sequence>
      <Series.Sequence name="Then card" durationInFrames={50}>
        <WorldCard world="then" place="Jamaica, 1994" />
      </Series.Sequence>
      <Series.Sequence name="Then" durationInFrames={OFFERING_THEN_FRAMES}>
        <OfferingThen />
      </Series.Sequence>
      <Series.Sequence name="Now card" durationInFrames={50}>
        <WorldCard world="now" place="Somewhere in Foreign, 2026" />
      </Series.Sequence>
      <Series.Sequence name="Now" durationInFrames={OFFERING_NOW_FRAMES}>
        <OfferingNow />
      </Series.Sequence>
      <Series.Sequence name="End" durationInFrames={120}>
        <EndCard episode={3} />
      </Series.Sequence>
    </Series>
    <Audio src={staticFile("audio/offering.wav")} />
  </>
);
