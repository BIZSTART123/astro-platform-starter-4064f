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

/** Front of the church: platform floor for a standing song leader. */
export const Platform: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
      <rect x={0} y={1460} width={W} height={460} fill="#7a4a2a" />
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x={0} y={1470 + i * 50} width={W} height={4} fill="#5d351c" />
      ))}
      <rect x={0} y={1440} width={W} height={26} fill={C.mahoganyLight} />
    </svg>
  </AbsoluteFill>
);

/** Bright kids' church room with a TV, posters and beanbags. */
export const KidsRoom: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill>
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
      <rect width={W} height={H} fill="#ffe9a8" />
      <rect x={0} y={0} width={W} height={1200} fill="#9fd8ff" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={i} cx={80 + i * 190} cy={120} r={40} fill={["#ff6b6b", "#ffd93d", "#6bcB77", "#4d96ff", "#c77dff", "#ff9f43"][i]} />
      ))}
      {/* TV with a cartoon whale */}
      <rect x={140} y={260} width={520} height={330} rx={18} fill="#111" />
      <rect x={160} y={280} width={480} height={290} fill="#4d96ff" />
      <ellipse cx={400 + Math.sin(frame / 10) * 30} cy={440} rx={130} ry={70} fill="#2a5db0" />
      <circle cx={460 + Math.sin(frame / 10) * 30} cy={420} r={10} fill="#fff" />
      <path d={`M ${270 + Math.sin(frame / 10) * 30} 440 l -60 -40 l 0 80 Z`} fill="#2a5db0" />
      {/* door with window */}
      <rect x={760} y={260} width={240} height={780} fill="#f7f7f7" stroke="#d0d0d0" strokeWidth={10} />
      <rect x={800} y={320} width={160} height={240} fill="#cfe7ff" stroke="#bbb" strokeWidth={8} />
      <circle cx={790} cy={680} r={14} fill="#bbb" />
      {/* foam mat floor */}
      {Array.from({ length: 6 }).map((_, i) => (
        <rect key={i} x={i * 180} y={1200} width={180} height={720} fill={["#ff6b6b", "#ffd93d", "#6bcB77", "#4d96ff", "#c77dff", "#ff9f43"][i]} opacity={0.75} />
      ))}
    </svg>
  </AbsoluteFill>
);

/** The window in the kids' room door, drawn over anyone peeking through it. */
export const KidsDoorFrame: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
      <path d={`M 760 260 L 1000 260 L 1000 1040 L 760 1040 Z M 800 320 L 800 560 L 960 560 L 960 320 Z`} fill="#f7f7f7" fillRule="evenodd" />
      <rect x={800} y={320} width={160} height={240} fill="none" stroke="#bbb" strokeWidth={8} />
      <rect x={760} y={260} width={240} height={780} fill="none" stroke="#d0d0d0" strokeWidth={10} />
      <circle cx={790} cy={680} r={14} fill="#bbb" />
      <rect x={0} y={1040} width={1080} height={160} fill="#9fd8ff" />
    </svg>
  </AbsoluteFill>
);

