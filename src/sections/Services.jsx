import { Video, Apple, Dumbbell, Users, MonitorSmartphone, Package } from "lucide-react";

const SERVICES = [
  { icon: Video, name: "Online Consultation", price: "$49", desc: "A deep-dive video call to map your goals, history and a clear plan of attack." },
  { icon: Apple, name: "Nutrition Counseling", price: "$79", desc: "Personalized macros and habit coaching that fit your schedule and tastes." },
  { icon: Dumbbell, name: "1-on-1 Coaching", price: "$149", desc: "Fully custom programming with weekly check-ins and unlimited messaging." },
  { icon: Users, name: "In-Person Training", price: "$99", desc: "Hands-on sessions focused on form, intensity and real accountability." },
  { icon: MonitorSmartphone, name: "Virtual Training", price: "$89", desc: "Live-guided remote sessions from anywhere, on your schedule." },
  { icon: Package, name: "All-in-One Bundle", price: "$199", desc: "Training, nutrition and check-ins combined for the complete experience.", featured: true },
];

export default function Services() {
  return (
    <section id="services" className="px-6 md:px-14 py-24">
      <div className="max-w-6xl mx-auto">
        <p className="eyebrow">What We Offer</p>
        <h2 className="h-display text-5xl md:text-6xl">Train Your Way</h2>
        <p className="mt-4 max-w-xl text-white/55">
          Every athlete is different. Pick the level of support that fits where
          you are right now — and level up whenever you're ready.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <div
              key={s.name}
              className={`card group hover:border-gold/50 ${
                s.featured ? "border-gold/40 bg-gradient-to-b from-gold/[0.06] to-transparent" : ""
              }`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-gold/10 text-gold group-hover:bg-gold group-hover:text-ink-950 transition-colors">
                <s.icon size={22} />
              </div>
              <h3 className="mt-5 text-lg font-semibold">{s.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/55">{s.desc}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-display text-2xl text-gold">{s.price}</span>
                <span className="text-xs text-muted">/ starting</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
