import React from "react";
import { AbsoluteFill } from "remotion";
import { C, H, W } from "./theme";

/** Small Jamaican church: pastel walls, louvre windows, sun shafts, hymn board. */
export const OldChurch: React.FC<{ frame: number }> = ({ frame }) => {
  const drift = Math.sin(frame / 40) * 0.04;
  return (
    <AbsoluteFill>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
        <defs>
          <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#cfe3d4" />
            <stop offset="1" stopColor={C.wallShade} />
          </linearGradient>
          <linearGradient id="shaft" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.sun} stopOpacity={0.55} />
            <stop offset="1" stopColor={C.sun} stopOpacity={0} />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#wall)" />
        {/* ceiling beam and fan */}
        <rect x={0} y={0} width={W} height={70} fill={C.mahogany} />
        <rect x={536} y={70} width={8} height={90} fill="#444" />
        <g transform={`translate(540 165) rotate(${frame * 9})`}>
          <rect x={-190} y={-10} width={380} height={20} rx={10} fill="#5a4a3a" />
          <rect x={-10} y={-190} width={20} height={380} rx={10} fill="#5a4a3a" opacity={0.25} />
        </g>
        <circle cx={540} cy={165} r={22} fill="#3d3128" />
        {/* louvre windows */}
        {[90, 750].map((x) => (
          <g key={x}>
            <rect x={x} y={260} width={240} height={420} fill="#fff7dd" stroke="#f3f3ee" strokeWidth={18} />
            {Array.from({ length: 11 }).map((_, i) => (
              <rect key={i} x={x + 8} y={272 + i * 37} width={224} height={14} fill="#8ab49a" />
            ))}
          </g>
        ))}
        {/* sun shafts */}
        <g opacity={0.8 + drift}>
          <polygon points="90,300 330,300 620,1500 200,1500" fill="url(#shaft)" />
          <polygon points="750,300 990,300 1080,1300 900,1500" fill="url(#shaft)" />
        </g>
        {/* cross and hymn board */}
        <g>
          <rect x={522} y={300} width={36} height={260} fill={C.mahoganyLight} />
          <rect x={460} y={360} width={160} height={36} fill={C.mahoganyLight} />
        </g>
        <g>
          <rect x={430} y={600} width={220} height={260} rx={8} fill={C.mahogany} />
          <text x={540} y={648} fontSize={30} fill={C.gold} textAnchor="middle" fontFamily="serif" fontWeight={700}>HYMNS</text>
          {["312", "45", "8"].map((n, i) => (
            <g key={n}>
              <rect x={460} y={672 + i * 60} width={160} height={46} fill="#fbf3dc" />
              <text x={540} y={706 + i * 60} fontSize={34} fill="#222" textAnchor="middle" fontFamily="serif" fontWeight={700}>{n}</text>
            </g>
          ))}
        </g>
        {/* back pews */}
        {[0, 1].map((r) => (
          <g key={r} opacity={0.55 + r * 0.2}>
            <rect x={-20} y={920 + r * 70} width={W + 40} height={46} rx={10} fill={C.mahoganyLight} />
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

/** The pew in front of the seated characters. Drawn over them. */
export const PewFront: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
      <rect x={-20} y={1390} width={W + 40} height={60} rx={14} fill={C.mahoganyLight} />
      <rect x={-20} y={1440} width={W + 40} height={480} fill={C.mahogany} />
      <rect x={-20} y={1440} width={W + 40} height={10} fill="#4d200b" />
      <rect x={-20} y={1398} width={W + 40} height={8} fill="#b0623a" opacity={0.7} />
    </svg>
  </AbsoluteFill>
);

/** Dark modern auditorium with haze beams and an LED wall. */
export const Auditorium: React.FC<{ frame: number; children?: React.ReactNode }> = ({ frame, children }) => {
  const sweep = Math.sin(frame / 35) * 60;
  return (
    <AbsoluteFill style={{ background: C.nowBg }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ position: "absolute" }}>
        <defs>
          <radialGradient id="glow" cx="0.5" cy="0.25" r="0.7">
            <stop offset="0" stopColor="#3b33a6" />
            <stop offset="0.5" stopColor="#15123a" />
            <stop offset="1" stopColor="#06060e" />
          </radialGradient>
          <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.violet} stopOpacity={0.5} />
            <stop offset="1" stopColor={C.violet} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="beam2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.blue} stopOpacity={0.4} />
            <stop offset="1" stopColor={C.blue} stopOpacity={0} />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#glow)" />
        <polygon points={`180,0 260,0 ${560 + sweep},1500 ${300 + sweep},1500`} fill="url(#beam)" />
        <polygon points={`820,0 900,0 ${780 - sweep},1500 ${520 - sweep},1500`} fill="url(#beam2)" />
        {/* LED wall frame */}
        <rect x={70} y={170} width={940} height={620} rx={16} fill="#000" stroke="#24224a" strokeWidth={10} />
        {/* stage edge */}
        <rect x={0} y={860} width={W} height={18} fill="#1f1c4a" />
        <rect x={0} y={878} width={W} height={60} fill="#0a0918" />
        {[140, 340, 540, 740, 940].map((x) => (
          <circle key={x} cx={x} cy={870} r={6} fill={C.blue} opacity={0.8} />
        ))}
      </svg>
      {children}
    </AbsoluteFill>
  );
};
