import React from "react";
import { C } from "./theme";

/**
 * Flat cartoon characters, drawn seated from the waist up.
 * Each is a 400 x 700 SVG; the scene places and scales it.
 */

type Face = {
  /** Pupils look left (-1) to right (1). */
  look?: number;
  /** Raise the left / right eyebrow, 0 to 1. */
  browL?: number;
  browR?: number;
  /** 0 = flat line, 1 = big smile, -1 = frown. */
  smile?: number;
  /** 0 = closed, 1 = open (talking). */
  talk?: number;
  /** 0 = open eyes, 1 = narrowed side-eye. */
  squint?: number;
};

const Eyes: React.FC<Face & { cx: number; cy: number; gap: number; r: number }> = ({
  cx, cy, gap, r, look = 0, squint = 0,
}) => {
  const lidH = r * 2 * squint * 0.55;
  return (
    <g>
      {[-1, 1].map((s) => (
        <g key={s}>
          <ellipse cx={cx + s * gap} cy={cy} rx={r} ry={r * 0.9} fill="#fff" />
          <circle cx={cx + s * gap + look * r * 0.45} cy={cy + 2} r={r * 0.5} fill="#1b120c" />
          <rect x={cx + s * gap - r - 2} y={cy - r - 2} width={r * 2 + 4} height={lidH + 2} fill="currentColor" />
        </g>
      ))}
    </g>
  );
};

const Brows: React.FC<{ cx: number; cy: number; gap: number; w: number; l: number; r: number; color: string }> = ({
  cx, cy, gap, w, l, r, color,
}) => (
  <g stroke={color} strokeWidth={9} strokeLinecap="round" fill="none">
    <path d={`M ${cx - gap - w / 2} ${cy - l * 18 + 4} Q ${cx - gap} ${cy - 12 - l * 22} ${cx - gap + w / 2} ${cy - l * 10}`} />
    <path d={`M ${cx + gap - w / 2} ${cy - r * 10} Q ${cx + gap} ${cy - 12 - r * 22} ${cx + gap + w / 2} ${cy - r * 18 + 4}`} />
  </g>
);

const Mouth: React.FC<{ cx: number; cy: number; w: number; smile: number; talk: number; lip: string }> = ({
  cx, cy, w, smile, talk, lip,
}) => {
  if (talk > 0.05) {
    return <ellipse cx={cx} cy={cy + 4} rx={w * 0.32} ry={4 + talk * 16} fill="#3a1208" stroke={lip} strokeWidth={5} />;
  }
  const curve = smile * 18;
  return (
    <path
      d={`M ${cx - w / 2} ${cy} Q ${cx} ${cy + curve} ${cx + w / 2} ${cy}`}
      stroke={lip}
      strokeWidth={8}
      strokeLinecap="round"
      fill="none"
    />
  );
};

