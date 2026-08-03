import { useEffect, useState } from "react";
import { Video, Apple, Dumbbell, Users, MonitorSmartphone, Package } from "lucide-react";
import { api } from "../lib/api";

// Maps the `icon` string stored in the DB to an actual component — keeps
// the admin dashboard's "icon" field a simple text dropdown instead of
// needing to ship component references over JSON.
const ICONS = { Video, Apple, Dumbbell, Users, MonitorSmartphone, Package };

const FALLBACK = [
  { id: "f1", icon: "Video", name: "Online Consultation", price_label: "$49", price_suffix: "session",
    description: "A deep-dive strategy session to assess your goals, current fitness level, lifestyle, and build your roadmap to results.",
    image_url: null },
  { id: "f2", icon: "Apple", name: "Nutrition Counseling", price_label: "$79", price_suffix: "month",
    description: "Custom meal planning and macro coaching designed around your campus lifestyle, budget, and body composition goals.",
    image_url: null },
  { id: "f3", icon: "Dumbbell", name: "1-on-1 Coaching", price_label: "$149", price_suffix: "starting",
    description: "Fully custom programming with weekly check-ins and unlimited messaging.", image_url: null, is_featured: true },
  { id: "f4", icon: "Users", name: "In-Person Training", price_label: "$99", price_suffix: "starting",
    description: "Hands-on sessions focused on form, intensity and real accountability.", image_url: null },
  { id: "f5", icon: "MonitorSmartphone", name: "Virtual Training", price_label: "$89", price_suffix: "starting",
    description: "Live-guided remote sessions from anywhere, on your schedule.", image_url: null },
  { id: "f6", icon: "Package", name: "All-in-One Bundle", price_label: "$199", price_suffix: "starting",
    description: "Training, nutrition and check-ins combined for the complete experience.", image_url: null },
];

export default function Services() {
  const [services, setServices] = useState(FALLBACK);

  useEffect(() => {
    api.get("/services")
      .then(({ data }) => data?.length && setServices(data))
      .catch(() => {}); // keep FALLBACK — the section still renders correctly offline
  }, []);

  return (
    <section id="services" className="px-6 md:px-14 py-24">
      <div className="max-w-6xl mx-auto">
        <p className="eyebrow">What We Offer</p>
        <h2 className="h-display text-5xl md:text-6xl">Train Your Way</h2>
        <p className="mt-4 max-w-xl text-white/55">
          Every service is tailored to your goals, schedule, and fitness level — whether
          you're a beginner or an athlete.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const Icon = ICONS[s.icon] || Dumbbell;
            return (
              <div
                key={s.id}
                className={`card overflow-hidden !p-0 group hover:border-gold/50 ${
                  s.is_featured ? "border-gold/40" : ""
                }`}
              >
                {s.image_url && (
                  <div className="aspect-[16/10] overflow-hidden bg-ink-800">
                    <img
                      src={s.image_url}
                      alt={s.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-gold/10 text-gold group-hover:bg-gold group-hover:text-ink-950 transition-colors">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{s.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{s.description}</p>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="font-display text-2xl text-gold">{s.price_label}</span>
                    <span className="text-xs text-muted">/ {s.price_suffix}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}