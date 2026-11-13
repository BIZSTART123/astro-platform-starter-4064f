import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Junior, MotherBrown, Person, Silhouette } from "../../characters";
import { Churchyard, Lobby, LobbyCounter, YardTable } from "../../sets";
import { DutchPot, PaperCup, Plateful } from "../../props";
import { Caption } from "../../ui";
import { ramp, talking } from "../../anim";
import { C } from "../../theme";

export const AFTER_THEN_FRAMES = 450;
export const AFTER_NOW_FRAMES = 450;

export const AfterChurchThen: React.FC = () => {
  const f = useCurrentFrame();
  const plate = 1 + ramp(f, 232, 250, 0, 0.45);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Churchyard frame={f} />
      <div style={{ position: "absolute", left: 90, top: 740, width: 440, height: 770, rotate: `${Math.sin(f / 12) * 2}deg`, transformOrigin: "50% 100%" }}>
        <MotherBrown showFan={false} smile={0.9} look={f > 110 ? 1 : 0} squint={f > 225 && f < 320 ? 0.4 : 0}
          talk={talking(f, 10, 105) + talking(f, 225, 315)} />
      </div>
      <div style={{ position: "absolute", left: 600, top: 800, width: 400, height: 700 }}>
        <Junior outfit="sunday" look={-0.8} smile={f > 250 ? 1 : 0.4} talk={talking(f, 115, 215)} />
      </div>
      <YardTable frame={f} />
      <div style={{ position: "absolute", left: 640, top: 1250, width: 280, height: 130, scale: plate, transformOrigin: "50% 100%" }}>
        <Plateful />
      </div>
      <Caption world="then" from={10} to={105} who="Mother Brown" text="Come, come! Everybody tek a plate." />
      <Caption world="then" from={115} to={215} who="Junior" text="Mother, mi can get one more piece a chicken?" />
      <Caption world="then" from={225} to={315} who="Mother Brown" text="Tek two. Yuh too maaga." />
      <Caption world="then" from={330} to={445} who="Church yard, 3pm" text="Nobody in a hurry to go home." />
    </AbsoluteFill>
  );
};

const leavers = [0, 1, 2];

export const AfterChurchNow: React.FC = () => {
  const f = useCurrentFrame();
  const mbX = ramp(f, 212, 246, -420, 20);
  const back = ramp(f, 345, 395, 0, 1);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <Lobby frame={f} />
      {leavers.map((i) => {
        const out = ramp(f, 20 + i * 40, 160 + i * 40, 0, 1);
        const x = 380 - out * 300 + back * (220 + i * 60);
        return (
          <div key={i} style={{ position: "absolute", left: x + i * 40, top: 860 + i * 30, width: 220, height: 290,
            opacity: 1 - out * 0.85 + back * 0.85 }}>
            <Silhouette color="#4b535b" variant={i} />
          </div>
        );
      })}
      <div style={{ position: "absolute", left: 690, top: 820, width: 340, height: 595 }}>
        <Person skin={C.skinMid} top="tee" topColor="#2b2f33" hair="bun" smile={f > 345 ? 0.8 : 0.2} talk={talking(f, 10, 100)}
          look={f > 250 ? -1 : 0} />
      </div>
      <LobbyCounter />
      <div style={{ position: "absolute", left: 330, top: 900, width: 400, height: 700 }}>
        <Junior outfit="hoodie" look={f > 240 ? -1 : 0.6} browL={f > 105 && f < 205 ? 1 : 0} browR={f > 105 && f < 205 ? 1 : 0}
          smile={f > 345 ? 1 : f > 105 ? -0.4 : 0} talk={talking(f, 110, 200)} />
      </div>
      {f > 100 && (
        <div style={{ position: "absolute", left: 600, top: 1260, width: 90, height: 120 }}>
          <PaperCup />
        </div>
      )}
      <div style={{ position: "absolute", left: mbX, top: 880, width: 380, height: 665 }}>
        <MotherBrown outfit="coat" showFan={false} smile={0.8} talk={talking(f, 250, 335)} />
      </div>
      <div style={{ position: "absolute", left: mbX + 60, top: 1330, width: 300, height: 260 }}>
        <DutchPot steam={f / 20} />
      </div>
      <Caption world="now" from={10} to={100} who="Barista" text="That’ll be six-fifty." />
      <Caption world="now" from={110} to={200} who="Junior" text="…For COFFEE?" />
      <Caption world="now" from={250} to={335} who="Mother Brown" text="Mi bring rice and peas and chicken." />
      <Caption world="now" from={345} to={445} who="Lobby, 12:15" text="Suddenly nobody in a hurry." />
    </AbsoluteFill>
  );
};
