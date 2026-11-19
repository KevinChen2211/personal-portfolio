"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import {
  CONTINENTS,
  countriesVisited,
  type Continent,
  type Country,
} from "../data/travel";
import { siteConfig } from "../lib/site";
import Stamp, { StampInk, seeded } from "./Stamp";
import {
  BlankWorld,
  UV_GLOW,
  UvDefs,
  UvPage,
  UvStitch,
  type MapPart,
  type UvContent,
} from "./Uv";
import { useHasFinePointer, usePrefersReducedMotion } from "../utils/motion";
import portrait from "../../public/images/KevinChen.jpg";

const INK = "#2C2C2C";
const PAGE = "#F2E6D2";
const STAMPS_PER_PAGE = 6;
const FLIP_MS = 1100;
// Each page of a riffle or a tab jump, fast enough to feel like thumbing through.
const RIFFLE_MS = 300;
// Horizontal drag distance that turns one more page while riffling.
const RIFFLE_STEP_PX = 70;
// Scroll distance per page turn, how long a scrolled turn takes, and how many
// more turns a fast scroll can line up.
const WHEEL_STEP_PX = 60;
const WHEEL_FLIP_MS = 650;
const WHEEL_MAX_QUEUE = 2;
// Loose 2x3 grid; each stamp is nudged, tilted and resized from here so the
// page looks stamped by hand, overlaps and all.
const SLOTS = [
  { x: 3, y: 7 },
  { x: 50, y: 11 },
  { x: 6, y: 35 },
  { x: 52, y: 39 },
  { x: 2, y: 63 },
  { x: 49, y: 64 },
];
const TAB_INKS: Record<Continent, string> = {
  Oceania: "#2F4A6B",
  Asia: "#8A3B32",
  Europe: "#3E5B47",
  "North America": "#6E5233",
  "South America": "#5B3F5E",
  Africa: "#7A5A2E",
};
// Tab labels: [phone, desktop].
const TAB_LABEL: Record<Continent, [string, string]> = {
  Oceania: ["OCE", "OCEANIA"],
  Asia: ["ASIA", "ASIA"],
  Europe: ["EUR", "EUROPE"],
  "North America": ["N AM", "N. AMERICA"],
  "South America": ["S AM", "S. AMERICA"],
  Africa: ["AFR", "AFRICA"],
};

const tabClass =
  "flex items-center justify-center cursor-pointer text-[8.5px] tracking-[0.14em] transition-[width,height] duration-[600ms] ease-[var(--ease-out)] max-md:px-2 max-md:rounded-t-[3px] md:h-[74px] md:[writing-mode:vertical-rl] md:-ml-1 md:rounded-r-[3px]";
const tabActive = "max-md:h-9 md:w-9";
const tabIdle = "max-md:h-7 max-md:hover:h-8 md:w-6 md:hover:w-8";
const tabStyle: CSSProperties = {
  // Inline so it beats the site-wide 44px button minimum (unlayered CSS wins
  // over Tailwind utilities), which would make every tab the same size.
  minWidth: 0,
  minHeight: 0,
  fontFamily: "var(--font-sweet), var(--font-sans), sans-serif",
  boxShadow: "0 6px 14px -10px rgba(44,44,44,0.7)",
};

// Soft edge of the torch's beam.
const BEAM_MASK =
  "radial-gradient(circle closest-side, #000 60%, rgba(0,0,0,0.8) 80%, transparent)";
// Each beam layer stays mounted and is only shown or hidden, so picking up the
// torch or landing on a page never waits on the UV print being drawn.
const beamLayer = (shown: boolean): CSSProperties => ({
  // Not quite 0 when hidden: browsers skip drawing fully transparent layers,
  // which would leave the first pick-up waiting on the paint.
  opacity: shown ? 1 : 0.001,
  transition: "opacity 200ms ease",
  willChange: "transform",
});

// Two pages side by side from md up; one page at a time below that.
const WIDE_QUERY = "(min-width: 768px)";
function useIsWide() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia(WIDE_QUERY);
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia(WIDE_QUERY).matches,
    () => true,
  );
}

type Page =
  | { kind: "data" }
  | {
      kind: "stamps";
      countries: Country[];
      continent: Continent;
      last: boolean;
    }
  | { kind: "blank" }
  | { kind: "world"; part: MapPart };

const UV_TAB_INK = "#3A2A78";
const TOUCH_LIFT = 72;
const SPREAD_SHADOW = "0 24px 50px -30px rgba(44,44,44,0.55)";
const UV_TAB_LABEL: [string, string] = ["MAP", "WORLD MAP"];

// The world map in UV ink (across the first spread, or the first page on a
// phone), the data page, then each continent starting on a fresh page.
function buildPages(countries: Country[], wide: boolean) {
  const worldStart = 0;
  const pages: Page[] = wide
    ? [
        { kind: "world", part: "left" },
        { kind: "world", part: "right" },
      ]
    : [{ kind: "world", part: "full" }];
  pages.push({ kind: "data" });
  const sectionStart = new Map<Continent, number>();
  for (const continent of CONTINENTS) {
    const group = countries.filter(
      (country) => country.continent === continent,
    );
    if (group.length === 0) continue;
    sectionStart.set(continent, pages.length);
    for (let i = 0; i < group.length; i += STAMPS_PER_PAGE) {
      pages.push({
        kind: "stamps",
        countries: group.slice(i, i + STAMPS_PER_PAGE),
        continent,
        last: false,
      });
    }
  }
  const last = pages[pages.length - 1];
  if (last.kind === "stamps") last.last = true;
  if (wide && pages.length % 2 === 1) pages.push({ kind: "blank" });
  return { pages, sectionStart, worldStart };
}

const pad2 = (n: number) => String(n).padStart(2, "0");

const label: CSSProperties = {
  fontFamily: "var(--font-sweet), var(--font-sans), sans-serif",
  fontSize: "9px",
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  opacity: 0.7,
};

// Faint diagonal hairlines, like the security print on a real passport page.
const pagePaper: CSSProperties = {
  backgroundColor: PAGE,
  backgroundImage:
    "repeating-linear-gradient(135deg, rgba(44,44,44,0.035) 0 1px, transparent 1px 7px)",
};

function PageFrame({
  number,
  heading,
  side,
  seamless,
  children,
}: {
  number: number;
  heading?: string;
  side: "left" | "right" | "single";
  // Printed across the fold as one sheet: no gutter shadow, and the paper
  // texture runs on from the left page into the right.
  seamless?: boolean;
  children?: ReactNode;
}) {
  const gutter =
    side === "right"
      ? "inset 14px 0 18px -16px rgba(44,44,44,0.45)"
      : side === "left"
        ? "inset -14px 0 18px -16px rgba(44,44,44,0.45)"
        : "inset 10px 0 16px -14px rgba(44,44,44,0.4)";
  const sheet: CSSProperties =
    seamless && side !== "single"
      ? {
          boxShadow: "none",
          backgroundSize: "200% 100%",
          backgroundPosition: side === "left" ? "0 0" : "100% 0",
        }
      : { boxShadow: gutter };
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ ...pagePaper, ...sheet }}
    >
      {heading && (
        <div className="absolute top-4 left-5" style={label}>
          {heading}
        </div>
      )}
      {children}
      <div
        className="absolute bottom-3 left-1/2 -translate-x-1/2"
        style={{ ...label, fontVariantNumeric: "tabular-nums" }}
      >
        {pad2(number)}
      </div>
    </div>
  );
}

