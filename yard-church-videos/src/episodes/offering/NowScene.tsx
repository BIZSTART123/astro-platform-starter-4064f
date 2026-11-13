import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Junior, MotherBrown, PastorJordan, Silhouette } from "../../characters";
import { Auditorium } from "../../sets";
import { FakeQR, Phone } from "../../props";
import { Caption } from "../../ui";
import { ramp, talking } from "../../anim";
import { C, inter } from "../../theme";

export const OFFERING_NOW_FRAMES = 450;

const crowdBack = [40, 250, 460, 670, 880];
const crowdFront = [-60, 820];

export const OfferingNow: React.FC = () => {
  const f = useCurrentFrame();

  const screenSwap = ramp(f, 100, 112, 0, 1);
  const phonesUp = ramp(f, 118, 160, 0, 1);
  const myPhone = ramp(f, 150, 186, 0, 1);
  const zoom = ramp(f, 170, 200, 1, 1.2);
  const confirm = f >= 230;

  // Mother Brown rises from behind his shoulder.
  const mbY = ramp(f, 316, 330, 1500, 860);
  const jrLook = f < 335 ? ramp(f, 190, 205, 0, 0.6) : ramp(f, 335, 342, 0.6, -1);
  const jrSmile = f < 335 ? ramp(f, 240, 255, 0.2, 1) : ramp(f, 335, 345, 1, -0.6);
  const jrBrows = ramp(f, 335, 343, 0, 1);

  return (
    <AbsoluteFill style={{ overflow: "hidden", background: C.nowBg }}>
      <AbsoluteFill style={{ transformOrigin: "540px 1600px", scale: zoom }}>
        <Auditorium frame={f}>
          {/* LED wall content */}
          <div style={{ position: "absolute", left: 80, top: 180, width: 920, height: 600, borderRadius: 10, overflow: "hidden",
            background: "linear-gradient(180deg, #2a2378, #120f33)" }}>
            <div style={{ position: "absolute", left: 210, top: 40, width: 500, height: 750, opacity: 1 - screenSwap }}>
              <PastorJordan talk={talking(f, 10, 110)} arms={ramp(f, 20, 50, 0, 1)} />
            </div>
            <div style={{ position: "absolute", inset: 0, opacity: screenSwap, display: "flex", alignItems: "center",
              justifyContent: "center", gap: 50 }}>
              <FakeQR size={380} />
              <div style={{ fontFamily: inter, fontWeight: 700, color: "#fff", fontSize: 80, lineHeight: 1 }}>SCAN<br />TO<br />GIVE</div>
            </div>
          </div>
          {/* back row with phones */}
          {crowdBack.map((x, i) => (
            <React.Fragment key={x}>
              <div style={{ position: "absolute", left: x, top: 960, width: 170, height: 220 }}>
                <Silhouette color="#1a1838" variant={i} />
              </div>
              <div style={{ position: "absolute", left: x + 95, top: 1010 - phonesUp * 90, width: 50, height: 90, borderRadius: 10,
                background: "#cfe0ff", opacity: phonesUp, boxShadow: "0 0 40px rgba(150,190,255,0.8)" }} />
            </React.Fragment>
          ))}
          {/* Mother Brown, visiting, behind his shoulder */}
          <div style={{ position: "absolute", left: 90, top: mbY, width: 380, height: 665 }}>
            <MotherBrown outfit="coat" showFan={false} look={1} browR={1} squint={0.5} talk={talking(f, 340, 430)} />
          </div>
          {/* Junior, now grown, in a hoodie */}
          <div style={{ position: "absolute", left: 330, top: 1000, width: 420, height: 735 }}>
            <Junior outfit="hoodie" look={jrLook} smile={jrSmile} browL={jrBrows} browR={jrBrows} talk={talking(f, 245, 320)} />
          </div>
          {/* front row silhouettes */}
          {crowdFront.map((x, i) => (
            <div key={x} style={{ position: "absolute", left: x, top: 1180, width: 320, height: 420 }}>
              <Silhouette color="#0b0a1a" variant={i + 1} />
            </div>
          ))}
          {/* seat backs */}
          <div style={{ position: "absolute", left: -20, right: -20, top: 1560, height: 400, background: "#08070f",
            borderTop: "6px solid #1f1c4a" }} />
          {/* his phone */}
          <div style={{ position: "absolute", left: 620, top: 1640 - myPhone * 440, width: 220, height: 420, rotate: "-6deg", opacity: myPhone > 0 ? 1 : 0 }}>
            <Phone glow={myPhone}>
              {!confirm ? (
                <>
                  <div style={{ fontFamily: inter, fontWeight: 700, fontSize: 30, color: "#222" }}>Give</div>
                  <div style={{ fontFamily: inter, fontWeight: 700, fontSize: 64, color: "#222" }}>$20</div>
                  <div style={{ fontFamily: inter, fontWeight: 700, fontSize: 26, color: "#fff", background: C.violet,
                    padding: "10px 24px", borderRadius: 999 }}>Confirm</div>
                </>
              ) : (
                <>
                  <svg width={110} height={110} viewBox="0 0 110 110">
                    <circle cx={55} cy={55} r={50} fill="#2fb36b" />
                    <path d="M 30 57 L 48 75 L 82 38" stroke="#fff" strokeWidth={11} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div style={{ fontFamily: inter, fontWeight: 700, fontSize: 32, color: "#222" }}>Sent</div>
                  <div style={{ fontFamily: inter, fontWeight: 500, fontSize: 22, color: "#666" }}>Private gift</div>
                </>
              )}
            </Phone>
          </div>
        </Auditorium>
      </AbsoluteFill>

      <Caption world="now" from={10} to={112} who="Pastor Jordan" text="Grab your phones, scan the code, and let’s sow a seed!" />
      <Caption world="now" from={245} to={320} who="Junior" text="Nobody saw how much I gave." />
      <Caption world="now" from={340} to={445} who="Mother Brown" text="I saw." />
    </AbsoluteFill>
  );
};
