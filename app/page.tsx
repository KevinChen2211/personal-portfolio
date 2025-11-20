import Link from "next/link";

const highlights = [
  {
    title: "Design pass",
    detail: "Fresh typography, motion system, and dark mode polish",
    eta: "Wrapping this week",
  },
  {
    title: "Work stories",
    detail: "Curated case studies that read like narratives",
    eta: "Drafting content",
  },
  {
    title: "Interactive toys",
    detail: "Mini experiments that show how I think through UI",
    eta: "Prototyping",
  },
];

const updates = [
  {
    label: "Latest",
    title: "Accessibility audit complete",
    note: "Keyboard traps removed and color contrast tightened.",
  },
  {
    label: "In progress",
    title: "Motion choreography",
    note: "Micro-interactions wired up in Framer Motion.",
  },
  {
    label: "Queued",
    title: "Writing voice",
    note: "Drafting personal stories and project retrospectives.",
  },
];

const milestones = [
  { label: "Planning", status: "✅ Locked" },
  { label: "Build", status: "🛠️ 60% done" },
  { label: "Launch window", status: "📅 Early December" },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.25),_transparent_55%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.05)_1px,transparent_1px)] opacity-30 [background-size:60px_60px]" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-16 sm:px-10">
        <section className="rounded-3xl border border-white/10 bg-zinc-900/60 p-10 shadow-2xl shadow-amber-500/10">
          <p className="inline-flex items-center gap-2 rounded-full border border-amber-400/60 bg-amber-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-amber-200">
            <span className="h-2 w-2 animate-pulse rounded-full bg-amber-300" />
            Under construction
          </p>
          <h1 className="mt-6 text-4xl font-semibold leading-tight sm:text-5xl">
            Kevin Chen is rebuilding this corner of the internet.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-300">
            I am relaunching my portfolio with richer storytelling, interactive
            experiments, and a behind-the-scenes view into how I design for the
            web. In the meantime, here is the state of the build.
          </p>

          <div className="mt-8 flex flex-col gap-3 text-sm font-medium text-zinc-200 sm:flex-row">
            <Link
              href="mailto:hello@kevinchen.design?subject=Keep%20me%20posted"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 px-6 py-3 text-base font-semibold text-zinc-950 transition hover:contrast-125"
            >
              Notify me when it ships!
            </Link>
            <Link
              href="https://www.linkedin.com/in/kevinsoftwarewiz"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-base font-semibold transition hover:border-white/60"
            >
              Connect on LinkedIn
            </Link>
          </div>

          <div className="mt-10 space-y-4">
            <div className="flex items-center justify-between text-sm text-zinc-400">
              <span>Current progress</span>
              <span>62%</span>
            </div>
            <div className="h-2 rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-600"
                style={{ width: "62%" }}
              />
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-zinc-400">
              {milestones.map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <span className="text-white">{item.status}</span>
                  <span className="text-zinc-500">• {item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 rounded-3xl border border-white/5 bg-zinc-900/40 p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">
                Build log updates
              </h2>
              <span className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                Live feed
              </span>
            </div>
            <div className="space-y-4">
              {updates.map((update) => (
                <article
                  key={update.title}
                  className="rounded-2xl border border-white/5 bg-black/20 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-200">
                    {update.label}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-white">
                    {update.title}
                  </h3>
                  <p className="mt-1 text-sm text-zinc-400">{update.note}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-amber-400/40 bg-zinc-950/80 p-6">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-14 -translate-y-1/2 bg-[repeating-linear-gradient(-45deg,_#fbbf24,_#fbbf24_16px,_#18181b_16px,_#18181b_32px)] opacity-70" />
            <h2 className="text-lg font-semibold text-white">Need a hand?</h2>
            <p className="mt-2 text-sm text-zinc-300">
              I am still freelancing while the site ships. Reach out if you
              would like to collaborate on design systems, product strategy, or
              front-end builds.
            </p>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-zinc-500">Email</dt>
                <dd className="text-white">hello@kevinchen.design</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500">Time zone</dt>
                <dd className="text-white">GMT-8 · Pacific</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500">Availability</dt>
                <dd className="text-white">2 slots open</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {highlights.map((highlight) => (
            <article
              key={highlight.title}
              className="rounded-3xl border border-white/5 bg-gradient-to-b from-zinc-900/50 to-zinc-950/70 p-6"
            >
              <p className="text-xs uppercase tracking-[0.25em] text-amber-200">
                {highlight.eta}
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-white">
                {highlight.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-400">{highlight.detail}</p>
            </article>
          ))}
        </section>

        <footer className="flex flex-col gap-3 border-t border-white/10 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {new Date().getFullYear()} Kevin Chen. All rights reserved.
          </span>
          <span>Relaunch ETA · December 2025</span>
        </footer>
      </main>
    </div>
  );
}
