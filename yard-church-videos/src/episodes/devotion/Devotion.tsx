import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Hands, Junior, MotherBrown, Person, Silhouette } from "../../characters";
import { Auditorium, OldChurch, PewFront, Platform } from "../../sets";
import { DrumKit, Tambourine } from "../../props";
import { Caption } from "../../ui";
import { ramp, talking } from "../../anim";
import { C, inter } from "../../theme";

export const DEVOTION_THEN_FRAMES = 450;
export const DEVOTION_NOW_FRAMES = 450;

const beat = (f: number, speed = 0.55) => Math.pow((Math.sin(f * speed) + 1) / 2, 3);

export const DevotionThen: React.FC = () => {
  const f = useCurrentFrame();
  if (f < 200) {
    // Shot A: Sister Pearl leads from the front, drummer beside her.
    return (
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <OldChurch frame={f} />
        <div style={{ position: "absolute", left: 120, top: 640, width: 460, height: 805, rotate: `${Math.sin(f / 8) * 4}deg`, transformOrigin: "50% 100%" }}>
          <Person skin={C.skinWarm} top="dress" topColor={C.white} hair="wrap" hairColor="#b3261e" squint={0.9} smile={0.6}
            talk={talking(f, 10, 95) + talking(f, 105, 195)} />
        </div>
        <div style={{ position: "absolute", left: 120, top: 830, width: 460, height: 575 }}>
          <Hands skin={C.skinWarm} up={0.8} sleeve={C.white} />
        </div>
        <div style={{ position: "absolute", left: 445, top: 770, width: 170, height: 170, rotate: `${Math.sin(f * 1.2) * 18}deg` }}>
          <Tambourine />
        </div>
        <div style={{ position: "absolute", left: 650, top: 1000, width: 360, height: 630 }}>
          <Person skin={C.skinDeep} top="tee" topColor="#1f2433" hair="locs" squint={0.5} smile={0.4} />
        </div>
        <div style={{ position: "absolute", left: 600, top: 1230, width: 450, height: 320, translate: `0 ${beat(f, 1.1) * 6}px` }}>
          <DrumKit hit={beat(f, 1.1)} />
        </div>
        <Platform />
        <Caption world="then" from={10} to={95} who="Sister Pearl" text="Everybody stand up! Lift Him up!" />
        <Caption world="then" from={105} to={195} who="Sister Pearl · 45 minutes later" text="One more time!!" />
      </AbsoluteFill>
    );
  }
  // Shot B: the pew, clapping. Junior is running out of steam.
  const jrClap = f < 300 ? beat(f) : beat(f) * ramp(f, 300, 330, 1, 0.25);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <OldChurch frame={f} />
      <div style={{ position: "absolute", left: 30, top: 760, width: 420, height: 735, rotate: `${Math.sin(f / 7) * 3}deg`, transformOrigin: "50% 100%" }}>
        <MotherBrown showFan={false} smile={0.8} squint={0.3} look={f > 300 ? 1 : 0}
          talk={talking(f, 210, 290) + talking(f, 378, 445)} />
      </div>
      <div style={{ position: "absolute", left: 470, top: 800, width: 400, height: 700 }}>
        <Junior outfit="sunday" look={f > 290 && f < 375 ? -0.6 : 0} smile={f > 300 ? -0.4 : 0.2} squint={f > 300 ? 0.4 : 0}
          talk={talking(f, 300, 370)} />
      </div>
      {f > 290 && (
        <svg style={{ position: "absolute", left: 760, top: 900 + ((f - 290) % 30) * 3, width: 30, height: 44 }} viewBox="0 0 30 44">
          <path d="M 15 0 Q 30 26 15 44 Q 0 26 15 0 Z" fill="#7cc6f0" />
        </svg>
      )}
      <div style={{ position: "absolute", left: 40, top: 900, width: 400, height: 500 }}>
        <Hands skin={C.skinMid} clap={beat(f)} sleeve={C.white} />
      </div>
      <div style={{ position: "absolute", left: 470, top: 930, width: 400, height: 500 }}>
        <Hands skin={C.skinDeep} clap={jrClap} sleeve="#fff" />
      </div>
      <PewFront />
      <Caption world="then" from={210} to={290} who="Mother Brown" text="Hallelujah! Clap yuh hand, Junior!" />
      <Caption world="then" from={300} to={370} who="Junior" text="Mother, mi hand dem tired." />
      <Caption world="then" from={378} to={445} who="Mother Brown" text="Tired? Jesus nuh tired!" />
    </AbsoluteFill>
  );
};

