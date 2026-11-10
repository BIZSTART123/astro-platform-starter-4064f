import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { MotherBrown, Junior, Usher } from "../../characters";
import { OldChurch, PewFront } from "../../sets";
import { Coin, MoneyHand, Note, Plate } from "../../props";
import { Caption } from "../../ui";
import { ramp, talking } from "../../anim";

export const OFFERING_THEN_FRAMES = 450;

export const OfferingThen: React.FC = () => {
  const f = useCurrentFrame();

  // Camera: push in on Mother Brown for "Hmm", then back out.
  const zoom = f < 300 ? ramp(f, 228, 250, 1, 2.1) : ramp(f, 300, 322, 2.1, 1);
  const panX = f < 300 ? ramp(f, 228, 250, 0, 300) : ramp(f, 300, 322, 300, 0);

  // Usher walks in and hands the plate along.
  const usherX = ramp(f, 40, 115, 1150, 850);
  const plateX = f < 125 ? usherX + 10 : ramp(f, 125, 160, 860, 600);
  const plateY = f < 125 ? 1320 : ramp(f, 125, 160, 1320, 1338);

  // Mother Brown watches the plate, then the hand.
  const look = ramp(f, 125, 150, 0, 1);
  const lean = f < 360 ? ramp(f, 150, 190, 0, 7) : ramp(f, 362, 385, 7, 0);
  const browR = f < 358 ? ramp(f, 234, 244, 0, 1) : ramp(f, 358, 368, 1, 0);
  const squint = f < 358 ? ramp(f, 234, 244, 0, 0.55) : ramp(f, 358, 368, 0.55, 0);
  const mbSmile = ramp(f, 368, 385, 0, 1);
  const fan = f > 380 ? Math.sin((f - 380) / 3) * 10 : 0;

  // Junior's hand: a coin first, then a note after the look.
  const hand1Y = f < 212 ? ramp(f, 182, 204, 1560, 1300) : ramp(f, 216, 236, 1300, 1560);
  const coinY = ramp(f, 212, 222, 1300, 1342);
  const hand2Y = f < 345 ? ramp(f, 318, 340, 1560, 1290) : ramp(f, 350, 370, 1290, 1560);
  const noteY = ramp(f, 345, 356, 1296, 1334);
  const jrLook = f < 300 ? ramp(f, 160, 180, 0, 0.5) : ramp(f, 300, 315, 0.5, -0.8);
  const jrBrows = ramp(f, 300, 312, 0, 0.8);

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: "#000" }}>
      <AbsoluteFill style={{ transformOrigin: "240px 1075px", scale: zoom, translate: `${panX}px 0` }}>
        <OldChurch frame={f} />
        <div style={{ position: "absolute", left: 30, top: 760, width: 420, height: 735, rotate: `${lean}deg`, transformOrigin: "50% 100%" }}>
          <MotherBrown look={look} browR={browR} squint={squint} smile={mbSmile} fan={fan}
            talk={talking(f, 386, 445)} />
        </div>
        <div style={{ position: "absolute", left: 470, top: 800, width: 400, height: 700 }}>
          <Junior look={jrLook} browL={jrBrows} browR={jrBrows} talk={talking(f, 315, 385)} smile={0.3} />
        </div>
        <div style={{ position: "absolute", left: usherX, top: 520, width: 300, height: 900 }}>
          <Usher step={f < 115 ? f / 18 : 0} />
        </div>
        <PewFront />
        <div style={{ position: "absolute", left: plateX - 120, top: plateY - 45, width: 240, height: 90 }}>
          <Plate />
        </div>
        {f >= 212 && f < 300 && (
          <div style={{ position: "absolute", left: 600 - 18, top: coinY - 18, width: 36, height: 36 }}><Coin /></div>
        )}
        {f >= 345 && (
          <div style={{ position: "absolute", left: 600 - 45, top: noteY - 25, width: 90, height: 50, rotate: "-8deg" }}><Note /></div>
        )}
        {/* Hands rise from behind the pew, so clip them at its top edge. */}
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1392, overflow: "hidden" }}>
          <div style={{ position: "absolute", left: 540, top: hand1Y, width: 120, height: 220 }}>
            <MoneyHand item={f < 212 ? "coin" : "none"} />
          </div>
          <div style={{ position: "absolute", left: 540, top: hand2Y, width: 120, height: 220 }}>
            <MoneyHand item={f < 345 ? "note" : "none"} />
          </div>
        </div>
      </AbsoluteFill>

      <Caption world="then" from={10} to={118} who="Deacon" text="And now, we will receive the tithes and offering." />
      <Caption world="then" from={240} to={300} who="Mother Brown" text="Hmm." />
      <Caption world="then" from={315} to={385} who="Junior" text="…and a likkle more." />
      <Caption world="then" from={386} to={445} who="Mother Brown" text="Praise Him." />
    </AbsoluteFill>
  );
};