export const MotherBrown: React.FC<Face & { outfit?: "white" | "coat"; fan?: number; showFan?: boolean }> = ({
  outfit = "white", fan = 0, showFan = true, browL = 0, browR = 0, smile = 0, talk = 0, look = 0, squint = 0,
}) => {
  const skin = C.skinMid;
  const dress = outfit === "white" ? C.white : "#5b2a6e";
  return (
    <svg viewBox="0 0 400 700" width="100%" height="100%" style={{ overflow: "visible", color: skin }}>
      {/* body */}
      <path d="M 70 700 L 90 470 Q 200 410 310 470 L 330 700 Z" fill={dress} />
      {outfit === "white" ? (
        <g fill="#fff" stroke="#e3dccd" strokeWidth={3}>
          {[150, 175, 200, 225, 250].map((x) => <circle key={x} cx={x} cy={455} r={16} />)}
        </g>
      ) : (
        <path d="M 200 445 L 170 560 M 200 445 L 230 560" stroke="#3e1b4c" strokeWidth={10} />
      )}
      {/* gold brooch */}
      <circle cx={200} cy={490} r={11} fill={C.gold} />
      {/* neck */}
      <rect x={172} y={370} width={56} height={80} fill={skin} />
      {/* head */}
      <ellipse cx={200} cy={300} rx={98} ry={112} fill={skin} />
      {/* earrings */}
      <circle cx={102} cy={330} r={10} fill={C.gold} />
      <circle cx={298} cy={330} r={10} fill={C.gold} />
      {/* hat */}
      <ellipse cx={200} cy={214} rx={196} ry={36} fill={outfit === "white" ? "#fff" : "#7d3a92"} stroke="#d9d2c4" strokeWidth={3} />
      <path d="M 100 214 Q 104 104 200 100 Q 296 104 300 214 Z" fill={outfit === "white" ? "#fff" : "#7d3a92"} />
      <rect x={100} y={186} width={200} height={26} fill={C.mahogany} />
      <circle cx={282} cy={198} r={20} fill={C.gold} />
      {/* face */}
      <Eyes cx={200} cy={295} gap={40} r={17} look={look} squint={squint} />
      {/* glasses */}
      <g stroke={C.gold} strokeWidth={6} fill="rgba(255,255,255,0.12)">
        <rect x={136} y={268} width={56} height={52} rx={14} />
        <rect x={208} y={268} width={56} height={52} rx={14} />
        <path d="M 192 290 L 208 290" />
      </g>
      <path d="M 136 300 Q 110 380 140 440" stroke={C.gold} strokeWidth={3} fill="none" />
      <path d="M 264 300 Q 290 380 260 440" stroke={C.gold} strokeWidth={3} fill="none" />
      <Brows cx={200} cy={255} gap={40} w={46} l={browL} r={browR} color={C.hair} />
      <path d="M 192 310 Q 200 336 210 330" stroke="#4c2a17" strokeWidth={5} fill="none" strokeLinecap="round" />
      <Mouth cx={200} cy={362} w={56} smile={smile} talk={talk} lip="#4c2213" />
      {/* arm + fan */}
      {showFan && (
        <g transform="translate(-30 90)"><g style={{ transformOrigin: "110px 600px", rotate: `${fan}deg` }}>
          <path d="M 80 640 Q 70 560 110 540" stroke={dress} strokeWidth={46} strokeLinecap="round" fill="none" />
          <circle cx={112} cy={538} r={22} fill={skin} />
          <rect x={106} y={470} width={10} height={70} fill="#c9b48a" />
          <rect x={52} y={370} width={120} height={110} rx={20} fill="#f2e3b3" stroke="#c9a85a" strokeWidth={4} />
          <text x={112} y={420} fontSize={22} textAnchor="middle" fill={C.mahogany} fontFamily="serif" fontWeight={700}>JESUS</text>
          <text x={112} y={448} fontSize={18} textAnchor="middle" fill={C.mahogany} fontFamily="serif">SAVES</text>
        </g></g>
      )}
    </svg>
  );
};

export const Junior: React.FC<Face & { outfit?: "sunday" | "hoodie" }> = ({
  outfit = "sunday", browL = 0, browR = 0, smile = 0, talk = 0, look = 0, squint = 0,
}) => {
  const skin = C.skinDeep;
  return (
    <svg viewBox="0 0 400 700" width="100%" height="100%" style={{ overflow: "visible", color: skin }}>
      {outfit === "sunday" ? (
        <g>
          <path d="M 80 700 L 95 480 Q 200 430 305 480 L 320 700 Z" fill="#fff" />
          <path d="M 200 470 L 186 500 L 200 640 L 214 500 Z" fill="#b3261e" />
          <path d="M 150 455 L 200 478 L 250 455 L 240 440 L 160 440 Z" fill="#fff" stroke="#ddd" strokeWidth={3} />
        </g>
      ) : (
        <g>
          <path d="M 70 700 L 85 480 Q 200 420 315 480 L 330 700 Z" fill="#6f7782" />
          <path d="M 120 470 Q 200 520 280 470 Q 260 430 200 430 Q 140 430 120 470 Z" fill="#5b626c" />
          <path d="M 180 500 L 176 560 M 220 500 L 224 560" stroke="#dfe3e8" strokeWidth={6} strokeLinecap="round" />
        </g>
      )}
      <rect x={176} y={370} width={48} height={80} fill={skin} />
      <ellipse cx={200} cy={295} rx={92} ry={106} fill={skin} />
      <ellipse cx={108} cy={305} rx={16} ry={24} fill={skin} />
      <ellipse cx={292} cy={305} rx={16} ry={24} fill={skin} />
      {/* hair: neat low cut */}
      <path d="M 110 268 Q 108 186 200 182 Q 292 186 290 268 Q 270 222 200 220 Q 130 222 110 268 Z" fill={C.hair} />
      <Eyes cx={200} cy={295} gap={38} r={16} look={look} squint={squint} />
      <Brows cx={200} cy={260} gap={38} w={42} l={browL} r={browR} color={C.hair} />
      <path d="M 194 310 Q 200 332 210 326" stroke="#2e180c" strokeWidth={5} fill="none" strokeLinecap="round" />
      <Mouth cx={200} cy={355} w={52} smile={smile} talk={talk} lip="#2e1208" />
    </svg>
  );
};

