import Link from "next/link";

// The way into /passport: an ink postmark on the corner of the contact photo,
// as if the page had been mailed. Deliberately unlabelled on screen.
export default function Postmark({ className = "" }: { className?: string }) {
  const ink = "#8A3B32";
  return (
    <Link
      href="/passport"
      aria-label="Postmark: open Kevin's passport"
      className={`group block w-[88px] md:w-[104px] ${className}`}
    >
      <svg
        viewBox="0 0 160 120"
        className="w-full h-auto -rotate-12 transition-transform duration-[600ms] ease-[var(--ease-out)] group-hover:-rotate-3 group-hover:scale-110 group-focus-visible:-rotate-3 group-focus-visible:scale-110"
        aria-hidden="true"
      >
        <defs>
          <path id="postmark-arc" d="M 22 60 A 38 38 0 1 1 98 60 A 38 38 0 1 1 22 60" />
        </defs>
        <g fill="none" stroke={ink} strokeLinecap="round">
          {[46, 56, 66, 76].map((y) => (
            <path
              key={y}
              d={`M 96 ${y} q 8 -5 16 0 t 16 0 t 16 0 t 12 0`}
              strokeWidth="2"
              opacity="0.85"
            />
          ))}
        </g>
        <circle cx="60" cy="60" r="46" fill="#FAF2E6" fillOpacity="0.92" stroke={ink} strokeWidth="2.6" />
        <circle cx="60" cy="60" r="31" fill="none" stroke={ink} strokeWidth="1.2" />
        <text
          fill={ink}
          fontSize="10.5"
          letterSpacing="2.6"
          style={{ fontFamily: "var(--font-sweet), var(--font-sans), sans-serif" }}
        >
          <textPath href="#postmark-arc">SYDNEY NSW · POSTED · KC ·</textPath>
        </text>
        <text
          x="60"
          y="57"
          textAnchor="middle"
          fill={ink}
          fontSize="13"
          letterSpacing="1.5"
          style={{ fontFamily: "var(--font-sweet), var(--font-sans), sans-serif" }}
        >
          AIR
        </text>
        <text
          x="60"
          y="72"
          textAnchor="middle"
          fill={ink}
          fontSize="13"
          letterSpacing="1.5"
          style={{ fontFamily: "var(--font-sweet), var(--font-sans), sans-serif" }}
        >
          MAIL
        </text>
      </svg>
    </Link>
  );
}
