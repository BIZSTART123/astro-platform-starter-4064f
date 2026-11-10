import React from "react";
import { C } from "./theme";

export const Plate: React.FC = () => (
  <svg viewBox="0 0 240 90" width="100%" height="100%" style={{ overflow: "visible" }}>
    <ellipse cx={120} cy={50} rx={118} ry={38} fill={C.mahoganyLight} stroke="#4d200b" strokeWidth={4} />
    <ellipse cx={120} cy={44} rx={92} ry={26} fill="#8e1f1f" />
    <circle cx={96} cy={42} r={10} fill="#c8a24a" />
    <circle cx={140} cy={48} r={9} fill="#b9b9b9" />
  </svg>
);

/** A hand coming up from below holding a coin or a folded note. */
export const MoneyHand: React.FC<{ item: "coin" | "note" | "none" }> = ({ item }) => (
  <svg viewBox="0 0 120 220" width="100%" height="100%" style={{ overflow: "visible" }}>
    <rect x={38} y={90} width={44} height={140} fill="#fff" />
    <ellipse cx={60} cy={80} rx={40} ry={44} fill={C.skinDeep} />
    <rect x={30} y={30} width={14} height={40} rx={7} fill={C.skinDeep} />
    {item === "coin" && <circle cx={60} cy={34} r={18} fill="#c8a24a" stroke="#8a6a1e" strokeWidth={4} />}
    {item === "note" && (
      <g>
        <rect x={20} y={8} width={80} height={44} rx={4} fill="#7fae7a" stroke="#4d7a49" strokeWidth={3} />
        <text x={60} y={38} fontSize={20} textAnchor="middle" fill="#2c4a2a" fontWeight={700}>$1000</text>
      </g>
    )}
  </svg>
);

export const Coin: React.FC = () => (
  <svg viewBox="0 0 40 40" width="100%" height="100%"><circle cx={20} cy={20} r={17} fill="#c8a24a" stroke="#8a6a1e" strokeWidth={4} /></svg>
);

export const Note: React.FC = () => (
  <svg viewBox="0 0 90 50" width="100%" height="100%">
    <rect x={2} y={2} width={86} height={46} rx={4} fill="#7fae7a" stroke="#4d7a49" strokeWidth={3} />
    <text x={45} y={33} fontSize={20} textAnchor="middle" fill="#2c4a2a" fontWeight={700}>$1000</text>
  </svg>
);

/** A fake (non-scannable) QR pattern from a fixed seed. */
export const FakeQR: React.FC<{ size: number }> = ({ size }) => {
  const n = 25;
  const cell = size / n;
  let s = 7;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const cells: React.ReactNode[] = [];
  const finder = (x: number, y: number) =>
    (x >= 0 && x < 7 && y >= 0 && y < 7) ? true : false;
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const inFinder = finder(x, y) || finder(x - (n - 7), y) || finder(x, y - (n - 7));
      if (inFinder) continue;
      if (rnd() > 0.52) cells.push(<rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell} height={cell} fill="#000" />);
    }
  }
  const F = ({ x, y }: { x: number; y: number }) => (
    <g>
      <rect x={x * cell} y={y * cell} width={7 * cell} height={7 * cell} fill="#000" />
      <rect x={(x + 1) * cell} y={(y + 1) * cell} width={5 * cell} height={5 * cell} fill="#fff" />
      <rect x={(x + 2) * cell} y={(y + 2) * cell} width={3 * cell} height={3 * cell} fill="#000" />
    </g>
  );
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <rect width={size} height={size} fill="#fff" />
      {cells}
      <F x={0} y={0} /><F x={n - 7} y={0} /><F x={0} y={n - 7} />
    </svg>
  );
};

/** Phone held up, with its screen content passed in. 220 x 420. */
export const Phone: React.FC<{ glow?: number; children?: React.ReactNode }> = ({ glow = 1, children }) => (
  <div style={{ width: "100%", height: "100%", borderRadius: 34, background: "#111", padding: 12,
    boxShadow: `0 0 ${60 * glow}px rgba(140,180,255,${0.6 * glow})` }}>
    <div style={{ width: "100%", height: "100%", borderRadius: 24, background: "#eef1ff", overflow: "hidden",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
      {children}
    </div>
  </div>
);

export const Tambourine: React.FC = () => (
  <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ overflow: "visible" }}>
    <circle cx={100} cy={100} r={84} fill="#f5e7c4" stroke="#b5651d" strokeWidth={18} />
    {Array.from({ length: 8 }).map((_, i) => {
      const a = (i / 8) * Math.PI * 2;
      return <ellipse key={i} cx={100 + Math.cos(a) * 92} cy={100 + Math.sin(a) * 92} rx={16} ry={10} fill="#d8d8d8" stroke="#999" strokeWidth={3} />;
    })}
    <path d="M 70 40 L 130 40" stroke="#b3261e" strokeWidth={10} strokeLinecap="round" />
  </svg>
);