function DataPage({ countries }: { countries: Country[] }) {
  const home = countries.find((c) => c.home);
  const fields: [string, string][] = [
    ["Surname", "Chen"],
    ["Given names", "Kevin"],
    ["Home", `${siteConfig.location.locality}, Australia`],
    ["Grew up", siteConfig.hometown.locality],
    ["Occupation", "Software engineer"],
    ["Places visited", pad2(countriesVisited)],
  ];
  const mrz = (s: string) => s.toUpperCase().padEnd(36, "<").slice(0, 36);

  return (
    <div className="absolute inset-0 flex flex-col px-5 pt-10 pb-8">
      <div className="flex gap-4">
        {/* self-start keeps it 4:5, where the UV page expects the photo to be */}
        <div className="relative w-[38%] aspect-[4/5] shrink-0 self-start overflow-hidden">
          <Image
            src={portrait}
            alt="Kevin Chen"
            fill
            sizes="160px"
            loading="eager"
            className="object-cover grayscale contrast-[1.05]"
            quality={70}
          />
        </div>
        <dl className="flex-1 grid gap-2 content-start">
          {fields.map(([name, value]) => (
            <div key={name}>
              <dt style={label}>{name}</dt>
              <dd
                className="text-sm md:text-base leading-tight"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div
        className="mt-auto text-[10px] md:text-[11px] leading-relaxed tracking-[0.12em] font-mono break-all"
        style={{ opacity: 0.75 }}
        aria-hidden="true"
      >
        <div>{mrz(`P<${home?.code ?? ""}CHEN<<KEVIN`)}</div>
        <div>{mrz(`${pad2(countriesVisited)}<<KEVINCHEN<COM<AU`)}</div>
      </div>
    </div>
  );
}

// In daylight the map is blank; which countries are mine is printed in UV ink.
function MapPage({ part }: { part: MapPart }) {
  const hidden = "Where I've been is printed in UV ink.";
  // A nudge, not instructions: finding the torch is the easter egg.
  const howTo = "If only there were a UV torch around.";
  return (
    <>
      <BlankWorld part={part} />
      <p
        className="absolute inset-x-5 bottom-10 text-xs italic text-center"
        style={{ fontFamily: "var(--font-serif)", opacity: 0.55 }}
      >
        {part === "left" ? hidden : part === "right" ? howTo : `${hidden} ${howTo}`}
      </p>
    </>
  );
}

function NextStampRing({ style }: { style: CSSProperties }) {
  return (
    <div
      className="absolute w-[40%] aspect-[4/3] rounded-full border border-dashed flex items-center justify-center"
      style={{ borderColor: "rgba(44,44,44,0.25)", ...style }}
    >
      <span style={label}>Next stamp</span>
    </div>
  );
}

function StampPage({
  countries,
  last,
  stamped,
  thump,
  selected,
  onSelect,
}: {
  countries: Country[];
  last: boolean;
  stamped: boolean;
  thump: boolean;
  selected: Country | null;
  onSelect?: (country: Country) => void;
}) {
  const inkRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Thump each stamp onto the page the first time the page is seen. Before
  // paint, or the stamps would flash in at full ink first.
  useLayoutEffect(() => {
    if (thump && !prefersReducedMotion) {
      inkRefs.current.forEach((el, i) =>
        el?.animate(
          [
            { opacity: 0, transform: "scale(1.45)" },
            { opacity: 1, transform: "scale(0.94)", offset: 0.65 },
            { opacity: 1, transform: "scale(1)" },
          ],
          {
            duration: 420,
            delay: i * 70,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "backwards",
          },
        ),
      );
    }
  }, [thump, prefersReducedMotion]);

  const nextSlot =
    last && countries.length < STAMPS_PER_PAGE ? SLOTS[countries.length] : null;

  return (
    <>
      {countries.map((country, i) => {
        const slot = SLOTS[i];
        const dx = (seeded(country.slug, 3) - 0.5) * 8;
        const dy = (seeded(country.slug, 4) - 0.5) * 6;
        const tilt = (seeded(country.slug, 5) - 0.5) * 34;
        const size = 0.86 + seeded(country.slug, 6) * 0.2;
        const isSelected = selected?.slug === country.slug;
        const position: CSSProperties = {
          left: `${slot.x + dx}%`,
          top: `${slot.y + dy}%`,
          transform: `rotate(${tilt}deg) scale(${size * (isSelected ? 1.08 : 1)})`,
          transition: "transform var(--duration-fast) var(--ease-out)",
          zIndex: isSelected ? 2 : undefined,
        };
        const ink = (
          <span
            ref={(el) => {
              inkRefs.current[i] = el;
            }}
            className="block"
            style={{ opacity: stamped ? 0.92 : 0 }}
          >
            <Stamp country={country} />
          </span>
        );
        return onSelect ? (
          <button
            key={country.slug}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(country);
            }}
            tabIndex={stamped ? 0 : -1}
            aria-pressed={isSelected}
            aria-label={country.name}
            className="absolute w-[44%] cursor-pointer rounded-sm focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4"
            style={position}
          >
            {ink}
          </button>
        ) : (
          <div key={country.slug} className="absolute w-[44%]" style={position}>
            {ink}
          </div>
        );
      })}
      {nextSlot && (
        <NextStampRing
          style={{ left: `${nextSlot.x + 3}%`, top: `${nextSlot.y + 2}%` }}
        />
      )}
    </>
  );
}

function Cover() {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-between py-[14%] text-center"
      style={{ backgroundColor: INK, color: "#E9D9B8" }}
    >
      <span
        style={{
          fontFamily: "var(--font-sweet), var(--font-sans), sans-serif",
          letterSpacing: "0.5em",
          fontSize: "13px",
          paddingLeft: "0.5em",
        }}
      >
        PASSPORT
      </span>
      <svg viewBox="0 0 100 100" className="w-[34%]" aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeWidth="1.1">
          <circle cx="50" cy="50" r="40" />
          <ellipse cx="50" cy="50" rx="16" ry="40" />
          <ellipse cx="50" cy="50" rx="30" ry="40" />
          <line x1="10" y1="50" x2="90" y2="50" />
          <path d="M16 32 Q50 40 84 32 M16 68 Q50 60 84 68" />
        </g>
      </svg>
      <div className="flex flex-col items-center gap-2">
        <span
          className="text-xl md:text-2xl"
          style={{ fontFamily: "var(--font-serif)", letterSpacing: "0.12em" }}
        >
          Kevin Chen
        </span>
        <span style={{ ...label, opacity: 0.6 }}>
          {pad2(countriesVisited)} places · Tap to open
        </span>
      </div>
    </div>
  );
}

// A pocket UV torch: violet lens on the left, knurled grip to the right.
function TorchArt({ lit }: { lit: boolean }) {
  const metal = `torch-metal-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg viewBox="0 0 100 28" width="100" height="28" className="overflow-visible">
      <defs>
        <linearGradient id={metal} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#626266" />
          <stop offset="0.45" stopColor="#2C2C2C" />
          <stop offset="1" stopColor="#141414" />
        </linearGradient>
      </defs>
      <rect x="30" y="8" width="68" height="12" rx="3" fill={`url(#${metal})`} />
      {Array.from({ length: 10 }, (_, i) => (
        <line
          key={i}
          x1={50 + i * 4}
          y1="9"
          x2={50 + i * 4}
          y2="19"
          stroke="rgba(255,255,255,0.13)"
        />
      ))}
      <rect x="36" y="6" width="7" height="3" rx="1" fill={lit ? UV_GLOW : "#A8402F"} />
      <path
        d="M5 2 H22 L31 7.5 V20.5 L22 26 H5 Q2 26 2 23 V5 Q2 2 5 2 Z"
        fill={`url(#${metal})`}
      />
      <rect x="0" y="3.5" width="4" height="21" rx="1.6" fill={lit ? "#C9B8FF" : "#4E3D96"} />
      <text
        x="16"
        y="17"
        fontSize="7"
        letterSpacing="1"
        textAnchor="middle"
        fill="#E9D9B8"
        style={{ fontFamily: "var(--font-sweet), var(--font-sans), sans-serif" }}
      >
        UV
      </text>
    </svg>
  );
}

