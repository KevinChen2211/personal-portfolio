import { useId } from "react";
import type { Country } from "../data/travel";

const INKS = ["#2F4A6B", "#8A3B32", "#3E5B47", "#6E5233", "#5B3F5E", "#2C2C2C"];
const SHAPES = ["circle", "rect", "oval", "octagon"] as const;

// Stable per country, so a stamp keeps its ink, shape and tilt between renders
// and builds instead of reshuffling.
export function seeded(slug: string, salt = 0): number {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

// Ink texture every stamp points at; render once per page.
export function StampInk() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <filter id="passport-ink">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="4" result="grain" />
        <feDisplacementMap in="SourceGraphic" in2="grain" scale="2.4" xChannelSelector="R" yChannelSelector="G" result="rough" />
        <feTurbulence type="fractalNoise" baseFrequency="0.35" numOctaves="2" seed="11" result="patches" />
        <feColorMatrix in="patches" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.4 1.75" result="coverage" />
        <feComposite in="rough" in2="coverage" operator="in" />
      </filter>
    </svg>
  );
}

// Largest font size (up to `max`) at which `text` fits in `width` viewBox units.
function fit(text: string, max: number, width: number, spacing: number) {
  return Math.min(max, width / (text.length * (0.66 + spacing / max)));
}

export default function Stamp({ country }: { country: Country }) {
  const pathId = `arc-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const ink = INKS[Math.floor(seeded(country.slug, 1) * INKS.length)];
  const shape = country.home
    ? "rect"
    : SHAPES[Math.floor(seeded(country.slug, 2) * SHAPES.length)];
  const word = country.home ? "HOME" : "ADMITTED";
  const name = country.name.toUpperCase();
  const text = {
    fill: ink,
    fontFamily: "var(--font-sweet), var(--font-sans), sans-serif",
  } as const;

  return (
    <svg viewBox="0 0 200 150" className="w-full h-auto overflow-visible" aria-hidden="true">
      <g filter="url(#passport-ink)" style={{ mixBlendMode: "multiply" }}>
        {shape === "circle" && (
          <>
            <circle cx="100" cy="75" r="66" fill="none" stroke={ink} strokeWidth="3.5" />
            <circle cx="100" cy="75" r="56" fill="none" stroke={ink} strokeWidth="1.2" />
            {/* Baseline well inside the inner ring, so the letters don't run over it. */}
            <path id={pathId} d="M 57 75 A 43 43 0 0 1 143 75" fill="none" />
            <text {...text} fontSize="11" letterSpacing="3">
              <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">
                {word}
              </textPath>
            </text>
            <text {...text} x="100" y="88" fontSize="32" textAnchor="middle" letterSpacing="2">
              {country.code}
            </text>
            <text {...text} x="100" y="110" fontSize={fit(name, 11, 84, 2)} textAnchor="middle" letterSpacing="2">
              {name}
            </text>
          </>
        )}
        {shape === "rect" && (
          <>
            <rect x="12" y="22" width="176" height="106" rx="8" fill="none" stroke={ink} strokeWidth="3.5" />
            <rect x="20" y="30" width="160" height="90" rx="4" fill="none" stroke={ink} strokeWidth="1.2" />
            <text {...text} x="100" y="52" fontSize="11" textAnchor="middle" letterSpacing="4">
              {word}
            </text>
            <text {...text} x="100" y="85" fontSize={fit(name, 26, 146, 2)} textAnchor="middle" letterSpacing="2">
              {name}
            </text>
            <line x1="40" y1="95" x2="160" y2="95" stroke={ink} strokeWidth="1" />
            <text {...text} x="100" y="112" fontSize="11" textAnchor="middle" letterSpacing="4">
              {country.code}
            </text>
          </>
        )}
        {shape === "oval" && (
          <>
            <ellipse cx="100" cy="75" rx="92" ry="58" fill="none" stroke={ink} strokeWidth="3" strokeDasharray="7 4" />
            <ellipse cx="100" cy="75" rx="82" ry="49" fill="none" stroke={ink} strokeWidth="1.2" />
            <text {...text} x="100" y="58" fontSize="10" textAnchor="middle" letterSpacing="4">
              {word}
            </text>
            <text {...text} x="100" y="86" fontSize={fit(name, 24, 136, 2)} textAnchor="middle" letterSpacing="2">
              {name}
            </text>
            <text {...text} x="100" y="104" fontSize="10" textAnchor="middle" letterSpacing="4">
              {country.code}
            </text>
          </>
        )}
        {shape === "octagon" && (
          <>
            <polygon
              points="62,10 138,10 190,52 190,98 138,140 62,140 10,98 10,52"
              fill="none"
              stroke={ink}
              strokeWidth="3.5"
            />
            <text {...text} x="100" y="46" fontSize="10" textAnchor="middle" letterSpacing="4">
              {word}
            </text>
            <text {...text} x="100" y="90" fontSize="38" textAnchor="middle" letterSpacing="3">
              {country.code}
            </text>
            <text {...text} x="100" y="114" fontSize={fit(name, 10, 120, 2.5)} textAnchor="middle" letterSpacing="2.5">
              {name}
            </text>
          </>
        )}
      </g>
    </svg>
  );
}
