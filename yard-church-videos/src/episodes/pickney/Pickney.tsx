import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Junior, MotherBrown, Person } from "../../characters";
import { KidsDoorFrame, KidsRoom, OldChurch, PewFront } from "../../sets";
import { Hymnal } from "../../props";
import { Caption } from "../../ui";
import { ramp, talking } from "../../anim";
import { C } from "../../theme";

export const PICKNEY_THEN_FRAMES = 450;
export const PICKNEY_NOW_FRAMES = 450;

export const PickneyThen: React.FC = () => {
  const f = useCurrentFrame();
  // Camera whips from the boy to Mother Brown and back.
  const fx = f < 300 ? ramp(f, 200, 212, 360, 850) : ramp(f, 300, 310, 850, 360);
  const zoom = f >= 212 && f < 300 ? ramp(f, 212, 260, 1.5, 1.9) : 1.5;
  const fy = 1150;
  const fidget = f < 300;
  const straight = f >= 300;
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ transformOrigin: "0 0", scale: zoom, translate: `${Math.min(0, Math.max(1080 - 1080 * zoom, 540 - fx * zoom))}px ${Math.min(0, Math.max(1920 - 1920 * zoom, 960 - fy * zoom))}px` }}>
        <OldChurch frame={f} />
        <div style={{ position: "absolute", left: 90, top: 960, width: 340, height: 595,
          rotate: fidget ? `${Math.sin(f / 4) * 6}deg` : "0deg", transformOrigin: "50% 100%" }}>
          <Junior outfit="kid" look={fidget ? Math.sin(f / 9) : 0} smile={fidget ? 0.5 : -0.2} talk={talking(f, 10, 100) + talking(f, 320, 395)}
            browL={straight ? 1 : 0} browR={straight ? 1 : 0} />
        </div>
        <div style={{ position: "absolute", left: 180, top: 1290 + (fidget ? Math.sin(f / 5) * 20 : 0), width: 170, height: 128,
          rotate: fidget ? `${Math.sin(f / 7) * 20}deg` : "0deg" }}>
          <Hymnal open={fidget ? (Math.sin(f / 6) + 1) / 2 : 0} />
        </div>
        <div style={{ position: "absolute", left: 640, top: 760, width: 420, height: 735 }}>
          <MotherBrown showFan look={f > 205 ? -1 : 0} squint={ramp(f, 225, 240, 0, 0.75)} browR={ramp(f, 225, 240, 0, 1)}
            fan={f < 205 ? Math.sin(f / 4) * 8 : 0} />
        </div>
        <PewFront />
      </AbsoluteFill>
      <Caption world="then" from={10} to={100} who="Junior, age 7" text="Church long, eeh?" />
      <Caption world="then" from={225} to={295} who="Mother Brown" text="…" />
      <Caption world="then" from={320} to={395} who="Junior" text="Yes, Mother. Sorry, Mother." />
      <Caption world="then" from={400} to={445} who="The look" text="No words needed." />
    </AbsoluteFill>
  );
};

const kids = [
  { left: 40, skin: C.skinDeep, top: "#ff6b6b", hair: "low" as const },
  { left: 330, skin: C.skinMid, top: "#ffd93d", hair: "puff" as const },
  { left: 640, skin: C.skinWarm, top: "#6bcB77", hair: "bun" as const },
];

export const PickneyNow: React.FC = () => {
  const f = useCurrentFrame();
  const peek = ramp(f, 214, 232, 600, 300);
  const sit = f >= 300;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <KidsRoom frame={f} />
      <div style={{ position: "absolute", left: 770, top: peek, width: 220, height: 385, opacity: f > 212 ? 1 : 0 }}>
        <MotherBrown outfit="coat" showFan={false} look={-1} squint={0.75} browR={1} />
      </div>
      <KidsDoorFrame />
      {/* volunteer */}
      <div style={{ position: "absolute", left: 60, top: 560, width: 360, height: 630, rotate: sit ? "0deg" : `${Math.sin(f / 6) * 4}deg`, transformOrigin: "50% 100%" }}>
        <Person skin={C.skinWarm} top="tee" topColor="#4d96ff" shirtText="RISE KIDS" hair="locs"
          smile={sit ? -0.3 : 1} browL={sit ? 1 : 0} browR={sit ? 1 : 0} look={f > 240 ? 1 : 0}
          talk={talking(f, 10, 100) + talking(f, 310, 390)} />
      </div>
      {kids.map((k, i) => (
        <React.Fragment key={i}>
          <div style={{ position: "absolute", left: k.left - 20, top: 1520, width: 340, height: 200, borderRadius: "50%",
            background: ["#c77dff", "#ff9f43", "#4d96ff"][i] }} />
          <div style={{ position: "absolute", left: k.left, top: 1060, width: 300, height: 525,
            rotate: sit ? "0deg" : `${Math.sin(f / 5 + i) * 5}deg`, transformOrigin: "50% 100%" }}>
            <Person skin={k.skin} top="tee" topColor={k.top} hair={k.hair} smile={sit ? -0.2 : 0.8}
              browL={sit ? 1 : 0} browR={sit ? 1 : 0} look={sit ? 0.6 : 0}
              talk={i === 0 ? talking(f, 110, 205) : 0} />
          </div>
          <div style={{ position: "absolute", left: k.left + 90, top: sit ? 1430 + ramp(f, 300, 312, 0, 260) : 1430, width: 120, height: 86,
            borderRadius: 10, background: "#111", border: "6px solid #333", boxShadow: "0 0 30px rgba(120,180,255,0.7)",
            opacity: sit ? ramp(f, 300, 312, 1, 0) : 1 }} />
        </React.Fragment>
      ))}
      <Caption world="now" from={10} to={100} who="Volunteer" text="Who wants MORE snacks?!" />
      <Caption world="now" from={110} to={205} who="Junior’s son, age 7" text="Today we learned Jonah got swallowed by a big fish!" />
      <Caption world="now" from={240} to={298} who="Mother Brown" text="…" />
      <Caption world="now" from={310} to={390} who="Volunteer" text="…Yes, Mother. Sorry, Mother." />
      <Caption world="now" from={395} to={445} who="The look" text="Still works in Foreign." />
    </AbsoluteFill>
  );
};