/** Rural churchyard: sky, hills, mango tree, long table. */
export const Churchyard: React.FC<{ frame: number }> = ({ frame }) => {
  const sway = Math.sin(frame / 30) * 6;
  return (
    <AbsoluteFill>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7cc6f0" />
            <stop offset="1" stopColor="#fbe3a8" />
          </linearGradient>
        </defs>
        <rect width={W} height={H} fill="url(#sky)" />
        <path d="M 0 900 Q 270 760 540 880 Q 800 760 1080 870 L 1080 1100 L 0 1100 Z" fill="#5f9e5a" />
        <rect x={0} y={1050} width={W} height={870} fill="#7ab65f" />
        {/* church building */}
        <g>
          <rect x={620} y={640} width={360} height={380} fill="#f3efe4" />
          <polygon points="600,650 800,500 1000,650" fill="#b3261e" />
          <rect x={770} y={820} width={60} height={200} fill={C.mahogany} />
          <rect x={792} y={430} width={16} height={80} fill="#fff" />
          <rect x={776} y={450} width={48} height={14} fill="#fff" />
        </g>
        {/* mango tree */}
        <rect x={130} y={560} width={70} height={520} fill="#6b4226" />
        <g transform={`translate(${sway} 0)`}>
          <circle cx={170} cy={480} r={240} fill="#2f7d3a" />
          <circle cx={330} cy={560} r={170} fill="#3b8f45" />
          <circle cx={30} cy={580} r={160} fill="#3b8f45" />
          {[[120, 520], [260, 600], [60, 640], [210, 420], [340, 500]].map(([x, y], i) => (
            <ellipse key={i} cx={x} cy={y} rx={18} ry={24} fill="#f2a33a" />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/** Long table with cloth and steaming pots, drawn in front of the people. */
export const YardTable: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
      <rect x={-20} y={1360} width={W + 40} height={60} fill="#fff" />
      <path d={`M -20 1420 ${Array.from({ length: 12 }).map((_, i) => `L ${i * 100 + 50} 1450 L ${i * 100 + 100} 1420`).join(" ")} L ${W + 20} 1420 L ${W + 20} 1600 L -20 1600 Z`} fill="#fff" />
      <rect x={-20} y={1420} width={W + 40} height={8} fill="#d63c3c" />
      <rect x={-20} y={1600} width={W + 40} height={320} fill="#6aa755" />
      {[140, 900].map((x, i) => (
        <g key={x}>
          {[0, 1, 2].map((k) => (
            <path key={k} d={`M ${x - 30 + k * 30} 1250 q -14 -20 0 -40 q 14 -20 0 -40`} stroke="#fff" strokeWidth={8} fill="none"
              opacity={0.3 + 0.3 * Math.abs(Math.sin(frame / 12 + k + i))} />
          ))}
          <ellipse cx={x} cy={1270} rx={110} ry={20} fill="#aab2ba" />
          <path d={`M ${x - 110} 1272 L ${x - 96} 1370 Q ${x} 1392 ${x + 96} 1370 L ${x + 110} 1272 Z`} fill="#c3cad1" stroke="#8b939b" strokeWidth={4} />
        </g>
      ))}
    </svg>
  </AbsoluteFill>
);

/** Church lobby café with a coffee bar and rainy glass doors. */
export const Lobby: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill>
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
      <rect width={W} height={H} fill="#dfe3e6" />
      {/* glass doors with rain */}
      <rect x={60} y={300} width={420} height={900} fill="#5d6b78" />
      {Array.from({ length: 40 }).map((_, i) => {
        const x = 70 + ((i * 97) % 400);
        const y = 300 + ((i * 211 + frame * 22) % 900);
        return <rect key={i} x={x} y={y} width={3} height={40} fill="#c9d6e2" opacity={0.6} />;
      })}
      <rect x={60} y={300} width={420} height={900} fill="none" stroke="#2b2f33" strokeWidth={16} />
      <rect x={264} y={300} width={12} height={900} fill="#2b2f33" />
      <text x={270} y={270} fontSize={40} textAnchor="middle" fill="#2b2f33" fontFamily="Inter, sans-serif" fontWeight={700}>EXIT</text>
      {/* coffee bar */}
      <rect x={560} y={240} width={480} height={300} rx={12} fill="#2b2f33" />
      <text x={800} y={300} fontSize={40} textAnchor="middle" fill="#fff" fontFamily="Inter, sans-serif" fontWeight={700}>CONNECT CAFÉ</text>
      {[["LATTE", "6.50"], ["OAT FLAT WHITE", "7.25"], ["COLD BREW", "6.75"]].map(([n, p], i) => (
        <g key={n}>
          <text x={600} y={370 + i * 50} fontSize={30} fill="#e6e6e6" fontFamily="Inter, sans-serif">{n}</text>
          <text x={1000} y={370 + i * 50} fontSize={30} fill="#e6e6e6" textAnchor="end" fontFamily="Inter, sans-serif">{p}</text>
        </g>
      ))}
      <rect x={540} y={1180} width={540} height={60} fill="#c7b299" />
      <rect x={540} y={1240} width={540} height={680} fill="#8e7a64" />
      <rect x={0} y={1240} width={540} height={680} fill="#b9c0c6" />
      {/* espresso machine */}
      <rect x={880} y={1040} width={160} height={140} rx={10} fill="#a9b1b8" />
      <rect x={900} y={1070} width={120} height={40} rx={6} fill="#2b2f33" />
    </svg>
  </AbsoluteFill>
);

/** Front counter of the lobby café, drawn over the barista. */
export const LobbyCounter: React.FC = () => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
      <rect x={540} y={1180} width={540} height={60} fill="#c7b299" />
      <rect x={540} y={1240} width={540} height={680} fill="#8e7a64" />
    </svg>
  </AbsoluteFill>
);
