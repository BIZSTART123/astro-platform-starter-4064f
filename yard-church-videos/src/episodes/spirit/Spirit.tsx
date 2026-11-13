import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Hands, Junior, MotherBrown, PastorJordan, Person, Silhouette, Usher } from "../../characters";
import { Auditorium, OldChurch, PewFront } from "../../sets";
import { ChurchHat } from "../../props";
import { Caption } from "../../ui";
import { ramp, talking } from "../../anim";
import { C, inter } from "../../theme";

export const SPIRIT_THEN_FRAMES = 450;
export const SPIRIT_NOW_FRAMES = 480;

export const SpiritThen: React.FC = () => {
  const f = useCurrentFrame();
  const rise = f < 268 ? ramp(f, 90, 115, 0, 1) : ramp(f, 268, 292, 1, 0);
  const shaking = f > 115 && f < 268;
  const top = 760 - rise * 230;
  const bob = shaking ? Math.abs(Math.sin(f * 0.45)) * -40 : 0;
  const hatGone = f >= 160;
  const hf = f - 160;
  const ushersIn = ramp(f, 218, 258, 0, 1);
  const sheet = ramp(f, 262, 290, 0, 1);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <OldChurch frame={f} />
      <div style={{ position: "absolute", left: -320 + ushersIn * 170, top: 520, width: 300, height: 900 }}>
        <Usher step={f > 218 && f < 258 ? f / 10 : 0} />
      </div>
      <div style={{ position: "absolute", left: 30, top: top + bob, width: 420, height: 735,
        rotate: shaking ? `${Math.sin(f * 0.8) * 6}deg` : "0deg", transformOrigin: "50% 100%" }}>
        <MotherBrown showFan={false} hat={!hatGone} squint={shaking ? 1 : 0} smile={shaking ? 0.9 : 0.6}
          talk={talking(f, 125, 215)} />
      </div>
      {rise > 0.2 && (
        <div style={{ position: "absolute", left: 30, top: top + bob + 260, width: 420, height: 525 }}>
          <Hands skin={C.skinMid} up={rise} sleeve={C.white} />
        </div>
      )}
      {hatGone && hf < 70 && (
        <div style={{ position: "absolute", left: 30 + hf * 12, top: top + bob + 100 - hf * 22 + hf * hf * 0.5,
          width: 420, height: 147, rotate: `${hf * 14}deg` }}>
          <ChurchHat />
        </div>
      )}
      <div style={{ position: "absolute", left: 470, top: 800, width: 400, height: 700 }}>
        <Junior outfit="sunday" look={-0.8} squint={f > 290 ? 0.6 : 0.2} talk={talking(f, 300, 375)} />
      </div>
      <div style={{ position: "absolute", left: 1100 - ushersIn * 280, top: 520, width: 300, height: 900 }}>
        <Usher step={f > 218 && f < 258 ? f / 10 : 0} />
      </div>
      {ushersIn > 0.9 && (
        <div style={{ position: "absolute", left: -40, top: 1180 + sheet * 150, width: 520, height: 180 - sheet * 40,
          background: "#fff", borderRadius: 18, boxShadow: "0 6px 20px rgba(0,0,0,0.25)", rotate: `${(1 - sheet) * -6}deg` }} />
      )}
      <PewFront />
      <Caption world="then" from={10} to={90} who="Deacon" text="Somebody shout HALLELUJAH!" />
      <Caption world="then" from={125} to={215} who="Mother Brown" text="HALLELUJAAAAH!" />
      <Caption world="then" from={300} to={375} who="Junior" text="Every Sunday. Same song. Same time." />
      <Caption world="then" from={380} to={445} who="Usher" text="Wi have yuh, Mother." />
    </AbsoluteFill>
  );
};

