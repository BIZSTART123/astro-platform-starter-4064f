import React from "react";
import { Composition } from "remotion";
import { BreakingNews, DURATION, FPS, defaultBreakingNewsProps } from "./BreakingNews";

// 1080x1920 vertical: fills a phone screen in WhatsApp.
export const RemotionRoot: React.FC = () => (
  <Composition
    id="BreakingNews"
    component={BreakingNews}
    width={1080}
    height={1920}
    fps={FPS}
    durationInFrames={DURATION}
    defaultProps={defaultBreakingNewsProps}
  />
);
