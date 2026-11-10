import React from "react";
import { Composition, Folder } from "remotion";
import { FPS, H, W } from "./theme";
import { EPISODES } from "./episodes";

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="Scenes">
      {EPISODES.flatMap((e) => [
        <Composition key={`${e.id}-Then`} id={`${e.id}-Then`} component={e.Then} width={W} height={H} fps={FPS} durationInFrames={e.thenFrames} />,
        <Composition key={`${e.id}-Now`} id={`${e.id}-Now`} component={e.Now} width={W} height={H} fps={FPS} durationInFrames={e.nowFrames} />,
      ])}
    </Folder>
    {EPISODES.map((e) => (
      <Composition key={e.id} id={e.id} component={e.Component} width={W} height={H} fps={FPS} durationInFrames={e.frames} />
    ))}
  </>
);
