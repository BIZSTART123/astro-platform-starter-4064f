import React from "react";
import { AbsoluteFill, Easing, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  BLUE,
  BrandProps,
  FONT,
  GOLD,
  GREEN_DEEP,
  NAVY,
  RED,
  RED_DARK,
  clamp,
  withJingle,
  opticalTickerItems,
} from "./brand";
import { EndCard, Soundtrack, Ticker } from "./shared";

/* Version 1: "Breaking News". A fake news report finds the missing person: YOU. */

export type BreakingNewsProps = BrandProps;
export const defaultBreakingNewsProps: BreakingNewsProps = withJingle(0);

const T = {
  open: 0, // BREAKING NEWS slam
  report: 60, // missing-person report
  twist: 165, // glitch -> "it's YOU"
  ask: 255, // why haven't you stopped in? -> when did you last check your eyes?
  cta: 420, // end card
  end: 570,
};
export const BREAKING_NEWS_DURATION = T.end;

/* ------------------------------------------------------------------ */
/*  Shared pieces                                                     */
/* ------------------------------------------------------------------ */

export const NewsBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const sweep = (frame * 6) % 2400;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 80% at 50% 30%, #1B2B5E 0%, ${NAVY} 60%, #050A1A 100%)`,
      }}
    >
      <AbsoluteFill
        style={{
          background: `linear-gradient(115deg, transparent ${sweep / 24 - 20}%, rgba(255,255,255,0.06) ${
            sweep / 24
          }%, transparent ${sweep / 24 + 20}%)`,
        }}
      />
      <svg width="1080" height="1920" style={{ position: "absolute", opacity: 0.12 }}>
        {Array.from({ length: 9 }).map((_, i) => (
          <ellipse
            key={`v${i}`}
            cx={540}
            cy={760}
            rx={Math.abs(Math.cos(((i * 20 + frame * 0.8) * Math.PI) / 180)) * 520}
            ry={520}
            fill="none"
            stroke="#7FA6FF"
            strokeWidth={2}
          />
        ))}
        {Array.from({ length: 7 }).map((_, i) => {
          const y = 760 + (i - 3) * 150;
          const r = Math.sqrt(Math.max(0, 520 ** 2 - (y - 760) ** 2));
          return <ellipse key={`h${i}`} cx={540} cy={y} rx={r} ry={r * 0.12} fill="none" stroke="#7FA6FF" strokeWidth={2} />;
        })}
      </svg>
      <AbsoluteFill
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0 2px, transparent 2px 5px)",
        }}
      />
    </AbsoluteFill>
  );
};

