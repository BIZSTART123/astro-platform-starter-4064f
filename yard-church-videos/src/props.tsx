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
