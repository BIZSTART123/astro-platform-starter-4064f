import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Hands, Junior, MotherBrown, PastorJordan, Person, Silhouette } from "../../characters";
import { Auditorium, OldChurch, PewFront } from "../../sets";
import { Clock, Hanky } from "../../props";
import { Caption } from "../../ui";
import { ramp, talking } from "../../anim";
import { C, inter } from "../../theme";

export const TESTIMONY_THEN_FRAMES = 450;
export const TESTIMONY_NOW_FRAMES = 450;

export const TestimonyThen: React.FC = () => {
  const f = useCurrentFrame();
  const bcTalk = talking(f, 10, 120) + talking(f, 125, 225) + talking(f, 325, 445);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <OldChurch frame={f} />
      <div style={{ position: "absolute", left: 870, top: 110, width: 150, height: 150 }}>
        <Clock minutes={665 + f * 0.16} />
      </div>
      {/* Brother Campbell stands to testify */}
      <div style={{ position: "absolute", left: 300, top: 600, width: 480, height: 840, rotate: `${Math.sin(f / 14) * 2}deg`, transformOrigin: "50% 100%" }}>
        <Person skin={C.skinWarm} top="suit" topColor="#6b4423" tie="#b3261e" hair="grey" beard glasses
          squint={f > 325 ? 0.5 : 0.2} smile={f > 325 ? 0.6 : 0} talk={bcTalk} />
      </div>
      {f > 325 && (
        <div style={{ position: "absolute", left: 300, top: 820, width: 480, height: 600 }}>
          <Hands skin={C.skinWarm} up={ramp(f, 325, 340, 0.2, 0.9)} clap={0.2} sleeve="#6b4423" />
        </div>
      )}
      <div style={{ position: "absolute", left: -60, top: 900, width: 360, height: 630 }}>
        <MotherBrown showFan={f < 325} fan={Math.sin(f / 4) * 8} look={1} smile={f > 330 ? 0.9 : 0.2} />
      </div>
      {f > 330 && (
        <div style={{ position: "absolute", left: 40, top: 860 + Math.sin(f / 3) * 30, width: 130, height: 130, rotate: `${Math.sin(f / 3) * 25}deg` }}>
          <Hanky />
        </div>
      )}
      <div style={{ position: "absolute", left: 770, top: 930, width: 330, height: 578 }}>
        <Junior outfit="sunday" look={f > 228 && f < 322 ? 0.4 : -1} browL={f > 228 && f < 322 ? 0.6 : 0}
          squint={f > 228 && f < 322 ? 0.5 : 0} talk={talking(f, 235, 320)} />
      </div>
      <PewFront />
      <Caption world="then" from={10} to={120} who="Brother Campbell" text="Giving honour to God, who is the head of my life…" />
      <Caption world="then" from={125} to={225} who="Brother Campbell" text="…to Pastor, First Lady, Deacons, Mothers, Saints and friends…" />
      <Caption world="then" from={235} to={320} who="Junior" text="Him still nuh start yet, and it’s 11:40." />
      <Caption world="then" from={325} to={445} who="Brother Campbell" text="…and I thank Him, because Tuesday mi nearly dead!" />
    </AbsoluteFill>
  );
};

export const TestimonyNow: React.FC = () => {
  const f = useCurrentFrame();
  const videoOut = ramp(f, 112, 124, 1, 0);
  const pastorIn = ramp(f, 118, 132, 0, 1);
  const mbY = ramp(f, 212, 228, 1500, 880);
  const cover = ramp(f, 345, 356, 0, 1);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: C.nowBg }}>
      <Auditorium frame={f}>
        <div style={{ position: "absolute", left: 80, top: 180, width: 920, height: 600, borderRadius: 10, overflow: "hidden",
          background: "linear-gradient(180deg, #2a2378, #120f33)" }}>
          <div style={{ position: "absolute", inset: 0, opacity: videoOut, background: "linear-gradient(180deg, #e9d7c6, #b99a86)" }}>
            <div style={{ position: "absolute", left: 300, top: 60, width: 320, height: 560 }}>
              <Person skin={C.skinMid} top="tee" topColor="#d9a5b3" hair="puff" smile={0.5} talk={talking(f, 10, 110)} />
            </div>
            <div style={{ position: "absolute", left: 40, bottom: 40, background: "rgba(0,0,0,0.65)", color: "#fff",
              fontFamily: inter, fontWeight: 700, fontSize: 40, padding: "12px 24px", borderRadius: 8 }}>Danielle’s Story</div>
          </div>
          <div style={{ position: "absolute", inset: 0, opacity: 1 - videoOut, display: "flex", alignItems: "flex-start",
            justifyContent: "center", paddingTop: 70, fontFamily: inter, fontWeight: 700, fontSize: 64, color: "#fff", letterSpacing: 8 }}>
            RISE CITY CHURCH
          </div>
        </div>
        <div style={{ position: "absolute", left: 400, top: 520, width: 280, height: 420, opacity: pastorIn }}>
          <PastorJordan talk={talking(f, 132, 205) + talking(f, 340, 445)} arms={f < 210 ? 0.4 : 0} />
        </div>
        {[40, 250, 460, 670, 880].map((x, i) => (
          <div key={x} style={{ position: "absolute", left: x, top: 960, width: 170, height: 220 }}>
            <Silhouette color="#1a1838" variant={i} />
          </div>
        ))}
        <div style={{ position: "absolute", left: 40, top: mbY, width: 380, height: 665 }}>
          <MotherBrown outfit="coat" showFan={false} smile={0.4} squint={0.3} talk={talking(f, 235, 330)} />
        </div>
        <div style={{ position: "absolute", left: 330, top: 1000, width: 420, height: 735 }}>
          <Junior outfit="hoodie" look={f > 228 ? -1 : 0} squint={f > 300 ? 0.6 : 0} smile={f > 228 ? -0.4 : 0} />
        </div>
        <div style={{ position: "absolute", left: 330, top: 1174 + (1 - cover) * 500, width: 420, height: 525, opacity: cover }}>
          <Hands skin={C.skinDeep} up={0.5} clap={1} sleeve="#6f7782" />
        </div>
        <div style={{ position: "absolute", left: 820, top: 1180, width: 320, height: 420 }}>
          <Silhouette color="#0b0a1a" variant={1} />
        </div>
        <div style={{ position: "absolute", left: -20, right: -20, top: 1560, height: 400, background: "#08070f", borderTop: "6px solid #1f1c4a" }} />
      </Auditorium>
      <Caption world="now" from={10} to={110} who="On screen" text="…and that’s when I found community." />
      <Caption world="now" from={132} to={205} who="Pastor Jordan" text="Wow. Let’s give it up for Danielle!" />
      <Caption world="now" from={235} to={330} who="Mother Brown" text="Giving honour to God, who is the head of my life…" />
      <Caption world="now" from={340} to={445} who="Pastor Jordan" text="Mother… we have a hard stop at 11:15." />
    </AbsoluteFill>
  );
};