export const LiveBug: React.FC = () => {
  const frame = useCurrentFrame();
  const blink = Math.floor(frame / 15) % 2 === 0 ? 1 : 0.25;
  return (
    <div
      style={{
        position: "absolute",
        top: 90,
        left: 60,
        right: 60,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: FONT,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: RED, padding: "10px 22px", borderRadius: 8 }}>
        <div style={{ width: 22, height: 22, borderRadius: 11, background: "white", opacity: blink }} />
        <span style={{ color: "white", fontWeight: 900, fontSize: 40, letterSpacing: 4 }}>LIVE</span>
      </div>
      <div
        style={{
          color: "white",
          fontWeight: 800,
          fontSize: 34,
          letterSpacing: 3,
          background: "rgba(255,255,255,0.1)",
          border: "2px solid rgba(255,255,255,0.25)",
          padding: "10px 22px",
          borderRadius: 8,
        }}
      >
        INVERSA RX NEWS
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Scenes                                                            */
/* ------------------------------------------------------------------ */

const OpenSlam: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const flash = interpolate(frame, [0, 4, 14], [1, 0.9, 0], clamp);
  const s = spring({ frame: frame - 3, fps, config: { damping: 11, stiffness: 180 } });
  const s2 = spring({ frame: frame - 10, fps, config: { damping: 12, stiffness: 160 } });
  const shake = frame < 18 ? Math.sin(frame * 3.1) * (18 - frame) * 1.4 : 0;
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", fontFamily: FONT }}>
      <div style={{ transform: `translateX(${shake}px)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
        <div
          style={{
            transform: `scale(${interpolate(s, [0, 1], [3, 1])}) rotate(-3deg)`,
            opacity: s,
            background: RED,
            color: "white",
            fontWeight: 900,
            fontSize: 150,
            lineHeight: 1,
            padding: "26px 44px",
            letterSpacing: 4,
            boxShadow: `0 16px 0 ${RED_DARK}, 0 30px 80px rgba(225,20,30,0.6)`,
          }}
        >
          BREAKING
        </div>
        <div
          style={{
            transform: `translateX(${interpolate(s2, [0, 1], [900, 0])}px) rotate(-3deg)`,
            background: "white",
            color: NAVY,
            fontWeight: 900,
            fontSize: 130,
            lineHeight: 1,
            padding: "22px 44px",
            letterSpacing: 6,
          }}
        >
          NEWS
        </div>
      </div>
      <AbsoluteFill style={{ background: "white", opacity: flash }} />
    </AbsoluteFill>
  );
};

const Report: React.FC<{ brand: string }> = ({ brand }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bar = spring({ frame, fps, config: { damping: 16 } });
  const lines = ["AUTHORITIES AT", brand.toUpperCase(), "REPORT A REGULAR", "HAS GONE MISSING"];
  const pulse = 1 + Math.sin(frame / 4) * 0.02;
  return (
    <AbsoluteFill style={{ fontFamily: FONT, alignItems: "center" }}>
      <div
        style={{
          marginTop: 330,
          transform: `scale(${pulse})`,
          border: `5px solid ${GOLD}`,
          color: GOLD,
          fontWeight: 900,
          fontSize: 52,
          letterSpacing: 6,
          padding: "14px 34px",
          opacity: interpolate(frame, [0, 8], [0, 1], clamp),
        }}
      >
        ⚠ MISSING PERSON
      </div>

      <div
        style={{
          marginTop: 60,
          width: 420,
          height: 470,
          background: "rgba(255,255,255,0.06)",
          border: "4px solid rgba(255,255,255,0.35)",
          position: "relative",
          overflow: "hidden",
          transform: `scale(${interpolate(bar, [0, 1], [0.7, 1])})`,
          opacity: bar,
        }}
      >
        <svg viewBox="0 0 420 470" width="420" height="470">
          <circle cx="210" cy="170" r="88" fill="rgba(255,255,255,0.25)" />
          <path d="M40 470 C 60 330, 360 330, 380 470 Z" fill="rgba(255,255,255,0.25)" />
          <text x="210" y="205" textAnchor="middle" fontSize="120" fontWeight="900" fill={GOLD} fontFamily="Inter">
            ?
          </text>
        </svg>
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            background: RED,
            color: "white",
            fontWeight: 900,
            fontSize: 30,
            textAlign: "center",
            padding: "8px 0",
            letterSpacing: 3,
          }}
        >
          IDENTITY: UNKNOWN
        </div>
      </div>

      <div style={{ position: "absolute", top: 1110, left: 40, right: 40 }}>
        {lines.map((l, i) => {
          const p = spring({ frame: frame - 12 - i * 7, fps, config: { damping: 18 } });
          const isBrand = i === 1;
          return (
            <div key={l} style={{ overflow: "hidden" }}>
              <div
                style={{
                  transform: `translateY(${interpolate(p, [0, 1], [110, 0])}%)`,
                  color: isBrand ? GOLD : "white",
                  fontWeight: 900,
                  fontSize: isBrand ? 84 : 72,
                  lineHeight: 1.12,
                  textAlign: "center",
                  textShadow: "0 6px 24px rgba(0,0,0,0.6)",
                }}
              >
                {l}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const Twist: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const glitching = frame < 14;
  const gx = glitching ? ((frame * 37) % 41) - 20 : 0;
  const pre = interpolate(frame, [12, 18, 44, 50], [0, 1, 1, 0], clamp);
  const you = spring({ frame: frame - 48, fps, config: { damping: 8, stiffness: 200 } });
  const zoom = interpolate(frame, [48, 90], [1, 1.08], clamp);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, justifyContent: "center", alignItems: "center" }}>
      {glitching && (
        <>
          <AbsoluteFill style={{ background: RED, opacity: 0.35, transform: `translateX(${gx}px)` }} />
          <AbsoluteFill
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.25) 0 6px, transparent 6px 26px)",
              transform: `translateY(${gx * 3}px)`,
            }}
          />
        </>
      )}
      <div style={{ position: "absolute", top: 640, opacity: pre, color: "white", textAlign: "center", padding: "0 60px" }}>
        <div style={{ color: GOLD, fontWeight: 900, fontSize: 56, letterSpacing: 6, marginBottom: 24 }}>UPDATE:</div>
        <div style={{ fontWeight: 800, fontSize: 74, lineHeight: 1.15 }}>
          The missing person
          <br />
          has been identified…
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 560,
          textAlign: "center",
          transform: `scale(${interpolate(you, [0, 1], [0.2, 1]) * zoom})`,
          opacity: interpolate(frame, [48, 52], [0, 1], clamp),
        }}
      >
        <div style={{ color: "white", fontWeight: 800, fontSize: 80 }}>…it's</div>
        <div
          style={{
            fontWeight: 900,
            fontSize: 330,
            lineHeight: 0.95,
            color: GOLD,
            textShadow: `0 0 60px rgba(255,194,26,0.6), 10px 10px 0 ${RED}`,
            letterSpacing: -6,
          }}
        >
          YOU.
        </div>
        <svg width="220" height="140" viewBox="0 0 220 140" style={{ marginTop: 30, transform: `translateY(${Math.sin(frame / 3) * 10}px)` }}>
          <path d="M110 130 L30 40 L80 40 L80 0 L140 0 L140 40 L190 40 Z" fill={RED} stroke="white" strokeWidth="6" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

/** Side-eye wearing the logo's glasses. */
export const SideEyeGlasses: React.FC<{ look: number; open?: number }> = ({ look, open = 0 }) => (
  <svg width="760" height="300" viewBox="0 0 760 300">
    {[0, 1].map((i) => {
      const cx = 200 + i * 360;
      return (
        <g key={i}>
          <clipPath id={`lens${i}`}>
            <rect x={cx - 160} y={60} width={320} height={200} rx={70} />
          </clipPath>
          <rect x={cx - 160} y={60} width={320} height={200} rx={70} fill="white" />
          <g clipPath={`url(#lens${i})`}>
            <circle cx={cx + look} cy={175} r={52} fill={NAVY} />
            <circle cx={cx + look + 16} cy={158} r={14} fill="white" />
            {/* half-lidded, unimpressed */}
            <rect x={cx - 170} y={50 - open * 70} width={340} height={88} fill={BLUE} />
          </g>
          <rect x={cx - 160} y={60} width={320} height={200} rx={70} fill="none" stroke={NAVY} strokeWidth={26} />
        </g>
      );
    })}
    {/* bridge */}
    <path d="M354 120 Q380 92 406 120" fill="none" stroke={NAVY} strokeWidth={22} strokeLinecap="round" />
    {/* temples */}
    <path d="M40 110 L8 92" stroke={NAVY} strokeWidth={22} strokeLinecap="round" />
    <path d="M720 110 L752 92" stroke={NAVY} strokeWidth={22} strokeLinecap="round" />
  </svg>
);

