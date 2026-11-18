import world from "../data/world-map.json";
import type { Country } from "../data/travel";

// Which part of a map a page shows. On a two-page spread each page draws the
// same spread-wide map, offset by a page, so it reads as one map across the
// fold; on its own a page shows the whole thing.
export type MapPart = "left" | "right" | "full";

// What each page has printed in UV ink, only visible under the torch.
export type UvContent =
  | { kind: "data"; visited: number }
  | {
      kind: "stamps";
      part: MapPart;
      // The countries stamped on the pages in view, which the map is framed around.
      countries: Country[];
      all: Country[];
    }
  | { kind: "blank" }
  | { kind: "world"; part: MapPart; all: Country[] };

// A night sky in fluorescent pink and violet, after the Australian R series
// passport, whose visa pages turn into nightscapes under UV.
export const UV_GLOW = "#FF4FB3";
const UV_SOFT = "#FFC4EA";
// Home, in wattle gold.
const UV_HOME = "#FFD34D";
const UV_LINE = "#7CC8FF";
const UV_RED = "#FF3355";
const STAR = "#EAF4FF";

type Shape = {
  code: string | null;
  d: string;
  b: [number, number, number, number];
};
const shapes = world.countries as Shape[];

// Path length below which a country is too small to outline (Vatican City,
// San Marino, Monaco, Luxembourg) and only leaves a speck.
const MICROSTATE_PATH = 90;
const printed = shapes.filter((s) => s.d.length >= MICROSTATE_PATH);

// Each country's main landmass, for framing a map around it.
const landOf = new Map<string, Shape["b"]>();
for (const shape of shapes) {
  if (!shape.code) continue;
  const [x0, y0, x1, y1] = shape.b;
  const current = landOf.get(shape.code);
  if (!current || (x1 - x0) * (y1 - y0) > (current[2] - current[0]) * (current[3] - current[1]))
    landOf.set(shape.code, shape.b);
}

