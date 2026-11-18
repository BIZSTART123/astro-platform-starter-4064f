import React from "react";
import { Composition } from "remotion";
import { FPS } from "./brand";
import { BREAKING_NEWS_DURATION, BreakingNews, defaultBreakingNewsProps } from "./BreakingNews";
import { CONCERNED_DURATION, Concerned, defaultConcernedProps } from "./Concerned";
import { EYECHART_DURATION, EyeChart, defaultEyeChartProps } from "./EyeChart";
import { GROUPCHAT_DURATION, GroupChat, defaultGroupChatProps } from "./GroupChat";
import { OPEN, withOpener } from "./Opener";

// Each video opens on a personal check-in frame, which WhatsApp shows as the thumbnail.
const V1 = withOpener(BreakingNews, { line1: "hey… you good? 👀", line2: "been meaning to check on you" });
const V2 = withOpener(Concerned, { line1: "hey stranger 👋", line2: "real quick… watch this" });
const V3 = withOpener(EyeChart, { line1: "ok be honest with me 😅", line2: "can you read this?" });
const V4 = withOpener(GroupChat, { line1: "bro… 💀", line2: "the boys need to talk" });

// All 1080x1920 vertical: fills a phone screen in WhatsApp.
export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="V1-BreakingNews"
      component={V1}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={OPEN + BREAKING_NEWS_DURATION}
      defaultProps={defaultBreakingNewsProps}
    />
    <Composition
      id="V2-ConcernedFriend"
      component={V2}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={OPEN + CONCERNED_DURATION}
      defaultProps={defaultConcernedProps}
    />
    <Composition
      id="V3-EyeChart"
      component={V3}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={OPEN + EYECHART_DURATION}
      defaultProps={defaultEyeChartProps}
    />
    <Composition
      id="V4-TheBoys"
      component={V4}
      width={1080}
      height={1920}
      fps={FPS}
      durationInFrames={OPEN + GROUPCHAT_DURATION}
      defaultProps={defaultGroupChatProps}
    />
  </>
);