/** Standing usher in a dark suit with white gloves. 300 x 900. */
export const Usher: React.FC<{ step?: number }> = ({ step = 0 }) => {
  const skin = C.skinWarm;
  const bob = Math.sin(step * Math.PI * 2) * 6;
  return (
    <svg viewBox="0 0 300 900" width="100%" height="100%" style={{ overflow: "visible" }}>
      <g transform={`translate(0 ${bob})`}>
        <path d="M 40 900 L 55 330 Q 150 280 245 330 L 260 900 Z" fill="#1f2433" />
        <path d="M 150 320 L 120 440 L 150 560 L 180 440 Z" fill="#fff" />
        <path d="M 150 340 L 140 360 L 150 470 L 160 360 Z" fill="#2c4a8a" />
        <rect x={128} y={230} width={44} height={90} fill={skin} />
        <ellipse cx={150} cy={190} rx={80} ry={92} fill={skin} />
        <path d="M 74 170 Q 76 96 150 94 Q 224 96 226 170 Q 210 130 150 128 Q 90 130 74 170 Z" fill="#2a2a2a" />
        <path d="M 74 150 Q 70 120 90 110" stroke="#9a9a9a" strokeWidth={6} fill="none" />
        <g fill="#fff"><circle cx={124} cy={190} r={13} /><circle cx={176} cy={190} r={13} /></g>
        <g fill="#1b120c"><circle cx={128} cy={192} r={7} /><circle cx={172} cy={192} r={7} /></g>
        <path d="M 110 162 L 138 158 M 162 158 L 190 162" stroke="#1a1a1a" strokeWidth={7} strokeLinecap="round" />
        <path d="M 128 246 Q 150 256 172 246" stroke="#3a1a0c" strokeWidth={7} fill="none" strokeLinecap="round" />
        <path d="M 120 236 Q 150 228 180 236" stroke="#d8d8d8" strokeWidth={8} fill="none" strokeLinecap="round" />
        <path d="M 60 420 Q 20 520 60 560" stroke="#1f2433" strokeWidth={44} fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
};

/** Head-and-shoulders silhouette for the crowd. */
export const Silhouette: React.FC<{ color: string; variant?: number }> = ({ color, variant = 0 }) => (
  <svg viewBox="0 0 200 260" width="100%" height="100%" style={{ overflow: "visible" }}>
    <path d="M 10 260 Q 20 170 100 160 Q 180 170 190 260 Z" fill={color} />
    <ellipse cx={100} cy={100} rx={56 + (variant % 3) * 4} ry={66} fill={color} />
    {variant % 2 === 0 && <ellipse cx={100} cy={52} rx={60} ry={30} fill={color} />}
  </svg>
);

export const PastorJordan: React.FC<{ talk?: number; arms?: number }> = ({ talk = 0, arms = 0 }) => {
  const skin = C.skinWarm;
  return (
    <svg viewBox="0 0 400 600" width="100%" height="100%" style={{ overflow: "visible", color: skin }}>
      {/* arms open */}
      <g stroke="#111" strokeWidth={40} strokeLinecap="round" fill="none">
        <path d={`M 110 420 Q ${60 - arms * 30} ${360 - arms * 80} ${40 - arms * 20} ${300 - arms * 120}`} />
        <path d={`M 290 420 Q ${340 + arms * 30} ${360 - arms * 80} ${360 + arms * 20} ${300 - arms * 120}`} />
      </g>
      <circle cx={40 - arms * 20} cy={300 - arms * 120} r={20} fill={skin} />
      <circle cx={360 + arms * 20} cy={300 - arms * 120} r={20} fill={skin} />
      <path d="M 90 600 L 105 400 Q 200 350 295 400 L 310 600 Z" fill="#111" />
      <path d="M 170 380 L 200 440 L 230 380 Z" fill="#fff" />
      <rect x={178} y={300} width={44} height={70} fill={skin} />
      <ellipse cx={200} cy={230} rx={82} ry={96} fill={skin} />
      <path d="M 120 210 Q 122 130 200 128 Q 278 130 280 210 Q 262 170 200 168 Q 138 170 120 210 Z" fill={C.hair} />
      <path d="M 132 270 Q 200 340 268 270 Q 262 310 200 318 Q 138 310 132 270 Z" fill={C.hair} />
      <g fill="#fff"><circle cx={168} cy={228} r={13} /><circle cx={232} cy={228} r={13} /></g>
      <g fill="#1b120c"><circle cx={168} cy={230} r={7} /><circle cx={232} cy={230} r={7} /></g>
      {talk > 0.05
        ? <ellipse cx={200} cy={282} rx={20} ry={6 + talk * 12} fill="#3a1208" />
        : <path d="M 176 280 Q 200 298 224 280" stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" />}
      {/* headset mic */}
      <path d="M 120 240 Q 130 290 176 296" stroke="#d9d9d9" strokeWidth={4} fill="none" />
      <circle cx={178} cy={296} r={6} fill="#d9d9d9" />
    </svg>
  );
};
