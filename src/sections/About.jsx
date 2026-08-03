import { CheckCircle2 } from "lucide-react";

const POINTS = [
  "Evidence-based programming, not fads",
  "Plans that flex around a busy schedule",
  "Real accountability and weekly check-ins",
  "Sustainable nutrition — no crash diets",
];

const STATS = [
  { num: "500+", label: "Sessions Coached" },
  { num: "97%", label: "Goal Completion" },
  { num: "8yr", label: "Experience" },
];

const BANDS = ["Strength", "Discipline", "Nutrition", "Mindset"];

export default function About() {
  return (
    <>
      <section id="about" className="px-6 md:px-14 py-24">
        <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">Why Peak Physique</p>
            <h2 className="h-display text-5xl md:text-6xl">
              Built To Help <span className="text-gold">You Rise</span>
            </h2>
            <p className="mt-5 text-white/60 leading-relaxed">
              Peak Physique started with one belief: everyone deserves a coach
              who actually listens. No cookie-cutter PDFs, no guilt — just a
              clear plan, honest feedback and steady progress you can feel.
            </p>
            <ul className="mt-8 space-y-3">
              {POINTS.map((p) => (
                <li key={p} className="flex items-start gap-3 text-white/75">
                  <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-gold" />
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex gap-10 border-t border-white/10 pt-8">
              {STATS.map((s) => (
                <div key={s.label}>
                  <div className="font-display text-4xl tracking-[2px] text-gold">{s.num}</div>
                  <div className="mt-0.5 text-xs uppercase tracking-[1.5px] text-muted">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {BANDS.map((b, i) => (
              <div
                key={b}
                className={`relative flex aspect-square items-end overflow-hidden rounded-sm border border-ink-700 p-5 ${
                  i % 3 === 0
                    ? "bg-gradient-to-br from-gold/25 via-ink-800 to-ink-950"
                    : "bg-gradient-to-tr from-ink-800 to-ink-950"
                }`}
              >
                <span className="font-display text-3xl tracking-[2px] text-white/90">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Atmosphere band */}
      <section className="overflow-hidden border-y border-ink-800 bg-ink-900 py-0">
        <div className="flex divide-x divide-ink-800">
          {["Push Limits", "Stay Consistent", "Get Stronger", "Own Your Peak"].map((t, i) => (
            <div
              key={t}
              className={`flex-1 px-4 py-10 text-center ${i % 2 ? "bg-ink-950/40" : ""}`}
            >
              <span className="font-display text-xl md:text-3xl tracking-[2px] text-white/70">
                {t}
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
