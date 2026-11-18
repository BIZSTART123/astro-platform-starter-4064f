import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
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
  /** Name used in headlines and the ticker. */
  brand: string;
  address: string;
  crossStreet: string;
  phone: string;
  website: string;
  instagram: string;
  appointments: string;
  examDeal: string;
  examWas: string;
  examCondition: string;
  framesDeal: string;
  framesCondition: string;
  benefits: string;
  benefitsNote: string;
  finePrint: string;
  withAudio: boolean;
};

// Matches the "OTC & Vision Benefits Accepted" flyer.
export const defaultBreakingNewsProps: BreakingNewsProps = {
  brand: "Inversa Rx Optical",
  address: "3545 White Plains Rd, Bronx",
  crossStreet: "Corner of White Plains Rd & E 213th St",
  phone: "(929) 717-4415",
  website: "InversaRx.com/optical",
  instagram: "@inversarx_pharmacy",
  appointments: "Eye exams by appointment",
  examDeal: "FREE",
  examWas: "$75",
  examCondition: "eye exam with frame purchase",
  framesDeal: "25% OFF",
  framesCondition: "all frames",
  benefits: "OTC & vision benefits accepted",
  benefitsNote: "Bring your benefit card. We'll check your eligibility and balance.",
  finePrint: "Free exam requires a frame purchase. Eligible cards, participating plans only. Coverage varies by plan and available balance.",
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
  cta: 360, // brand card with the offer
  end: 510,
};
export const DURATION = T.end;

// News look
const RED = "#E1141E";
const RED_DARK = "#8E0A10";
const NAVY = "#0B1A3A";
const GOLD = "#FFC21A";
// Inversa Rx Optical brand (sampled from the logo)
const BLUE = "#0080FB";
const GREEN = "#68DF83";
const GREEN_DARK = "#1E9E4A";
const STAR = "#F6A93B";
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