export const SpiritNow: React.FC = () => {
  const f = useCurrentFrame();
  const rise = ramp(f, 210, 228, 0, 1);
  const shaking = f > 228 && f < 412;
  const usherX = ramp(f, 300, 340, 1150, 640);
  return (
    <AbsoluteFill style={{ overflow: "hidden", background: C.nowBg }}>
      <Auditorium frame={f}>
        <div style={{ position: "absolute", left: 80, top: 180, width: 920, height: 600, borderRadius: 10, overflow: "hidden",
          background: "linear-gradient(180deg, #2a2378, #120f33)", display: "flex", justifyContent: "center", paddingTop: 80 }}>
          <div style={{ fontFamily: inter, fontWeight: 700, fontSize: 110, color: "#fff", letterSpacing: 10 }}>FEEL FREE</div>
        </div>
        <div style={{ position: "absolute", left: 380, top: 470, width: 320, height: 480 }}>
          <PastorJordan arms={f < 210 ? 1 : 0.3} talk={talking(f, 10, 105)} />
        </div>
        {[40, 250, 460, 670, 880].map((x, i) => (
          <div key={x} style={{ position: "absolute", left: x, top: 960, width: 170, height: 220 }}>
            <Silhouette color="#1a1838" variant={i} />
          </div>
        ))}
        <div style={{ position: "absolute", left: 30, top: 1040 - rise * 200 + (shaking ? Math.abs(Math.sin(f * 0.45)) * -30 : 0),
          width: 380, height: 665, rotate: shaking ? `${Math.sin(f * 0.8) * 6}deg` : "0deg", transformOrigin: "50% 100%" }}>
          <MotherBrown outfit="coat" showFan={false} squint={shaking ? 1 : f > 412 ? 0.5 : 0} smile={shaking ? 0.9 : 0}
            browL={f > 412 ? 1 : 0} browR={f > 412 ? 1 : 0} look={f > 330 ? 1 : 0} talk={talking(f, 225, 300) + talking(f, 415, 475)} />
        </div>
        {rise > 0.2 && (
          <div style={{ position: "absolute", left: 30, top: 1040 - rise * 200 + 250, width: 380, height: 475 }}>
            <Hands skin={C.skinMid} up={f < 412 ? rise : ramp(f, 412, 422, 1, 0.2)} sleeve="#5b2a6e" />
          </div>
        )}
        <div style={{ position: "absolute", left: 360, top: 1000, width: 420, height: 735 }}>
          <Junior outfit="hoodie" look={f > 228 ? -1 : 0} browL={f > 228 ? 1 : 0} browR={f > 228 ? 1 : 0} smile={f > 228 ? -0.3 : 0} />
        </div>
        <div style={{ position: "absolute", left: usherX, top: 900, width: 380, height: 665 }}>
          <Person skin={C.skinWarm} top="hoodie" topColor="#1d1d24" hair="low" lanyard smile={0.3} look={-1} talk={talking(f, 335, 410)} />
        </div>
        {f > 300 && (
          <div style={{ position: "absolute", left: usherX + 40, top: 1300, width: 300, height: 120, background: "#8a8f99", borderRadius: 16,
            display: "flex", alignItems: "center", justifyContent: "center", fontFamily: inter, fontWeight: 700, fontSize: 36, color: "#eee" }}>
            RISE
          </div>
        )}
        <div style={{ position: "absolute", left: -20, right: -20, top: 1560, height: 400, background: "#08070f", borderTop: "6px solid #1f1c4a" }} />
      </Auditorium>
      <Caption world="now" from={10} to={105} who="Pastor Jordan" text="Just… feel free in this place." />
      <Caption world="now" from={115} to={200} who="The congregation" text="…" />
      <Caption world="now" from={225} to={300} who="Mother Brown" text="HALLELUJAAAAH!" />
      <Caption world="now" from={335} to={410} who="Usher" text="Ma’am, we have a quiet room for this." />
      <Caption world="now" from={415} to={475} who="Mother Brown" text="A quiet WHAT?!" />
    </AbsoluteFill>
  );
};