export const DrumKit: React.FC<{ hit?: number }> = ({ hit = 0 }) => (
  <svg viewBox="0 0 420 300" width="100%" height="100%" style={{ overflow: "visible" }}>
    <ellipse cx={90} cy={60 - hit * 6} rx={70} ry={12} fill="#e0a43a" />
    <rect x={86} y={60} width={8} height={200} fill="#888" />
    <rect x={130} y={120} width={170} height={170} rx={80} fill="#9b1c1c" stroke="#ddd" strokeWidth={8} />
    <circle cx={215} cy={205} r={50} fill="#f2f2f2" opacity={0.85} />
    <rect x={300} y={120} width={100} height={60} rx={14} fill="#9b1c1c" stroke="#ddd" strokeWidth={6} />
    <ellipse cx={350} cy={118} rx={50} ry={10} fill="#eee" />
  </svg>
);

export const Hymnal: React.FC<{ open?: number }> = ({ open = 0 }) => (
  <svg viewBox="0 0 160 120" width="100%" height="100%" style={{ overflow: "visible" }}>
    <rect x={10} y={20} width={140} height={90} rx={6} fill="#5a1a1a" />
    <rect x={80 - open * 70} y={24} width={open * 70 + 4} height={82} fill="#fbf3dc" />
    <text x={80} y={75} fontSize={20} textAnchor="middle" fill={C.gold} fontFamily="serif" opacity={1 - open}>HYMNS</text>
  </svg>
);

export const Clock: React.FC<{ minutes: number }> = ({ minutes }) => {
  const m = (minutes % 60) * 6;
  const h = (minutes / 60) * 30;
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%">
      <circle cx={60} cy={60} r={54} fill="#fff" stroke={C.mahogany} strokeWidth={8} />
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={58} y={12} width={4} height={10} fill="#333" transform={`rotate(${i * 30} 60 60)`} />
      ))}
      <rect x={57} y={30} width={6} height={32} rx={3} fill="#222" transform={`rotate(${h} 60 60)`} />
      <rect x={58} y={16} width={4} height={46} rx={2} fill="#b3261e" transform={`rotate(${m} 60 60)`} />
      <circle cx={60} cy={60} r={6} fill="#222" />
    </svg>
  );
};

export const Hanky: React.FC = () => (
  <svg viewBox="0 0 120 120" width="100%" height="100%" style={{ overflow: "visible" }}>
    <path d="M 20 20 Q 60 0 100 20 Q 120 60 100 100 Q 60 120 20 100 Q 0 60 20 20 Z" fill="#fff" stroke="#ddd" strokeWidth={4} />
  </svg>
);

export const ChurchHat: React.FC<{ color?: string }> = ({ color = "#fff" }) => (
  <svg viewBox="0 0 400 140" width="100%" height="100%" style={{ overflow: "visible" }}>
    <ellipse cx={200} cy={110} rx={196} ry={30} fill={color} stroke="#d9d2c4" strokeWidth={3} />
    <path d="M 100 110 Q 104 6 200 2 Q 296 6 300 110 Z" fill={color} />
    <rect x={100} y={82} width={200} height={26} fill={C.mahogany} />
    <circle cx={282} cy={94} r={20} fill={C.gold} />
  </svg>
);

export const DutchPot: React.FC<{ steam?: number }> = ({ steam = 0 }) => (
  <svg viewBox="0 0 300 260" width="100%" height="100%" style={{ overflow: "visible" }}>
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M ${100 + i * 50} ${70 - (steam % 1) * 30} q -20 -30 0 -60 q 20 -30 0 -60`} stroke="#fff" strokeWidth={10}
        strokeLinecap="round" fill="none" opacity={0.25 + 0.35 * Math.abs(Math.sin(steam * 3 + i))} />
    ))}
    <ellipse cx={150} cy={96} rx={130} ry={24} fill="#aab2ba" />
    <path d="M 20 100 L 36 230 Q 150 262 264 230 L 280 100 Z" fill="#c3cad1" stroke="#8b939b" strokeWidth={5} />
    <rect x={0} y={120} width={30} height={22} rx={8} fill="#2a2a2a" />
    <rect x={270} y={120} width={30} height={22} rx={8} fill="#2a2a2a" />
    <ellipse cx={150} cy={86} rx={40} ry={12} fill="#2a2a2a" />
  </svg>
);

export const PaperCup: React.FC = () => (
  <svg viewBox="0 0 120 160" width="100%" height="100%">
    <path d="M 20 20 L 100 20 L 90 156 L 30 156 Z" fill="#f4efe6" stroke="#cfc7b8" strokeWidth={4} />
    <rect x={14} y={10} width={92} height={18} rx={6} fill="#3a3a3a" />
    <rect x={26} y={70} width={68} height={40} fill="#6b4a33" />
  </svg>
);

export const Plateful: React.FC = () => (
  <svg viewBox="0 0 260 120" width="100%" height="100%" style={{ overflow: "visible" }}>
    <ellipse cx={130} cy={80} rx={126} ry={36} fill="#fff" stroke="#ddd" strokeWidth={4} />
    <ellipse cx={100} cy={60} rx={70} ry={34} fill="#8a4a2e" />
    {Array.from({ length: 14 }).map((_, i) => (
      <circle key={i} cx={60 + (i * 37) % 90} cy={44 + (i * 23) % 40} r={6} fill="#5a2216" />
    ))}
    <ellipse cx={180} cy={52} rx={46} ry={30} fill="#7a3a12" />
    <ellipse cx={190} cy={86} rx={40} ry={14} fill="#e8b23a" />
  </svg>
);
