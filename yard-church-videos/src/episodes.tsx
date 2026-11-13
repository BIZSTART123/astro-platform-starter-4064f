import { EpisodeShell, episodeFrames } from "./EpisodeShell";
import { TikTokCut, tiktokFrames } from "./TikTokCut";
import { DEVOTION_NOW_FRAMES, DEVOTION_THEN_FRAMES, DevotionNow, DevotionThen } from "./episodes/devotion/Devotion";
import { TESTIMONY_NOW_FRAMES, TESTIMONY_THEN_FRAMES, TestimonyNow, TestimonyThen } from "./episodes/testimony/Testimony";
import { OFFERING_THEN_FRAMES, OfferingThen } from "./episodes/offering/ThenScene";
import { OFFERING_NOW_FRAMES, OfferingNow } from "./episodes/offering/NowScene";
import { SPIRIT_NOW_FRAMES, SPIRIT_THEN_FRAMES, SpiritNow, SpiritThen } from "./episodes/spirit/Spirit";
import { PICKNEY_NOW_FRAMES, PICKNEY_THEN_FRAMES, PickneyNow, PickneyThen } from "./episodes/pickney/Pickney";
import { AFTER_NOW_FRAMES, AFTER_THEN_FRAMES, AfterChurchNow, AfterChurchThen } from "./episodes/afterchurch/AfterChurch";

/** Hook text and the Now-scene frame the TikTok cut opens on. */
const TIKTOK: Record<number, { hook: string; hookFrom: number; next?: string }> = {
  1: { hook: "POV: Mother Brown visits your new church", hookFrom: 232, next: "Testimony Service" },
  2: { hook: "Jamaican testimony service hits different", hookFrom: 335, next: "The Offering" },
  3: { hook: "Jamaican church mothers see EVERYTHING", hookFrom: 318, next: "Getting the Spirit" },
  4: { hook: "When the Spirit hits in a modern church", hookFrom: 222, next: "Pickney Behaviour" },
  5: { hook: "The look still works in Foreign", hookFrom: 296, next: "After Church" },
};

/** All six episodes. `id` is the Remotion composition id and `audio` the soundtrack file. */
export const EPISODES = [
  { number: 1, id: "Ep01-Devotion", title: "Devotion", audio: "devotion", Then: DevotionThen, thenFrames: DEVOTION_THEN_FRAMES, Now: DevotionNow, nowFrames: DEVOTION_NOW_FRAMES },
  { number: 2, id: "Ep02-TestimonyService", title: "Testimony Service", audio: "testimony", Then: TestimonyThen, thenFrames: TESTIMONY_THEN_FRAMES, Now: TestimonyNow, nowFrames: TESTIMONY_NOW_FRAMES },
  { number: 3, id: "Ep03-TheOffering", title: "The Offering", audio: "offering", Then: OfferingThen, thenFrames: OFFERING_THEN_FRAMES, Now: OfferingNow, nowFrames: OFFERING_NOW_FRAMES },
  { number: 4, id: "Ep04-GettingTheSpirit", title: "Getting the Spirit", audio: "spirit", Then: SpiritThen, thenFrames: SPIRIT_THEN_FRAMES, Now: SpiritNow, nowFrames: SPIRIT_NOW_FRAMES },
  { number: 5, id: "Ep05-PickneyBehaviour", title: "Pickney Behaviour", audio: "pickney", Then: PickneyThen, thenFrames: PICKNEY_THEN_FRAMES, Now: PickneyNow, nowFrames: PICKNEY_NOW_FRAMES },
  { number: 6, id: "Ep06-AfterChurch", title: "After Church", audio: "afterchurch", Then: AfterChurchThen, thenFrames: AFTER_THEN_FRAMES, Now: AfterChurchNow, nowFrames: AFTER_NOW_FRAMES },
].map((e) => ({
  tiktok: TIKTOK[e.number],
  ...e,
  frames: episodeFrames(e.thenFrames, e.nowFrames),
  tiktokFramesTotal: tiktokFrames(e.thenFrames, e.nowFrames),
  TikTok: () => {
    const t = TIKTOK[e.number];
    return t ? (
      <TikTokCut number={e.number} title={e.title} hook={t.hook} hookFrom={t.hookFrom} next={t.next} Then={e.Then}
        thenFrames={e.thenFrames} Now={e.Now} nowFrames={e.nowFrames} audio={`audio/${e.audio}.wav`} />
    ) : null;
  },
  Component: () => (
    <EpisodeShell number={e.number} title={e.title} Then={e.Then} thenFrames={e.thenFrames} Now={e.Now} nowFrames={e.nowFrames}
      audio={`audio/${e.audio}.wav`} />
  ),
}));
