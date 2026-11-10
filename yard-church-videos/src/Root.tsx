import React from "react";
import { Composition, Folder } from "remotion";
import { FPS, H, W } from "./theme";
import { Offering, OFFERING_FRAMES } from "./episodes/offering/Offering";
import { OfferingThen, OFFERING_THEN_FRAMES } from "./episodes/offering/ThenScene";
import { OfferingNow, OFFERING_NOW_FRAMES } from "./episodes/offering/NowScene";

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="Ep03-Scenes">
      <Composition id="Ep03-Then" component={OfferingThen} width={W} height={H} fps={FPS} durationInFrames={OFFERING_THEN_FRAMES} />
      <Composition id="Ep03-Now" component={OfferingNow} width={W} height={H} fps={FPS} durationInFrames={OFFERING_NOW_FRAMES} />
    </Folder>
    <Composition id="Ep03-TheOffering" component={Offering} width={W} height={H} fps={FPS} durationInFrames={OFFERING_FRAMES} />
  </>
);