const Ask: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wipe = interpolate(frame, [0, 14], [0, 100], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const q = spring({ frame: frame - 10, fps, config: { damping: 14 } });
  // Phase 2 (frame 62+): the joke drops, the concern comes in
  const swap = spring({ frame: frame - 62, fps, config: { damping: 18 } });
  const care = spring({ frame: frame - 100, fps, config: { damping: 16 } });
  const look = frame < 62 ? interpolate(Math.sin(frame / 7), [-1, 1], [-46, 46]) : interpolate(swap, [0, 1], [interpolate(Math.sin(62 / 7), [-1, 1], [-46, 46]), 0]);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          clipPath: `circle(${wipe * 1.5}% at 50% 45%)`,
          background: `radial-gradient(90% 60% at 50% 40%, #FFFFFF 0%, #EEF6FF 60%, #DCEBFF 100%)`,
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 120,
        }}
      >
        <div style={{ transform: `scale(${q})` }}>
          <SideEyeGlasses look={look} open={swap} />
        </div>

        <div style={{ position: "relative", width: 1080, height: 520, marginTop: 60 }}>
          {/* phase 1 */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              textAlign: "center",
              color: NAVY,
              fontWeight: 900,
              fontSize: 112,
              lineHeight: 1.02,
              letterSpacing: -2,
              opacity: q * (1 - swap),
              transform: `translateY(${interpolate(q, [0, 1], [80, 0]) - swap * 60}px)`,
            }}
          >
            Why haven't you
            <br />
            <span style={{ color: BLUE }}>stopped in?</span>
          </div>
          {/* phase 2 */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              textAlign: "center",
              padding: "0 70px",
              opacity: swap,
              transform: `translateY(${interpolate(swap, [0, 1], [60, 0])}px)`,
            }}
          >
            <div style={{ color: NAVY, fontWeight: 900, fontSize: 92, lineHeight: 1.05, letterSpacing: -2 }}>
              When did you last
              <br />
              <span style={{ color: BLUE }}>really</span> check
              <br />
              your eyes?
            </div>
            <div
              style={{
                marginTop: 44,
                color: GREEN_DEEP,
                fontWeight: 800,
                fontSize: 54,
                opacity: care,
                transform: `translateY(${interpolate(care, [0, 1], [30, 0])}px)`,
              }}
            >
              Real talk… I'm concerned about you.
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/*  Composition                                                       */
/* ------------------------------------------------------------------ */

export const BreakingNews: React.FC<BreakingNewsProps> = (props) => {
  const B = props.brand.toUpperCase();
  const items = opticalTickerItems(props, [
    `LAST SEEN: NOT AT ${B}`,
    `DAYS SINCE YOUR LAST EYE EXAM: TOO MANY`,
    `EXPERTS CONFIRM: YOUR GLASSES ARE OVERDUE`,
  ]);
  return (
    <AbsoluteFill style={{ background: NAVY }}>
      <Sequence from={T.open} durationInFrames={T.ask - T.open} layout="none">
        <NewsBackground />
        <Sequence from={T.open} durationInFrames={T.report} layout="none">
          <OpenSlam />
        </Sequence>
        <Sequence from={T.report} durationInFrames={T.twist - T.report} layout="none">
          <Report brand={props.brand} />
        </Sequence>
        <Sequence from={T.twist} durationInFrames={T.ask - T.twist} layout="none">
          <Twist />
        </Sequence>
        <LiveBug />
        <Ticker items={items} />
      </Sequence>

      <Sequence from={T.ask} durationInFrames={T.cta - T.ask}>
        <Ask />
      </Sequence>
      <Sequence from={T.cta} durationInFrames={T.end - T.cta}>
        <EndCard {...props} />
      </Sequence>

      <Soundtrack id="v1" p={props} durationInFrames={T.end} />
    </AbsoluteFill>
  );
};