const LiveBug: React.FC = () => {
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

/** Footer ticker: the real optical info, with a few jokes mixed in. */
const Ticker: React.FC<BreakingNewsProps> = (p) => {
  const frame = useCurrentFrame();
  const B = p.brand.toUpperCase();
  const items = [
    `LAST SEEN: NOT AT ${B}`,
    `FREE EYE EXAM (${p.examWas} VALUE) WITH FRAME PURCHASE*`,
    `DAYS SINCE YOUR LAST VISIT: TOO MANY`,
    `${p.framesDeal} ${p.framesCondition.toUpperCase()}`,
    `${p.benefits.toUpperCase()}: BRING YOUR BENEFIT CARD`,
    `EXPERTS CONFIRM: YOUR GLASSES ARE OVERDUE`,
    `EYE EXAMS • PRESCRIPTION EYEGLASSES • READING GLASSES`,
    `${p.address.toUpperCase()} • ${p.phone}`,
    `BETTER VISION. BETTER LIFE.`,
  ].filter(Boolean);
  const text = items.join("   •   ") + "   •   ";
  const x = -(frame * 7);
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
          background: GREEN,
          color: NAVY,
          fontWeight: 900,
          fontSize: 38,
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          zIndex: 2,
          letterSpacing: 2,
        }}
      >
        OPTICAL
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
const SideEyeGlasses: React.FC<{ look: number }> = ({ look }) => (
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
            <rect x={cx - 170} y={50} width={340} height={88} fill={BLUE} />
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
  const sub = spring({ frame: frame - 36, fps, config: { damping: 16 } });
  const look = interpolate(Math.sin(frame / 7), [-1, 1], [-46, 46]);
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
          <SideEyeGlasses look={look} />
        </div>

        <div
          style={{
            marginTop: 70,
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
          <span style={{ color: BLUE }}>stopped in?</span>
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
            padding: "0 90px",
            lineHeight: 1.3,
          }}
        >
          Your glasses called.
          <br />
          <span style={{ color: GREEN_DARK, fontWeight: 800 }}>They want an upgrade.</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const Cta: React.FC<BreakingNewsProps> = (p) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame, fps, config: { damping: 13, stiffness: 140 } });
  const tileA = spring({ frame: frame - 12, fps, config: { damping: 12 } });
  const tileB = spring({ frame: frame - 20, fps, config: { damping: 12 } });
  const ben = spring({ frame: frame - 30, fps, config: { damping: 16 } });
  const btn = spring({ frame: frame - 40, fps, config: { damping: 12 } });
  const info = spring({ frame: frame - 50, fps, config: { damping: 18 } });
  const breathe = 1 + Math.sin(frame / 6) * 0.025;
  const strike = interpolate(frame, [26, 36], [0, 100], clamp);
  const tile: React.CSSProperties = {
    flex: 1,
    borderRadius: 30,
    padding: "26px 18px 24px",
    textAlign: "center",
    background: "white",
    boxShadow: "0 16px 40px rgba(11,26,58,0.14)",
  };
  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 40,
        background: "linear-gradient(180deg, #FFFFFF 0%, #F4F9FF 50%, #E3F0FF 100%)",
      }}
    >
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 26, background: BLUE }} />
      <div style={{ position: "absolute", top: 26, left: 0, right: 0, height: 10, background: GREEN }} />

      <div style={{ transform: `scale(${interpolate(logo, [0, 1], [0.6, 1])})`, opacity: logo }}>
        <Img src={staticFile("inversa-rx-optical-logo.png")} style={{ width: 760 }} />
      </div>

      {/* two offer tiles */}
      <div style={{ display: "flex", gap: 30, width: 960, marginTop: 56 }}>
        <div style={{ ...tile, border: `5px solid ${BLUE}`, transform: `scale(${tileA})` }}>
          <div style={{ position: "relative", display: "inline-block", color: RED, fontWeight: 800, fontSize: 50 }}>
            {p.examWas}
            <div
              style={{
                position: "absolute",
                left: -6,
                top: "52%",
                height: 6,
                width: `calc(${strike}% + 12px)`,
                background: RED,
                transform: "rotate(-8deg)",
              }}
            />
          </div>
          <div style={{ color: GREEN_DARK, fontWeight: 900, fontSize: 104, lineHeight: 1, letterSpacing: -2 }}>{p.examDeal}</div>
          <div style={{ color: NAVY, fontWeight: 800, fontSize: 38, marginTop: 10, lineHeight: 1.15 }}>{p.examCondition}*</div>
        </div>
        <div style={{ ...tile, border: `5px solid ${GREEN}`, transform: `scale(${tileB})` }}>
          <svg width="96" height="50" viewBox="0 0 96 50" style={{ marginTop: 6 }}>
            <rect x="4" y="8" width="36" height="30" rx="12" fill="none" stroke={GREEN_DARK} strokeWidth="7" />
            <rect x="56" y="8" width="36" height="30" rx="12" fill="none" stroke={GREEN_DARK} strokeWidth="7" />
            <path d="M40 18 Q48 10 56 18" fill="none" stroke={GREEN_DARK} strokeWidth="6" />
          </svg>
          <div style={{ color: GREEN_DARK, fontWeight: 900, fontSize: 96, lineHeight: 1, letterSpacing: -2 }}>{p.framesDeal}</div>
          <div style={{ color: NAVY, fontWeight: 800, fontSize: 38, marginTop: 10 }}>{p.framesCondition}</div>
        </div>
      </div>

      {/* benefits banner */}
      <div
        style={{
          marginTop: 30,
          width: 960,
          background: NAVY,
          color: "white",
          borderRadius: 30,
          padding: "26px 36px",
          display: "flex",
          alignItems: "center",
          gap: 26,
          opacity: ben,
          transform: `translateY(${interpolate(ben, [0, 1], [40, 0])}px)`,
        }}
      >
        <svg width="92" height="68" viewBox="0 0 92 68" style={{ flexShrink: 0 }}>
          <rect x="3" y="3" width="86" height="62" rx="10" fill={BLUE} />
          <rect x="3" y="16" width="86" height="12" fill={NAVY} />
          <rect x="12" y="40" width="34" height="8" rx="4" fill="white" />
          <circle cx="72" cy="47" r="10" fill={STAR} />
        </svg>
        <div>
          <div style={{ fontWeight: 900, fontSize: 44, color: GREEN }}>{p.benefits}</div>
          <div style={{ fontWeight: 500, fontSize: 32, marginTop: 6, lineHeight: 1.25, color: "rgba(255,255,255,0.88)" }}>
            {p.benefitsNote}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 40,
          background: BLUE,
          color: "white",
          fontWeight: 900,
          fontSize: 62,
          padding: "26px 64px",
          borderRadius: 999,
          transform: `scale(${btn * breathe})`,
          boxShadow: "0 18px 50px rgba(0,128,251,0.4)",
        }}
      >
        Stop in this week
      </div>

      <div
        style={{
          marginTop: 34,
          textAlign: "center",
          color: NAVY,
          opacity: info,
          transform: `translateY(${interpolate(info, [0, 1], [30, 0])}px)`,
        }}
      >
        <div style={{ fontWeight: 900, fontSize: 64, color: BLUE }}>{p.phone}</div>
        <div style={{ fontWeight: 800, fontSize: 42, marginTop: 8 }}>{p.address}</div>
        <div style={{ fontWeight: 600, fontSize: 32, color: "#4A5878", marginTop: 6 }}>
          {p.appointments} · {p.website}
        </div>
        <div style={{ fontWeight: 500, fontSize: 24, color: "#7A86A0", marginTop: 22, padding: "0 90px", lineHeight: 1.3 }}>
          *{p.finePrint}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/*  Composition                                                       */
/* ------------------------------------------------------------------ */

export const BreakingNews: React.FC<BreakingNewsProps> = (props) => {
  return (
    <AbsoluteFill style={{ background: NAVY }}>
      {/* News segment: background, live bug and optical ticker run until the reveal */}
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
        <Ticker {...props} />
      </Sequence>

      <Sequence from={T.ask} durationInFrames={T.cta - T.ask}>
        <Ask />
      </Sequence>
      <Sequence from={T.cta} durationInFrames={T.end - T.cta}>
        <Cta {...props} />
      </Sequence>

      {props.withAudio && <Audio src={staticFile("audio/breaking-news.wav")} />}
    </AbsoluteFill>
  );
};
