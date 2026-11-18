import React from "react";
import { Composition } from "remotion";
import { FPS } from "./brand";
import { BREAKING_NEWS_DURATION, BreakingNews, defaultBreakingNewsProps } from "./BreakingNews";
import { CONCERNED_DURATION, Concerned, defaultConcernedProps } from "./Concerned";
import { EYECHART_DURATION, EyeChart, defaultEyeChartProps } from "./EyeChart";

// All 1080x1920 vertical: fills a phone screen in WhatsApp.
export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="V1-BreakingNews"
      component={BreakingNews}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={BREAKING_NEWS_DURATION}
      defaultProps={defaultBreakingNewsProps}
    />
    <Composition
      id="V2-ConcernedFriend"
      component={Concerned}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={CONCERNED_DURATION}
      defaultProps={defaultConcernedProps}
    />
    <Composition
      id="V3-EyeChart"
      component={EyeChart}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={EYECHART_DURATION}
      defaultProps={defaultEyeChartProps}
    />
  </>
);
