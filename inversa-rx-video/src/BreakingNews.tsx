import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/* ------------------------------------------------------------------ */
/*  Props: edit these in Studio or in Root.tsx                        */
/* ------------------------------------------------------------------ */
export type BreakingNewsProps = {
  brand: string;
  /** Shown on the final card. Leave empty to show the tagline instead. */
  address: string;
  hours: string;
  phone: string;
  tagline: string;
  withAudio: boolean;
};

export const defaultBreakingNewsProps: BreakingNewsProps = {
  brand: "Inversa Rx",
  address: "",
  hours: "",
  phone: "",
  tagline: "Your neighborhood pharmacy",
  withAudio: true,
};

/* ------------------------------------------------------------------ */
/*  Timeline (30 fps)                                                 */
/* ------------------------------------------------------------------ */
export const FPS = 30;
const T = {
  open: 0, // BREAKING NEWS slam
  report: 60, // missing-person report
  twist: 165, // glitch -> "it's YOU"
  ask: 255, // warm reveal: why haven't you stopped in?
  cta: 360, // brand card
  end: 465,
};
export const DURATION = T.end;

const RED = "#E1141E";
const RED_DARK = "#8E0A10";
const NAVY = "#0A1430";
const GOLD = "#FFC21A";
const TEAL = "#14B8A6";
const CREAM = "#FFF8EE";
const FONT = "Inter, 'Inter Display', 'DejaVu Sans', sans-serif";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ------------------------------------------------------------------ */
/*  Shared pieces                                                     */
/* ------------------------------------------------------------------ */

const NewsBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const sweep = (frame * 6) % 2400;
  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(120% 80% at 50% 30%, #1B2B5E 0%, ${NAVY} 60%, #050A1A 100%)`,
      }}
    >
      {/* moving "studio" light beams */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(115deg, transparent ${sweep / 24 - 20}%, rgba(255,255,255,0.06) ${
            sweep / 24
          }%, transparent ${sweep / 24 + 20}%)`,
        }}
      />
      {/* globe grid */}
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
      {/* scanlines */}
      <AbsoluteFill
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0 2px, transparent 2px 5px)",
        }}
      />
    </AbsoluteFill>
  );
};

const LiveBug: React.FC<{ brand: string }> = ({ brand }) => {
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
        {brand.toUpperCase()} NEWS
      </div>
    </div>
  );
};

/** The scrolling footer ticker, which carries the "real" message. */
const Ticker: React.FC<{ brand: string }> = ({ brand }) => {
  const frame = useCurrentFrame();
  const items = [
    `MISSING: ONE (1) REGULAR CUSTOMER`,
    `LAST SEEN: NOT AT ${brand.toUpperCase()}`,
    `DAYS SINCE YOUR LAST VISIT: TOO MANY`,
    `SOURCES SAY YOUR EXCUSE IS "WEAK AT BEST"`,
    `EXPERTS CONFIRM: YOU'RE OVERDUE FOR A VISIT`,
    `THIS HAS BEEN AN OFFICIAL GUILT TRIP™`,
  ];
  const text = items.join("   •   ") + "   •   ";
  const x = -((frame * 7) % 2600);
  const slideUp = interpolate(frame, [8, 22], [140, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 150,
        height: 110,
        display: "flex",
        transform: `translateY(${slideUp}px)`,
        fontFamily: FONT,
        boxShadow: "0 -6px 30px rgba(0,0,0,0.5)",
      }}
    >
      <div
        style={{
          background: GOLD,
          color: NAVY,
          fontWeight: 900,
          fontSize: 40,
          padding: "0 26px",
          display: "flex",
          alignItems: "center",
          zIndex: 2,
          letterSpacing: 2,
        }}
      >
        UPDATE
      </div>
      <div style={{ flex: 1, background: "white", overflow: "hidden", position: "relative", display: "flex", alignItems: "center" }}>
        <div
          style={{
            whiteSpace: "nowrap",
            transform: `translateX(${x}px)`,
            color: NAVY,
            fontWeight: 800,
            fontSize: 44,
          }}
        >
          {text}
          {text}
          {text}
        </div>
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
      {/* alert chip */}
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

      {/* silhouette "wanted" card */}
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

      {/* headline lower-third */}
      <div style={{ position: "absolute", top: 1110, left: 50, right: 50 }}>
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
                  fontSize: isBrand ? 96 : 72,
                  lineHeight: 1.1,
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
        {/* pointing arrow */}
        <svg width="220" height="140" viewBox="0 0 220 140" style={{ marginTop: 30, transform: `translateY(${Math.sin(frame / 3) * 10}px)` }}>
          <path d="M110 130 L30 40 L80 40 L80 0 L140 0 L140 40 L190 40 Z" fill={RED} stroke="white" strokeWidth="6" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