// A turnable corner, drawn as a folded-back triangle that lifts on hover.
function Corner({ side }: { side: "left" | "right" }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute bottom-0 ${side === "right" ? "right-0" : "left-0"} w-7 h-7 transition-[width,height] duration-[600ms] ease-[var(--ease-out)] group-hover:w-11 group-hover:h-11`}
      style={{
        background:
          side === "right"
            ? "linear-gradient(315deg, #FAF2E6 0 50%, #E6D6BB 50% 60%, #EADBC2 60%)"
            : "linear-gradient(45deg, #FAF2E6 0 50%, #E6D6BB 50% 60%, #EADBC2 60%)",
        boxShadow:
          side === "right"
            ? "-3px -3px 6px -4px rgba(44,44,44,0.35)"
            : "3px -3px 6px -4px rgba(44,44,44,0.35)",
      }}
    />
  );
}

type Flip = { dir: 1 | -1; from: number; to: number; ms: number };

export default function Passport({ countries }: { countries: Country[] }) {
  const isWide = useIsWide();
  const { pages, sectionStart, worldStart } = useMemo(
    () => buildPages(countries, isWide),
    [countries, isWide],
  );
  const prefersReducedMotion = usePrefersReducedMotion();
  const hasFinePointer = useHasFinePointer();

  const [coverState, setCoverState] = useState<
    "closed" | "opening" | "open" | "closing"
  >("closed");
  const coverRef = useRef<HTMLButtonElement>(null);
  const coverFrom = useRef<number | null>(null);
  // Set while flicking back to the first spread on the way to shutting the cover.
  const closeAfterFlip = useRef(false);
  const [pageState, setPage] = useState(0);
  const [flip, setFlip] = useState<Flip | null>(null);
  const [stamped, setStamped] = useState<Set<number>>(() => new Set());
  const stampedRef = useRef(stamped);
  // Pages stamped by the latest turn, which thump their stamps on.
  const [fresh, setFresh] = useState<Set<number>>(() => new Set());
  const [turned, setTurned] = useState(false);
  const [selected, setSelected] = useState<Country | null>(null);
  // Spread the ribbon slider is headed for while pages riffle towards it.
  const [seekSpread, setSeekSpread] = useState<number | null>(null);

  // The world map takes two pages on a spread but one on a phone, so every
  // page after it moves by one when the layout changes (a phone rotating, say).
  const [laidOutWide, setLaidOutWide] = useState(isWide);
  if (laidOutWide !== isWide) {
    setLaidOutWide(isWide);
    const convert = (i: number) =>
      isWide ? (i === 0 ? 0 : i + 1) : Math.max(i - 1, 0);
    const at = convert(pageState);
    const start = isWide ? at - (at % 2) : at;
    setPage(start);
    setFlip(null);
    setSeekSpread(null);
    setStamped((prev) => {
      const next = new Set([...prev].map(convert));
      next.add(start);
      if (isWide) next.add(start + 1);
      return next;
    });
    setFresh(new Set());
  }
  useLayoutEffect(() => {
    stampedRef.current = stamped;
  }, [stamped]);

  // Whether the UV torch is picked up.
  const [uv, setUv] = useState(false);
  const heldTorchRef = useRef<HTMLDivElement>(null);
  const beamDarkRef = useRef<HTMLDivElement>(null);
  const beamGlowRef = useRef<HTMLDivElement>(null);
  const beamPrintRef = useRef<HTMLDivElement>(null);
  const beamHaloRef = useRef<HTMLDivElement>(null);
  const beamSize = useRef({ r: 0, w: 0, h: 0 });
  // The UV print is laid out shortly after opening, so picking up the torch
  // only has to show it.
  const [uvReady, setUvReady] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const leafRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  // Pages still to turn after the current flip, for riffles and tab jumps.
  const queue = useRef<{ dir: 1 | -1; remaining: number } | null>(null);
  const drag = useRef<{
    x0: number;
    y0: number;
    lastX: number;
    riffling: boolean;
  } | null>(null);
  const swiped = useRef(false);
  // A layout change drops the flip in progress, and what was queued after it.
  useLayoutEffect(() => {
    queue.current = null;
    closeAfterFlip.current = false;
  }, [isWide]);

  const step = isWide ? 2 : 1;
  const lastStart = isWide ? pages.length - 2 : pages.length - 1;
  // Pages are laid out differently on a phone, so clamp after a resize.
  const page = Math.min(
    isWide ? pageState - (pageState % 2) : pageState,
    lastStart,
  );
  const isOpen = coverState === "open";
  const startOf = useCallback(
    (index: number) => (isWide ? index - (index % 2) : index),
    [isWide],
  );

  const stampRange = useCallback(
    (from: number, to: number) => {
      const next = new Set(stampedRef.current);
      const added = new Set<number>();
      const lo = Math.min(from, to);
      const hi = Math.max(from, to) + (isWide ? 1 : 0);
      for (let i = lo; i <= hi; i++) {
        if (!next.has(i)) added.add(i);
        next.add(i);
      }
      stampedRef.current = next;
      setStamped(next);
      setFresh(added);
    },
    [isWide],
  );
  // The beam is a fixed circle slid around by transform, with the UV print
  // inside slid the opposite way so it stays put on the page. Transforms alone
  // keep every move on the compositor: no re-render, no repaint.
  const aimTorch = useCallback((clientX: number, clientY: number) => {
    const book = bookRef.current;
    if (!book) return;
    const box = book.getBoundingClientRect();
    const r = Math.round(Math.min(170, Math.max(80, box.width * 0.17)));
    const size = beamSize.current;
    if (size.r !== r || size.w !== box.width || size.h !== box.height) {
      beamSize.current = { r, w: box.width, h: box.height };
      book.style.setProperty("--tr", `${r}px`);
      book.style.setProperty("--bw", `${box.width}px`);
      book.style.setProperty("--bh", `${box.height}px`);
    }
    const x = clientX - box.left;
    const y = clientY - box.top;
    const at = `translate3d(${x - r}px, ${y - r}px, 0)`;
    if (beamDarkRef.current) beamDarkRef.current.style.transform = at;
    if (beamGlowRef.current) beamGlowRef.current.style.transform = at;
    if (beamPrintRef.current)
      beamPrintRef.current.style.transform = `translate3d(${r - x}px, ${r - y}px, 0)`;
    if (beamHaloRef.current)
      beamHaloRef.current.style.transform = `translate3d(${x - r * 1.9}px, ${y - r * 1.9}px, 0)`;
    if (heldTorchRef.current)
      heldTorchRef.current.style.transform = `translate3d(${clientX}px, ${clientY}px, 0)`;
  }, []);
  const aimTorchAtMap = useCallback(() => {
    const box = bookRef.current?.getBoundingClientRect();
    if (box)
      aimTorch(
        box.left + box.width * (isWide ? 0.62 : 0.5),
        box.top + box.height * 0.45,
      );
  }, [aimTorch, isWide]);
  // The torch only shines while it's held down. Pressed with a pointer it
  // starts where it was grabbed; held from the keyboard it shines on the map.
  const pickUpAt = useRef<{ x: number; y: number } | null>(null);
  const holdTorch = useCallback((on: boolean, at?: { x: number; y: number }) => {
    setUv(on);
    if (on) {
      setUvReady(true);
      pickUpAt.current = at ?? null;
    }
  }, []);
  // Aim in the same commit the beam and held torch appear, before paint.
  useLayoutEffect(() => {
    if (!uv) return;
    const at = pickUpAt.current;
    if (at) aimTorch(at.x, at.y);
    else aimTorchAtMap();
  }, [uv, aimTorch, aimTorchAtMap]);

  useEffect(() => {
    if (!isOpen || uvReady) return;
    const id = window.setTimeout(() => setUvReady(true), 700);
    return () => window.clearTimeout(id);
  }, [isOpen, uvReady]);

  // A finger would hide the beam, so on touch it shines just above it.
  const torchPoint = (e: ReactPointerEvent) => ({
    x: e.clientX,
    y: e.clientY - (e.pointerType === "mouse" ? 0 : TOUCH_LIFT),
  });

  const stampIn = useCallback(
    (start: number) => stampRange(start, start),
    [stampRange],
  );

  const finishOpening = () => {
    setCoverState("open");
    stampIn(page);
    // The cover had focus and is about to unmount; hand it to the book.
    bookRef.current?.focus({ preventScroll: true });
  };

  const openCover = () => {
    if (coverState === "closing" && coverRef.current) {
      // Swing back open from wherever the cover has got to.
      const m = new DOMMatrix(getComputedStyle(coverRef.current).transform);
      const angle = (Math.atan2(-m.m13, m.m11) * 180) / Math.PI;
      coverFrom.current = angle > 1 ? angle - 360 : angle;
      setCoverState("opening");
      return;
    }
    if (coverState !== "closed") return;
    if (prefersReducedMotion) finishOpening();
    else setCoverState("opening");
  };

  const flipFrom = useCallback(
    (from: number, dir: 1 | -1, ms: number) => {
      const to = from + dir * step;
      if (to < 0 || to > lastStart) {
        queue.current = null;
        return;
      }
      setSelected(null);
      setTurned(true);
      if (prefersReducedMotion) {
        setPage(to);
        stampIn(to);
      } else {
        // Stamp the pages coming into view now, so they land as the leaf
        // uncovers them rather than once it has settled.
        stampRange(to, to);
        setFlip({ dir, from, to, ms });
      }
    },
    [step, lastStart, prefersReducedMotion, stampIn, stampRange],
  );

  const turn = useCallback(
    (dir: 1 | -1) => {
      if (!isOpen || flip) return;
      flipFrom(page, dir, FLIP_MS);
    },
    [isOpen, flip, page, flipFrom],
  );

  // Flick through every page between here and there, e.g. from a tab.
  const goTo = (index: number) => {
    if (!isOpen || flip) return;
    const target = startOf(index);
    if (target === page) {
      setSeekSpread(null);
      return;
    }
    const dir = target > page ? 1 : -1;
    const turns = Math.abs(target - page) / step;
    stampRange(page, target);
    if (prefersReducedMotion) {
      setPage(target);
      stampIn(target);
      setSelected(null);
      setSeekSpread(null);
      return;
    }
    queue.current = { dir, remaining: turns - 1 };
    flipFrom(page, dir, turns > 1 ? RIFFLE_MS : FLIP_MS);
  };

  // The ribbon slider can change its mind mid-riffle, so retarget the queue
  // from wherever the current flip lands.
  const seek = (spread: number) => {
    if (!isOpen) return;
    const target = Math.min(Math.max(spread * step, 0), lastStart);
    setSeekSpread(target / step);
    if (!flip) return goTo(target);
    const left = (target - flip.to) / step;
    queue.current =
      left === 0 ? null : { dir: left > 0 ? 1 : -1, remaining: Math.abs(left) };
  };

  // Flick back to the first spread, then shut the cover over it.
  const closeBook = () => {
    if (!isOpen) return;
    setUv(false);
    setSelected(null);
    setSeekSpread(null);
    if (prefersReducedMotion) {
      queue.current = null;
      setFlip(null);
      setPage(0);
      setCoverState("closed");
      requestAnimationFrame(() => coverRef.current?.focus({ preventScroll: true }));
      return;
    }
    if (!flip && page === 0) {
      setCoverState("closing");
      return;
    }
    closeAfterFlip.current = true;
    if (flip) {
      queue.current =
        flip.to === 0 ? null : { dir: -1, remaining: flip.to / step };
    } else {
      goTo(0);
    }
  };
  const closeBookRef = useRef(closeBook);
  const finishOpeningRef = useRef(finishOpening);
  useLayoutEffect(() => {
    closeBookRef.current = closeBook;
    finishOpeningRef.current = finishOpening;
  });

  // Scrolling over the passport turns its pages: one notch turns one, a fast
  // scroll flicks through a few. Past the first or last spread the page
  // scrolls as normal, and scrolling down on the cover opens it.
  const wheelSum = useRef(0);
  const onWheel = (e: WheelEvent) => {
    if (e.ctrlKey) return;
    const raw = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
    const px = raw * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 400 : 1);
    if (px === 0) return;
    const dir: 1 | -1 = px > 0 ? 1 : -1;
    if (coverState === "closed") {
      if (dir === 1) {
        e.preventDefault();
        openCover();
      }
      return;
    }
    if (!isOpen) {
      e.preventDefault();
      return;
    }
    const queued = queue.current;
    const landing = flip
      ? flip.to + (queued ? queued.dir * queued.remaining * step : 0)
      : page;
    if (dir === 1 ? landing >= lastStart : landing <= 0) return;
    e.preventDefault();
    if (Math.sign(wheelSum.current) !== dir) wheelSum.current = 0;
    wheelSum.current += px;
    if (Math.abs(wheelSum.current) < WHEEL_STEP_PX) return;
    wheelSum.current = 0;
    if (!flip) {
      flipFrom(page, dir, WHEEL_FLIP_MS);
    } else if (!queued || queued.dir === dir) {
      const remaining = (queued?.remaining ?? 0) + 1;
      // Trackpad momentum shouldn't run away to the end of the book.
      if (remaining <= WHEEL_MAX_QUEUE) queue.current = { dir, remaining };
    }
  };
  const onWheelRef = useRef(onWheel);
  useLayoutEffect(() => {
    onWheelRef.current = onWheel;
  });
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const listener = (e: WheelEvent) => onWheelRef.current(e);
    // Not passive, so turning a page can stop the window scrolling.
    el.addEventListener("wheel", listener, { passive: false });
    return () => el.removeEventListener("wheel", listener);
  }, []);

  // Turn the leaf, then land on the new pages or carry on riffling.
  useLayoutEffect(() => {
    if (!flip || !leafRef.current) return;
    const forward = flip.dir === 1;
    const frames =
      isWide || forward
        ? ["rotateY(0deg)", forward ? "rotateY(-180deg)" : "rotateY(180deg)"]
        : ["rotateY(-180deg)", "rotateY(0deg)"];
    const timing = {
      duration: flip.ms,
      easing:
        flip.ms < FLIP_MS
          ? "cubic-bezier(0.33, 0, 0.67, 1)"
          : "cubic-bezier(0.45, 0.05, 0.55, 0.95)",
      fill: "forwards" as const,
    };
    const leaf = leafRef.current.animate(
      frames.map((transform) => ({ transform })),
      timing,
    );
    shadeRef.current?.animate(
      [{ opacity: 0 }, { opacity: 0.22 }, { opacity: 0 }],
      timing,
    );
    leaf.onfinish = () => {
      const next = queue.current;
      const onward = next ? flip.to + next.dir * step : -1;
      if (next && next.remaining > 0 && onward >= 0 && onward <= lastStart) {
        next.remaining -= 1;
        stampRange(flip.to, onward);
        setPage(flip.to);
        setFlip({ dir: next.dir, from: flip.to, to: onward, ms: RIFFLE_MS });
        return;
      }
      queue.current = null;
      setPage(flip.to);
      setFlip(null);
      setSeekSpread(null);
      stampIn(flip.to);
      // Only close if the riffle back still ends on the first spread; the
      // ribbon or a drag may have sent it somewhere else.
      if (closeAfterFlip.current) {
        closeAfterFlip.current = false;
        if (flip.to === 0) setCoverState("closing");
      }
    };
    return () => leaf.cancel();
  }, [flip, isWide, step, lastStart, stampIn, stampRange]);

  // Swing the cover open, or back over the first spread. An animation rather
  // than a transition so it always finishes, even with no distance left to go.
  useLayoutEffect(() => {
    const cover = coverRef.current;
    if (!cover || (coverState !== "opening" && coverState !== "closing")) return;
    const opening = coverState === "opening";
    const to = opening ? -180 : 0;
    const from = coverFrom.current ?? (opening ? 0 : -180);
    coverFrom.current = null;
    const swing = cover.animate(
      [{ transform: `rotateY(${from}deg)` }, { transform: `rotateY(${to}deg)` }],
      {
        duration: ((opening ? 1400 : 1000) * Math.abs(to - from)) / 180,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    );
    swing.onfinish = () => {
      if (opening) return finishOpeningRef.current();
      setCoverState("closed");
      coverRef.current?.focus({ preventScroll: true });
    };
    return () => swing.cancel();
  }, [coverState]);

  const close = useCallback(() => {
    setSelected(null);
    bookRef.current?.focus({ preventScroll: true });
  }, []);

  // Arrow keys turn pages anywhere on the page; Escape puts the photo away.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      if (e.key === "Escape" && selected) close();
      else if (e.key === "Escape" && uv) holdTorch(false);
      else if (e.key === "Escape") closeBookRef.current();
      else if (e.key === "ArrowRight") turn(1);
      else if (e.key === "ArrowLeft") turn(-1);
      // Holding U shines the torch on the map, like holding the torch itself.
      else if (e.key.toLowerCase() === "u" && isOpen && !e.repeat && !e.metaKey && !e.ctrlKey)
        holdTorch(true);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "u") holdTorch(false);
    };
    // A key let go in another window, or under Cmd on a Mac, sends no keyup.
    const putDown = () => {
      if (uv) holdTorch(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", putDown);
    document.addEventListener("visibilitychange", putDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", putDown);
      document.removeEventListener("visibilitychange", putDown);
    };
  }, [selected, close, turn, isOpen, uv, holdTorch]);

  // Slide the photo card out of the book.
  useLayoutEffect(() => {
    if (!selected) return;
    closeRef.current?.focus({ preventScroll: true });
    if (prefersReducedMotion || !cardRef.current) return;
    cardRef.current.animate(
      [
        { opacity: 0, transform: "translateY(24px) rotate(-7deg) scale(0.96)" },
        { opacity: 1, transform: "translateY(0) rotate(-2deg) scale(1)" },
      ],
      { duration: 700, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    );
  }, [selected, prefersReducedMotion]);

  // Press and drag across the book: a short flick turns one page, a long drag
  // keeps turning them, one per RIFFLE_STEP_PX.
  const onPointerMove = (e: ReactPointerEvent) => {
    const d = drag.current;
    if (!d || !isOpen || e.buttons === 0) return;
    const fromStart = e.clientX - d.x0;
    if (!d.riffling) {
      if (
        Math.abs(fromStart) < RIFFLE_STEP_PX ||
        Math.abs(fromStart) < Math.abs(e.clientY - d.y0)
      )
        return;
      d.riffling = true;
    }
    const moved = e.clientX - d.lastX;
    if (Math.abs(moved) < RIFFLE_STEP_PX) return;
    d.lastX = e.clientX;
    swiped.current = true;
    const dir: 1 | -1 = moved < 0 ? 1 : -1;
    if (!flip) {
      flipFrom(page, dir, RIFFLE_MS);
    } else if (!queue.current || queue.current.dir === dir) {
      queue.current = { dir, remaining: (queue.current?.remaining ?? 0) + 1 };
    }
  };

  const renderPage = (
    index: number,
    side: "left" | "right" | "single",
    interactive: boolean,
    onLeaf = false,
  ) => {
    const p = pages[index];
    if (!p) return null;
    return (
      <PageFrame
        number={index + 1}
        side={side}
        seamless={p.kind === "world"}
        heading={
          p.kind === "stamps"
            ? `Entries / Visas · ${p.continent}`
            : p.kind === "blank"
              ? "Entries / Visas"
              : p.kind === "world" && p.part !== "right"
                ? "Where I've been"
                : undefined
        }
      >
        {p.kind === "world" && <MapPage part={p.part} />}
        {p.kind === "data" && <DataPage countries={countries} />}
        {p.kind === "stamps" && (
          <StampPage
            key={index}
            countries={p.countries}
            last={p.last}
            stamped={stamped.has(index)}
            thump={!onLeaf && fresh.has(index)}
            selected={selected}
            onSelect={interactive ? setSelected : undefined}
          />
        )}
      </PageFrame>
    );
  };

  // What sits under the turning leaf, and what's printed on each side of it.
  let baseLeft = page;
  let baseRight = page + 1;
  let leafFront = -1;
  let leafBack = -1;
  if (flip && isWide) {
    if (flip.dir === 1) {
      baseLeft = flip.from;
      baseRight = flip.to + 1;
      leafFront = flip.from + 1;
      leafBack = flip.to;
    } else {
      baseLeft = flip.to;
      baseRight = flip.from + 1;
      leafFront = flip.from;
      leafBack = flip.to + 1;
    }
  } else if (flip) {
    baseLeft = flip.dir === 1 ? flip.to : flip.from;
    leafFront = flip.dir === 1 ? flip.from : flip.to;
  }

  // Folded corners are on the pages already, so the cover uncovers them.
  const pagesOut = isOpen || coverState === "opening";
  const canBack = pagesOut && page > 0;
  const canForward = pagesOut && page < lastStart;
  // The tabs, torch and ribbon fade in as the cover settles, rather than
  // popping in the moment it lands, and leave as soon as it starts to close.
  const uiShown = coverState === "opening" || isOpen;
  const uiFade: CSSProperties = {
    opacity: uiShown ? 1 : 0,
    transition: prefersReducedMotion
      ? undefined
      : `opacity 600ms var(--ease-out) ${uiShown ? "800ms" : "0ms"}`,
  };

  const pageClick = (dir: 1 | -1) => {
    if (swiped.current) {
      swiped.current = false;
      return;
    }
    if (selected) setSelected(null);
    else turn(dir);
  };

  // The section open now, for the tab that sticks out furthest.
  const shown = [pages[page], isWide ? pages[page + 1] : undefined].find(
    (p) => p?.kind === "stamps",
  );
  const activeContinent = shown?.kind === "stamps" ? shown.continent : null;
  const onWorld = pages[page]?.kind === "world";
  const sections = CONTINENTS.filter((continent) =>
    sectionStart.has(continent),
  );
  const spreadCount = Math.floor(lastStart / step) + 1;
  const ribbonSpread = seekSpread ?? Math.floor((flip ? flip.to : page) / step);
  const spreadContinent = (spread: number) => {
    const p = [
      pages[spread * step],
      isWide ? pages[spread * step + 1] : undefined,
    ].find((q) => q?.kind === "stamps");
    return p?.kind === "stamps" ? p.continent : null;
  };
  const spreadLabel = (spread: number) =>
    pages[spread * step]?.kind === "world"
      ? "World map"
      : (spreadContinent(spread) ?? "Personal details");
  const spreadInk = (spread: number) => {
    if (pages[spread * step]?.kind === "world") return UV_TAB_INK;
    const continent = spreadContinent(spread);
    return continent ? TAB_INKS[continent] : "rgba(44,44,44,0.35)";
  };
  const ribbonLabel = spreadLabel(ribbonSpread);

  // The UV print for the open pages. Hundreds of country outlines, so only
  // rebuilt when the pages change, not on every render.
  const uvPrint = useMemo(() => {
    // Two pages of the same continent share one map across the fold rather
    // than each printing a copy.
    const left = pages[page];
    const right = isWide ? pages[page + 1] : undefined;
    const shared =
      left?.kind === "stamps" && right?.kind === "stamps" && left.continent === right.continent
        ? [...left.countries, ...right.countries]
        : null;
    const contentFor = (index: number, side: "left" | "right"): UvContent | null => {
      const p = pages[index];
      if (!p) return null;
      if (p.kind === "data") return { kind: "data", visited: countriesVisited };
      if (p.kind === "stamps")
        return shared
          ? { kind: "stamps", part: side, countries: shared, all: countries }
          : { kind: "stamps", part: "full", countries: p.countries, all: countries };
      if (p.kind === "world") return { kind: "world", part: p.part, all: countries };
      return { kind: "blank" };
    };
    return (isWide ? [page, page + 1] : [page]).map((index, i) => {
      const content = contentFor(index, i === 0 ? "left" : "right");
      return (
        <div key={index} className="relative overflow-hidden">
          {content && <UvPage content={content} seed={index} />}
        </div>
      );
    });
  }, [pages, page, isWide, countries]);
  const scrubTo = (clientX: number, track: HTMLElement) => {
    const box = track.getBoundingClientRect();
    const spread = Math.min(
      spreadCount - 1,
      Math.max(0, Math.floor(((clientX - box.left) / box.width) * spreadCount)),
    );
    if (spread !== ribbonSpread) seek(spread);
  };

  return (
    <div ref={rootRef} style={{ color: INK }}>
      <div className="overflow-hidden pt-10 pb-10 md:pt-4">
        <div
          // isolate, so the hidden torch can tuck in behind the book.
          className="relative isolate mx-auto w-full md:px-12"
          // Small enough that the whole book and its controls fit in the window.
          style={{
            maxWidth: "min(940px, max(600px, calc((100svh - 400px) * 1.43 + 96px)))",
          }}
        >
          <div
            ref={bookRef}
            tabIndex={-1}
            role="region"
            aria-roledescription="passport"
            aria-label="Kevin's passport. Tap a page or use the arrow keys to turn it; drag across it to flick through."
            className={`relative w-full outline-none select-none ${coverState === "closed" || coverState === "closing" ? "md:[--book-shift:-25%]" : ""}`}
            style={{
              perspective: "2400px",
              transform: "translateX(var(--book-shift, 0%))",
              transition: "transform var(--duration-slow) var(--ease-out)",
              touchAction: "pan-y",
            }}
            onPointerDown={(e) => {
              // A swipe on touch, or a drag ending off the page, gets no click
              // to clear this, so start each press afresh.
              swiped.current = false;
              drag.current = {
                x0: e.clientX,
                y0: e.clientY,
                lastX: e.clientX,
                riffling: false,
              };
            }}
            onPointerMove={onPointerMove}
            onPointerUp={(e) => {
              const d = drag.current;
              drag.current = null;
              if (!d || !isOpen || d.riffling) return;
              const dx = e.clientX - d.x0;
              if (
                Math.abs(dx) > 45 &&
                Math.abs(dx) > Math.abs(e.clientY - d.y0)
              ) {
                swiped.current = true;
                turn(dx < 0 ? 1 : -1);
              }
            }}
            onPointerCancel={() => {
              drag.current = null;
            }}
          >
            <nav
              aria-label="Continents"
              inert={!isOpen}
              className="absolute z-[-1] flex gap-1 max-md:bottom-full max-md:left-3 max-md:flex-row max-md:items-end md:left-full md:top-[4%] md:flex-col"
              style={uiFade}
            >
              <button
                type="button"
                onClick={() => goTo(worldStart)}
                aria-current={onWorld ? "true" : undefined}
                aria-label="World map"
                className={`${tabClass} ${onWorld ? tabActive : tabIdle}`}
                style={{
                  ...tabStyle,
                  backgroundColor: UV_TAB_INK,
                  color: UV_GLOW,
                }}
              >
                <span className="md:hidden">{UV_TAB_LABEL[0]}</span>
                <span className="max-md:hidden">{UV_TAB_LABEL[1]}</span>
              </button>
              {sections.map((continent) => {
                const active = continent === activeContinent;
                return (
                  <button
                    key={continent}
                    type="button"
                    onClick={() => goTo(sectionStart.get(continent)!)}
                    aria-current={active ? "true" : undefined}
                    className={`${tabClass} ${active ? tabActive : tabIdle}`}
                    style={{
                      ...tabStyle,
                      backgroundColor: TAB_INKS[continent],
                      color: "#FAF2E6",
                    }}
                  >
                    <span className="md:hidden">
                      {TAB_LABEL[continent][0]}
                    </span>
                    <span className="max-md:hidden">
                      {TAB_LABEL[continent][1]}
                    </span>
                  </button>
                );
              })}
            </nav>

            <div
              className="relative grid grid-cols-1 md:grid-cols-2 rounded-[6px]"
              style={{
                boxShadow: isOpen || !isWide ? SPREAD_SHADOW : undefined,
                visibility: coverState === "closed" ? "hidden" : "visible",
                transformStyle: "preserve-3d",
              }}
            >
              <div
                className="group relative aspect-[5/7] cursor-pointer rounded-l-[6px] max-md:rounded-[6px]"
                style={{
                  visibility: isWide && !isOpen ? "hidden" : undefined,
                }}
                onClick={(e) => {
                  if (isWide) return pageClick(-1);
                  // One page on screen: its left half goes back, its right half forward.
                  const box = e.currentTarget.getBoundingClientRect();
                  pageClick(e.clientX - box.left < box.width / 2 ? -1 : 1);
                }}
              >
                {renderPage(
                  baseLeft,
                  isWide ? "left" : "single",
                  isOpen && !flip,
                )}
                {canBack && !flip && <Corner side="left" />}
                {!isWide && canForward && !flip && <Corner side="right" />}
              </div>
              {isWide && (
                <div
                  // Hidden by CSS too: the server renders the wide layout, and a
                  // phone shouldn't show two pages stacked before hydrating.
                  className="group relative aspect-[5/7] cursor-pointer rounded-r-[6px] max-md:hidden"
                  style={{ boxShadow: isOpen ? undefined : SPREAD_SHADOW }}
                  onClick={() => pageClick(1)}
                >
                  {renderPage(baseRight, "right", isOpen && !flip)}
                  {canForward && !flip && <Corner side="right" />}
                </div>
              )}

              {flip && (
                <div
                  ref={leafRef}
                  aria-hidden="true"
                  className={`absolute top-0 bottom-0 z-10 pointer-events-none ${
                    isWide
                      ? flip.dir === 1
                        ? "left-1/2 right-0"
                        : "left-0 right-1/2"
                      : "inset-x-0"
                  }`}
                  style={{
                    transformStyle: "preserve-3d",
                    transformOrigin:
                      isWide && flip.dir === -1
                        ? "right center"
                        : "left center",
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    {renderPage(
                      leafFront,
                      isWide ? (flip.dir === 1 ? "right" : "left") : "single",
                      false,
                      true,
                    )}
                  </div>
                  <div
                    className="absolute inset-0"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    {leafBack >= 0 ? (
                      renderPage(
                        leafBack,
                        flip.dir === 1 ? "left" : "right",
                        false,
                        true,
                      )
                    ) : (
                      <div className="absolute inset-0" style={pagePaper} />
                    )}
                  </div>
                  <div
                    ref={shadeRef}
                    className="absolute inset-0"
                    style={{
                      background: INK,
                      opacity: 0,
                      backfaceVisibility: "hidden",
                    }}
                  />
                </div>
              )}
            </div>

            {/* UV torch beam, clipped to the book. The clip must not form a
                stacking context, or the blend modes would stop reaching the pages. */}
            {isOpen && uvReady && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden rounded-[6px]"
              >
                <div
                  ref={beamHaloRef}
                  className="absolute left-0 top-0 rounded-full"
                  style={{
                    ...beamLayer(uv && !flip),
                    width: "calc(var(--tr) * 3.8)",
                    height: "calc(var(--tr) * 3.8)",
                    background:
                      "radial-gradient(circle closest-side, rgba(110,86,220,0.3), rgba(110,86,220,0.14) 55%, transparent)",
                    mixBlendMode: "multiply",
                  }}
                />
                <div
                  ref={beamDarkRef}
                  className="absolute left-0 top-0 rounded-full"
                  style={{
                    ...beamLayer(uv && !flip),
                    width: "calc(var(--tr) * 2)",
                    height: "calc(var(--tr) * 2)",
                    background:
                      "radial-gradient(circle closest-side, #33207A, #140A33 60%, rgba(20,10,51,0.8) 80%, rgba(20,10,51,0))",
                    mixBlendMode: "multiply",
                  }}
                />
                <div
                  ref={beamGlowRef}
                  className="absolute left-0 top-0 overflow-hidden rounded-full"
                  style={{
                    ...beamLayer(uv && !flip),
                    width: "calc(var(--tr) * 2)",
                    height: "calc(var(--tr) * 2)",
                    WebkitMaskImage: BEAM_MASK,
                    maskImage: BEAM_MASK,
                    mixBlendMode: "screen",
                  }}
                >
                  <div
                    ref={beamPrintRef}
                    className="absolute left-0 top-0 grid grid-cols-1 md:grid-cols-2"
                    style={{
                      width: "var(--bw)",
                      height: "var(--bh)",
                      willChange: "transform",
                    }}
                  >
                    {uvPrint}
                    {isWide && <UvStitch />}
                  </div>
                </div>
              </div>
            )}

            {coverState !== "open" && (
              <button
                type="button"
                onClick={openCover}
                aria-label="Open Kevin's passport"
                className="absolute top-0 bottom-0 right-0 w-full md:w-1/2 cursor-pointer rounded-[6px] md:rounded-l-none"
                style={{
                  transformStyle: "preserve-3d",
                  transformOrigin: "left center",
                  transform:
                    coverState === "opening" ? "rotateY(-180deg)" : "none",
                  // Eases to the pages' shadow while it swings, so nothing jumps
                  // when the cover lands and the spread takes over.
                  boxShadow:
                    coverState === "closed"
                      ? "0 24px 50px -30px rgba(44,44,44,0.7)"
                      : SPREAD_SHADOW,
                  transition: "box-shadow 1000ms var(--ease-out)",
                }}
                ref={coverRef}
              >
                <div
                  className="absolute inset-0 overflow-hidden rounded-[inherit]"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  <Cover />
                </div>
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{
                    ...pagePaper,
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  {renderPage(0, "left", false, true)}
                </div>
              </button>
            )}

            {selected && (
              <div
                className="absolute inset-0 z-20 flex items-center justify-center p-4 cursor-pointer"
                style={{ backgroundColor: "rgba(250,242,230,0.6)" }}
                onClick={close}
              >
                <figure
                  ref={cardRef}
                  role="dialog"
                  aria-modal="false"
                  aria-label={selected.name}
                  onClick={(e) => e.stopPropagation()}
                  className="relative w-[min(92%,440px)] cursor-default p-3 pb-5"
                  style={{
                    backgroundColor: "#FBF7EF",
                    transform: "rotate(-2deg)",
                    boxShadow: "0 22px 40px -22px rgba(44,44,44,0.6)",
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute -top-3 left-1/2 w-24 h-6 -translate-x-1/2 rotate-[3deg]"
                    style={{ backgroundColor: "rgba(226,208,172,0.85)" }}
                  />
                  {selected.photo && (
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <Image
                        key={selected.slug}
                        src={selected.photo.src}
                        alt={selected.photo.alt}
                        fill
                        sizes="440px"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <figcaption className="pt-4 px-1">
                    <div className="flex items-baseline justify-between gap-3 pr-6">
                      <span
                        className="text-2xl md:text-3xl"
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontWeight: 300,
                        }}
                      >
                        {selected.name}
                      </span>
                      <span style={label}>
                        {selected.home ? "Home" : selected.continent} ·{" "}
                        {selected.code}
                      </span>
                    </div>
                    {selected.note && (
                      <p
                        className="mt-2 text-sm leading-relaxed"
                        style={{ fontFamily: "var(--font-serif)" }}
                      >
                        {selected.note}
                      </p>
                    )}
                    {selected.photo?.credit && (
                      <p
                        className="mt-2 text-[11px] italic"
                        style={{ opacity: 0.55 }}
                      >
                        Photo: {selected.photo.credit}
                      </p>
                    )}
                  </figcaption>
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={close}
                    aria-label="Close"
                    className="absolute top-1 right-2 text-xl leading-none px-2 py-1 cursor-pointer hover:opacity-60"
                  >
                    ×
                  </button>
                </figure>
              </div>
            )}
          </div>

          {/* The UV torch, tucked under the bottom of the passport with only its
              tail showing. It shines only while held down. */}
          <button
            type="button"
            aria-label="UV torch: press and hold to shine it on the pages"
            inert={!isOpen}
            className="group absolute z-[-1] top-[calc(100%-24px)] left-[9%] md:left-[calc(48px+7%)] w-[100px] h-[60px] cursor-grab touch-none select-none"
            style={{
              ...uiFade,
              minWidth: 0,
              minHeight: 0,
              cursor: uv ? "none" : undefined,
              WebkitTouchCallout: "none",
            }}
            onContextMenu={(e) => e.preventDefault()}
            onPointerDown={(e) => {
              e.preventDefault();
              // Captured, so every move goes to the torch wherever it's dragged.
              try {
                e.currentTarget.setPointerCapture(e.pointerId);
              } catch {}
              holdTorch(true, torchPoint(e));
            }}
            onPointerMove={(e) => {
              if (uv && e.buttons !== 0) {
                const at = torchPoint(e);
                aimTorch(at.x, at.y);
              }
            }}
            onPointerUp={() => holdTorch(false)}
            onPointerCancel={() => holdTorch(false)}
            onLostPointerCapture={() => holdTorch(false)}
            onKeyDown={(e) => {
              if (e.key !== " " && e.key !== "Enter") return;
              e.preventDefault();
              if (!e.repeat) holdTorch(true);
            }}
            onKeyUp={(e) => {
              if (e.key === " " || e.key === "Enter") holdTorch(false);
            }}
            onBlur={() => {
              if (uv) holdTorch(false);
            }}
          >
            <span
              aria-hidden="true"
              className="absolute left-0 top-0 origin-top-left transition-[transform,opacity] duration-500 ease-[var(--ease-out)] group-hover:translate-x-1 group-hover:translate-y-1.5 group-focus-visible:translate-y-1.5"
              style={{
                // Lens end under the book, tail sticking out below it.
                transform: uv ? "translate(24px, 26px) rotate(15deg)" : "rotate(15deg)",
                opacity: uv ? 0 : 1,
              }}
            >
              <span
                className="block"
                style={{
                  transform: "translate(0, 4px)",
                  filter: "drop-shadow(0 6px 5px rgba(44,44,44,0.3))",
                }}
              >
                <TorchArt lit={false} />
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* The ribbon and the "open it" hint share a spot and cross-fade. */}
      <div className="mt-6 grid w-full min-h-[52px] justify-items-center">
        <span
          aria-hidden={coverState !== "closed"}
          className="[grid-area:1/1] text-sm italic"
          style={{
            fontFamily: "var(--font-serif)",
            opacity: coverState === "closed" ? 0.6 : 0,
            transition: prefersReducedMotion ? undefined : "opacity 400ms var(--ease-out)",
          }}
        >
          {hasFinePointer ? "Click or scroll to open it." : "Tap to open it."}
        </span>
        <div
          inert={!isOpen}
          className="[grid-area:1/1] w-full flex flex-col items-center gap-1"
          style={uiFade}
        >
          <div className="w-full max-w-[520px] px-6 flex items-end gap-4">
            {/* Ribbon slider: the book's fore-edge, one notch per spread */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between mb-1" style={label}>
                <span>{ribbonLabel}</span>
                <span style={{ fontVariantNumeric: "tabular-nums" }}>
                  {pad2(ribbonSpread + 1)} / {pad2(spreadCount)}
                </span>
              </div>
              <div className="relative h-11">
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex gap-[2px]"
                >
                  {Array.from({ length: spreadCount }, (_, spread) => (
                    <span
                      key={spread}
                      className="h-3 flex-1 transition-opacity duration-[600ms]"
                      style={{
                        background:
                          "repeating-linear-gradient(90deg, #DCC9A8 0 1px, #F7EEDF 1px 3px)",
                        borderBottom: `3px solid ${spreadInk(spread)}`,
                        opacity: spread === ribbonSpread ? 1 : 0.6,
                      }}
                    />
                  ))}
                </div>
                {/* Arrow keys already turn pages globally, so only Home/End are handled here. */}
                <div
                  role="slider"
                  tabIndex={0}
                  aria-label="Page through the passport"
                  aria-valuemin={1}
                  aria-valuemax={spreadCount}
                  aria-valuenow={ribbonSpread + 1}
                  aria-valuetext={`Spread ${ribbonSpread + 1} of ${spreadCount}, ${ribbonLabel}`}
                  className="peer absolute inset-0 cursor-grab outline-none active:cursor-grabbing"
                  style={{ touchAction: "none" }}
                  onPointerDown={(e) => {
                    e.currentTarget.setPointerCapture(e.pointerId);
                    scrubTo(e.clientX, e.currentTarget);
                  }}
                  onPointerMove={(e) => {
                    if (e.currentTarget.hasPointerCapture(e.pointerId))
                      scrubTo(e.clientX, e.currentTarget);
                  }}
                  onPointerUp={(e) => scrubTo(e.clientX, e.currentTarget)}
                  onKeyDown={(e) => {
                    if (e.key === "Home") seek(0);
                    else if (e.key === "End") seek(spreadCount - 1);
                    else return;
                    e.preventDefault();
                  }}
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 h-9 w-3 -translate-x-1/2 transition-[left] duration-300 ease-[var(--ease-out)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4"
                  style={{
                    left: `${((ribbonSpread + 0.5) / spreadCount) * 100}%`,
                    filter: "drop-shadow(0 3px 3px rgba(44,44,44,0.35))",
                  }}
                >
                  <span
                    className="block h-full w-full"
                    style={{
                      backgroundColor: "#A8402F",
                      clipPath:
                        "polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)",
                    }}
                  />
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={closeBook}
              aria-label="Close the passport"
              title="Close (Esc)"
              className="group shrink-0 relative w-14 h-12 cursor-pointer"
            >
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-[3px] -translate-x-1/2 transition-transform duration-300 ease-[var(--ease-out)] group-hover:-translate-y-0.5 group-hover:-rotate-3"
              >
                <svg viewBox="0 0 22 30" width="20" height="27">
                  <rect x="1" y="1" width="20" height="28" rx="2.5" fill={INK} />
                  <g fill="none" stroke="#E9D9B8" strokeWidth="0.8">
                    <circle cx="11" cy="14" r="5" />
                    <path d="M6 14h10M11 9c-2.4 3-2.4 7 0 10M11 9c2.4 3 2.4 7 0 10" />
                  </g>
                </svg>
              </span>
              <span className="absolute inset-x-0 bottom-0 text-center" style={label}>
                Close
              </span>
            </button>
          </div>
          <span
            className="text-xs italic text-center transition-opacity duration-[900ms] px-6"
            style={{
              fontFamily: "var(--font-serif)",
              opacity: uv || !turned ? 0.6 : 0,
            }}
          >
            {uv
              ? "Every page hides something under UV. Let go to put the torch back."
              : hasFinePointer
                ? "Scroll or click a page to turn it, or slide the ribbon to flick through."
                : "Tap a page to turn it, or slide the ribbon to flick through."}
          </span>
        </div>
      </div>
      <StampInk />
      <UvDefs />

      {/* The torch in hand, pointing back at the middle of its beam */}
      {uv &&
        createPortal(
          <div
            ref={heldTorchRef}
            aria-hidden="true"
            className="pointer-events-none fixed left-0 top-0 z-50"
            style={{ transform: "translate3d(-200px, -200px, 0)" }}
          >
            <div
              className="absolute left-0 -top-[14px]"
              style={{
                transformOrigin: "0 14px",
                transform: "rotate(38deg) translateX(58px)",
                filter: "drop-shadow(0 12px 10px rgba(44,44,44,0.35))",
              }}
            >
              <span
                className="absolute -left-4 -top-1 w-9 h-9 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(150,120,255,0.75), transparent 70%)",
                }}
              />
              <TorchArt lit />
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