// Mulberry32: a small seeded random, so the stars sit in the same place on
// every visit.
function random(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A few stars per page, a handful of them four-pointed glints.
function Stars({ seed }: { seed: number }) {
  const next = random(seed * 7919 + 17);
  return (
    <g fill={STAR}>
      {Array.from({ length: 14 }, (_, i) => {
        const x = 4 + next() * 92;
        const y = 6 + next() * 128;
        const s = 0.4 + next() * 0.8;
        const glint = i % 4 === 0;
        return glint ? (
          <path
            key={i}
            d={`M${x} ${y - s * 1.8}L${x + s * 0.3} ${y - s * 0.3}L${x + s * 1.8} ${y}L${x + s * 0.3} ${y + s * 0.3}L${x} ${y + s * 1.8}L${x - s * 0.3} ${y + s * 0.3}L${x - s * 1.8} ${y}L${x - s * 0.3} ${y - s * 0.3}Z`}
            opacity={0.95}
          />
        ) : (
          <circle key={i} cx={x} cy={y} r={s * 0.32} opacity={0.55 + next() * 0.4} />
        );
      })}
    </g>
  );
}

// Guilloché ring, the spirograph line work on banknotes and passport pages.
function rosette(cx: number, cy: number, r: number, amp: number, petals: number) {
  const points: string[] = [];
  for (let i = 0; i <= 360; i++) {
    const t = (i / 360) * Math.PI * 2;
    const rr = r + amp * Math.sin(petals * t);
    points.push(`${(cx + rr * Math.cos(t)).toFixed(2)} ${(cy + rr * Math.sin(t)).toFixed(2)}`);
  }
  return `M${points.join("L")}Z`;
}
const ROSETTE = [0, 1, 2, 3, 4, 5].map((i) => rosette(50, 64, 22 + i * 2.2, 2.4 + i * 0.3, 18 + i * 2));

// A sprig of golden wattle, as the Australian photo page reveals under UV.
const WATTLE_PUFFS: [number, number, number][] = [
  [90, 120, 2.3],
  [83, 116, 2],
  [83, 110, 2.2],
  [76, 107, 1.9],
  [76, 100, 2.1],
  [69, 97, 1.8],
  [69, 91, 1.9],
  [63, 88, 1.6],
  [61, 82, 1.5],
];
function Wattle() {
  return (
    <g filter="url(#uv-glow)">
      <path d="M95 128 Q82 112 72 99 T57 79" fill="none" stroke={UV_HOME} strokeWidth="0.6" strokeLinecap="round" />
      {[
        "M88 119 q6 -9 13 -11",
        "M80 108 q-9 -2 -14 3",
        "M73 98 q4 -10 11 -13",
        "M66 90 q-8 0 -12 6",
      ].map((d) => (
        <path key={d} d={d} fill="none" stroke={UV_HOME} strokeWidth="0.45" strokeLinecap="round" opacity="0.8" />
      ))}
      {WATTLE_PUFFS.map(([x, y, r]) => (
        <g key={`${x}-${y}`} fill={UV_HOME}>
          <circle cx={x} cy={y} r={r * 0.6} />
          {[0, 1, 2, 3, 4, 5].map((k) => {
            const a = (k / 6) * Math.PI * 2;
            return <circle key={k} cx={x + Math.cos(a) * r * 0.6} cy={y + Math.sin(a) * r * 0.6} r={r * 0.38} />;
          })}
        </g>
      ))}
    </g>
  );
}

const SPREAD_VIEW_BOX = `-40 -20 1080 ${world.height + 40}`;
const placement = (part: MapPart, top: string, height: string) =>
  part === "full"
    ? `absolute inset-x-0 ${top} ${height} w-full`
    : `absolute ${top} ${height} w-[200%] ${part === "left" ? "left-0" : "-left-full"}`;

const worldView = (part: MapPart) => ({
  viewBox: SPREAD_VIEW_BOX,
  preserveAspectRatio: "xMidYMid meet",
  className: placement(part, part === "full" ? "top-[22%]" : "top-[13%]", part === "full" ? "h-[56%]" : "h-[74%]"),
});

// A map framed on the countries stamped on the pages in view, so neighbouring
// pages of one continent each show their own part of it, not the same map twice.
function framedView(codes: string[], part: MapPart) {
  let [x0, y0, x1, y1] = [Infinity, Infinity, -Infinity, -Infinity];
  for (const code of codes) {
    const b = landOf.get(code);
    if (!b) continue;
    x0 = Math.min(x0, b[0]);
    y0 = Math.min(y0, b[1]);
    x1 = Math.max(x1, b[2]);
    y1 = Math.max(y1, b[3]);
  }
  if (!Number.isFinite(x0)) [x0, y0, x1, y1] = [0, 0, world.width, world.height];
  const margin = Math.max(x1 - x0, y1 - y0) * 0.2 + 10;
  let w = Math.max(x1 - x0 + margin * 2, 110);
  let h = Math.max(y1 - y0 + margin * 2, 70);
  // Match the box the map is drawn in: 80% of a page's height, one page wide
  // or two.
  const aspect = (part === "full" ? 5 : 10) / (7 * 0.8);
  if (w / h < aspect) w = h * aspect;
  else h = w / aspect;
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  return {
    viewBox: `${(cx - w / 2).toFixed(1)} ${(cy - h / 2).toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`,
    preserveAspectRatio: "xMidYMid meet",
    className: placement(part, "top-[10%]", "h-[80%]"),
  };
}

// The map as printed: every country outlined, nothing to say which are mine.
export function BlankWorld({ part }: { part: MapPart }) {
  return (
    <svg {...worldView(part)} aria-hidden="true">
      <path
        d={world.graticule}
        fill="none"
        stroke="rgba(44,44,44,0.07)"
        strokeWidth="0.5"
        vectorEffect="non-scaling-stroke"
      />
      <g fill="rgba(44,44,44,0.05)" stroke="rgba(44,44,44,0.28)" strokeWidth="0.5">
        {printed.map((s, i) => (
          <path key={i} d={s.d} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
    </svg>
  );
}

// Below this size (in map units) a country is too small to see, so it gets a
// dot instead: Vatican City, Macao, Hong Kong.
const SPECK = 2.5;

function Land({ all, bright, dot }: { all: Country[]; bright: Set<string>; dot: number }) {
  const codes = new Map(all.map((c) => [c.code, c]));
  return (
    <>
      <g fill="none" stroke={UV_LINE} strokeWidth="0.6" opacity="0.4">
        {printed.map((s, i) => (
          <path key={i} d={s.d} vectorEffect="non-scaling-stroke" />
        ))}
      </g>
      <g filter="url(#uv-glow)">
        {shapes.map((s, i) => {
          const country = s.code ? codes.get(s.code) : undefined;
          if (!country) return null;
          const ink = country.home ? UV_HOME : UV_GLOW;
          const lit = bright.has(country.code);
          return (
            <g key={i} opacity={lit ? 1 : 0.4}>
              <path d={s.d} fill={ink} fillOpacity={lit ? 0.8 : 0.45} />
              <path d={s.d} fill={country.home ? "url(#uv-lines-home)" : "url(#uv-lines)"} />
              <path d={s.d} fill="none" stroke={UV_SOFT} strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
            </g>
          );
        })}
        {all.map((country) => {
          const b = landOf.get(country.code);
          if (!b || Math.max(b[2] - b[0], b[3] - b[1]) >= SPECK) return null;
          const lit = bright.has(country.code);
          const cx = (b[0] + b[2]) / 2;
          const cy = (b[1] + b[3]) / 2;
          return (
            <g key={country.code} opacity={lit ? 1 : 0.4}>
              <circle cx={cx} cy={cy} r={dot} fill={country.home ? UV_HOME : UV_GLOW} />
              <circle cx={cx} cy={cy} r={dot * 2} fill="none" stroke={UV_SOFT} strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
            </g>
          );
        })}
      </g>
    </>
  );
}

const glowText = {
  fill: UV_GLOW,
  textAnchor: "middle" as const,
  style: { fontFamily: "var(--font-sweet), var(--font-sans), sans-serif" },
};

export function UvPage({ content, seed }: { content: UvContent; seed: number }) {
  if (content.kind === "stamps" || content.kind === "world") {
    const view =
      content.kind === "stamps"
        ? framedView(
            content.countries.map((c) => c.code),
            content.part,
          )
        : worldView(content.part);
    const bright = new Set((content.kind === "stamps" ? content.countries : content.all).map((c) => c.code));
    return (
      <>
        <svg viewBox="0 0 100 140" className="absolute inset-0 w-full h-full">
          <Stars seed={seed} />
          {content.kind === "world" && (
            <text
              {...glowText}
              x="50"
              y="16"
              fontSize={content.part === "full" ? 2.6 : 3.4}
              letterSpacing={content.part === "full" ? 0.8 : 1.6}
              filter="url(#uv-glow)"
            >
              {content.part === "left"
                ? "EVERYWHERE SO FAR"
                : content.part === "right"
                  ? "AND COUNTING"
                  : "EVERYWHERE SO FAR · AND COUNTING"}
            </text>
          )}
        </svg>
        <svg {...view}>
          {/* A few pixels across however far the map is zoomed in. */}
          <Land
            all={content.all}
            bright={bright}
            dot={Number(view.viewBox.split(" ")[2]) * (content.part === "full" ? 0.008 : 0.004)}
          />
        </svg>
      </>
    );
  }

  if (content.kind === "data") {
    return (
      <>
        {/* Like a real photo page, the portrait turns red under UV. Laid out
            the same way as the photo on the data page so it lands on it. */}
        <div
          className="absolute left-5 top-10"
          style={{
            width: "calc((100% - 40px) * 0.38)",
            aspectRatio: "4 / 5",
            backgroundColor: UV_RED,
            opacity: 0.6,
            backgroundImage: `repeating-linear-gradient(170deg, transparent 0 5px, rgba(255,210,220,0.55) 5px 6px)`,
          }}
        />
        <svg viewBox="0 0 100 140" className="absolute inset-0 w-full h-full">
          <Stars seed={seed} />
          <Wattle />
          <text {...glowText} x="50" y="134" fontSize="1.6" letterSpacing="0.4" opacity="0.7">
            {"KEVINCHEN".repeat(9)}
          </text>
        </svg>
      </>
    );
  }

  return (
    <svg viewBox="0 0 100 140" className="absolute inset-0 w-full h-full">
      <Stars seed={seed} />
      <g fill="none" stroke={UV_LINE} strokeWidth="0.25" opacity="0.7">
        {ROSETTE.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
      <g filter="url(#uv-glow)">
        {["ROOM", "FOR", "MORE"].map((word, i) => (
          <text key={word} {...glowText} x="50" y={62 + i * 8} fontSize="5" letterSpacing="2">
            {word}
          </text>
        ))}
      </g>
    </svg>
  );
}

// The thread binding the pages, which glows under UV like the stitching in an
// Australian passport.
export function UvStitch() {
  return (
    <span
      className="absolute left-1/2 top-[3%] bottom-[3%] w-[2px] -translate-x-1/2"
      style={{
        backgroundImage: `repeating-linear-gradient(to bottom, ${UV_SOFT} 0 7px, transparent 7px 13px)`,
        filter: `drop-shadow(0 0 3px ${UV_GLOW})`,
      }}
    />
  );
}

// Glow and fine-line security print shared by every UV page; render once.
export function UvDefs() {
  const lines = (id: string, ink: string) => (
    <pattern id={id} width="6" height="2.6" patternUnits="userSpaceOnUse">
      <path d="M0 1.3 Q1.5 0 3 1.3 T6 1.3" fill="none" stroke={ink} strokeWidth="0.45" />
    </pattern>
  );
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <defs>
        <filter id="uv-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {lines("uv-lines", UV_SOFT)}
        {lines("uv-lines-home", "#FFF1B8")}
      </defs>
    </svg>
  );
}