const Ask: React.FC<{ brand: string }> = ({ brand }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wipe = interpolate(frame, [0, 14], [0, 100], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const q = spring({ frame: frame - 10, fps, config: { damping: 14 } });
  const sub = spring({ frame: frame - 34, fps, config: { damping: 16 } });
  // eyes glance left/right
  const look = interpolate(Math.sin(frame / 7), [-1, 1], [-14, 14]);
  return (
    <AbsoluteFill style={{ fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          clipPath: `circle(${wipe * 1.5}% at 50% 45%)`,
          background: `radial-gradient(90% 60% at 50% 40%, #FFFFFF 0%, ${CREAM} 55%, #FCE7C8 100%)`,
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 120,
        }}
      >
        {/* side-eye */}
        <div style={{ display: "flex", gap: 46, transform: `scale(${q})` }}>
          {[0, 1].map((i) => (
            <div
              key={i}
              style={{
                width: 190,
                height: 150,
                borderRadius: "50%",
                background: "white",
                border: `10px solid ${NAVY}`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  width: 74,
                  height: 74,
                  borderRadius: 37,
                  background: NAVY,
                  top: 28,
                  left: 48 + look,
                }}
              />
              {/* half-lidded */}
              <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 52, background: TEAL }} />
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: 90,
            padding: "0 70px",
            textAlign: "center",
            color: NAVY,
            fontWeight: 900,
            fontSize: 112,
            lineHeight: 1.02,
            letterSpacing: -2,
            transform: `translateY(${interpolate(q, [0, 1], [80, 0])}px)`,
            opacity: q,
          }}
        >
          Why haven't you
          <br />
          <span style={{ color: TEAL }}>stopped in?</span>
        </div>

        <div
          style={{
            marginTop: 50,
            color: NAVY,
            fontWeight: 600,
            fontSize: 52,
            textAlign: "center",
            opacity: sub,
            transform: `translateY(${interpolate(sub, [0, 1], [40, 0])}px)`,
            padding: "0 80px",
            lineHeight: 1.3,
          }}
        >
          We noticed. {brand} misses you.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const RxMark: React.FC<{ size: number }> = ({ size }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.28,
      background: `linear-gradient(145deg, ${TEAL}, #0E7C70)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      boxShadow: "0 20px 50px rgba(20,184,166,0.45)",
    }}
  >
    <span style={{ color: "white", fontFamily: FONT, fontWeight: 900, fontSize: size * 0.48, letterSpacing: -2 }}>℞</span>
  </div>
);

const Cta: React.FC<BreakingNewsProps> = ({ brand, address, hours, phone, tagline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame, fps, config: { damping: 10, stiffness: 150 } });
  const name = spring({ frame: frame - 8, fps, config: { damping: 16 } });
  const btn = spring({ frame: frame - 22, fps, config: { damping: 12 } });
  const details = [address, hours, phone].filter((d) => d.trim().length > 0);
  const breathe = 1 + Math.sin(frame / 6) * 0.025;
  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 120,
        background: `radial-gradient(100% 70% at 50% 35%, #12305A 0%, ${NAVY} 70%)`,
      }}
    >
      <div style={{ transform: `scale(${logo}) rotate(${interpolate(logo, [0, 1], [-25, 0])}deg)` }}>
        <RxMark size={260} />
      </div>
      <div
        style={{
          marginTop: 50,
          color: "white",
          fontWeight: 900,
          fontSize: 120,
          letterSpacing: -3,
          opacity: name,
          transform: `translateY(${interpolate(name, [0, 1], [50, 0])}px)`,
        }}
      >
        {brand}
      </div>
      <div style={{ color: "rgba(255,255,255,0.75)", fontWeight: 600, fontSize: 44, marginTop: 6, opacity: name }}>
        {details.length === 0 ? tagline : ""}
      </div>

      <div
        style={{
          marginTop: 70,
          background: GOLD,
          color: NAVY,
          fontWeight: 900,
          fontSize: 66,
          padding: "30px 60px",
          borderRadius: 999,
          transform: `scale(${btn * breathe})`,
          boxShadow: "0 18px 50px rgba(255,194,26,0.4)",
        }}
      >
        Stop in this week
      </div>

      {details.length > 0 && (
        <div style={{ marginTop: 50, textAlign: "center", opacity: btn }}>
          {details.map((d) => (
            <div key={d} style={{ color: "white", fontWeight: 600, fontSize: 46, lineHeight: 1.45 }}>
              {d}
            </div>
          ))}
        </div>
      )}
      <div style={{ marginTop: 40, color: "rgba(255,255,255,0.6)", fontSize: 38, fontWeight: 600, opacity: btn }}>
        No more excuses.
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/*  Composition                                                       */
/* ------------------------------------------------------------------ */

export const BreakingNews: React.FC<BreakingNewsProps> = (props) => {
  const { brand, withAudio } = props;
  return (
    <AbsoluteFill style={{ background: NAVY }}>
      {/* News segment: background, live bug and ticker run until the warm reveal */}
      <Sequence from={T.open} durationInFrames={T.ask - T.open} layout="none">
        <NewsBackground />
        <Sequence from={T.open} durationInFrames={T.report} layout="none">
          <OpenSlam />
        </Sequence>
        <Sequence from={T.report} durationInFrames={T.twist - T.report} layout="none">
          <Report brand={brand} />
        </Sequence>
        <Sequence from={T.twist} durationInFrames={T.ask - T.twist} layout="none">
          <Twist />
        </Sequence>
        <LiveBug brand={brand} />
        <Ticker brand={brand} />
      </Sequence>

      <Sequence from={T.ask} durationInFrames={T.cta - T.ask}>
        <Ask brand={brand} />
      </Sequence>
      <Sequence from={T.cta} durationInFrames={T.end - T.cta}>
        <Cta {...props} />
      </Sequence>

      {withAudio && <Audio src={staticFile("audio/breaking-news.wav")} />}
    </AbsoluteFill>
  );
};