const lyrics = ["You are good", "You are here", "You are good", "You are here"];

export const DevotionNow: React.FC = () => {
  const f = useCurrentFrame();
  const tamb = ramp(f, 210, 232, 0, 1);
  const shaking = f > 232 && f < 338;
  const line = lyrics[Math.min(lyrics.length - 1, Math.floor(f / 90))];
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: C.nowBg }}>
      <Auditorium frame={f}>
        <div style={{ position: "absolute", left: 80, top: 180, width: 920, height: 600, borderRadius: 10, overflow: "hidden",
          background: "linear-gradient(180deg, #2a2378, #120f33)", display: "flex", justifyContent: "center", paddingTop: 110 }}>
          <div style={{ fontFamily: inter, fontWeight: 700, fontSize: 96, color: "#fff", opacity: f > 338 ? 0.3 : 1 }}>{line}</div>
        </div>
        {/* band on stage */}
        <div style={{ position: "absolute", left: 130, top: 560, width: 210, height: 368 }}>
          <Person skin={C.skinDeep} top="tee" topColor="#111" hair="locs" inEar squint={0.6} />
        </div>
        <div style={{ position: "absolute", left: 740, top: 560, width: 210, height: 368 }}>
          <Person skin={C.skinWarm} top="tee" topColor="#111" hair="low" beard inEar squint={0.6} />
        </div>
        <div style={{ position: "absolute", left: 430, top: 530, width: 230, height: 403 }}>
          <Person skin={C.skinMid} top="tee" topColor="#111" hair="puff" inEar look={f > 338 ? -1 : 0}
            browL={f > 338 ? 1 : 0} browR={f > 338 ? 1 : 0} squint={f < 338 ? 0.7 : 0}
            talk={talking(f, 10, 95) + talking(f, 342, 445)} />
        </div>
        {[40, 250, 670, 880].map((x, i) => (
          <div key={x} style={{ position: "absolute", left: x, top: 960, width: 170, height: 220 }}>
            <Silhouette color="#1a1838" variant={i} />
          </div>
        ))}
        <div style={{ position: "absolute", left: 40, top: 960, width: 380, height: 665, rotate: shaking ? `${Math.sin(f * 0.9) * 5}deg` : "0deg", transformOrigin: "50% 100%" }}>
          <MotherBrown outfit="coat" showFan={false} smile={shaking ? 0.9 : 0} squint={shaking ? 0.6 : 0}
            talk={talking(f, 240, 330)} />
        </div>
        <div style={{ position: "absolute", left: 330, top: 1000, width: 420, height: 735 }}>
          <Junior outfit="hoodie" look={f > 236 ? -1 : 0} browL={f > 236 ? 1 : 0} browR={f > 236 ? 1 : 0} smile={f > 236 ? -0.5 : 0} />
        </div>
        <div style={{ position: "absolute", left: 820, top: 1180, width: 320, height: 420 }}>
          <Silhouette color="#0b0a1a" variant={2} />
        </div>
        <div style={{ position: "absolute", left: -20, right: -20, top: 1560, height: 400, background: "#08070f", borderTop: "6px solid #1f1c4a" }} />
        <div style={{ position: "absolute", left: 150, top: 1700 - tamb * 820, width: 190, height: 190, opacity: tamb > 0 ? 1 : 0,
          rotate: shaking ? `${Math.sin(f * 1.4) * 22}deg` : "0deg" }}>
          <Tambourine />
        </div>
      </Auditorium>
      <Caption world="now" from={10} to={95} who="Worship leader" text="Let’s just stand for this one." />
      <Caption world="now" from={105} to={200} who="4 minutes later" text="Song ends exactly on time." />
      <Caption world="now" from={240} to={330} who="Mother Brown" text="Somebody haffi wake up dis church!" />
      <Caption world="now" from={342} to={445} who="Worship leader" text="Ma’am… the tambourine is not on the click track." />
    </AbsoluteFill>
  );
};
