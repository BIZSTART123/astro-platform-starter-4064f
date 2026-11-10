import React from "react";
import { EpisodeShell, episodeFrames } from "../../EpisodeShell";
import { OFFERING_THEN_FRAMES, OfferingThen } from "./ThenScene";
import { OFFERING_NOW_FRAMES, OfferingNow } from "./NowScene";

export const OFFERING_FRAMES = episodeFrames(OFFERING_THEN_FRAMES, OFFERING_NOW_FRAMES);

export const Offering: React.FC = () => (
  <EpisodeShell number={3} title="The Offering" Then={OfferingThen} thenFrames={OFFERING_THEN_FRAMES}
    Now={OfferingNow} nowFrames={OFFERING_NOW_FRAMES} audio="audio/offering.wav" />
);
