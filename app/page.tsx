import Link from "next/link";

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
