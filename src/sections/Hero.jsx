import { useEffect, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { api } from "../lib/api";

const FALLBACK = {
  eyebrow: "Now Accepting Campus Clients",
  heading_line1: "Build Your",
  heading_line2: "Peak",
  heading_line3: "Physique",
  subheading:
    "Transform your body, fuel your performance, and unlock your full potential — with personalized training built for college life.",
  cta_primary: "Start Your Journey",
  cta_secondary: "Try AI Tools",
  stats: [
    { num: "100%", label: "Personalized Programs" },
    { num: "5+", label: "Service Options" },
    { num: "24/7", label: "AI Support" },
  ],
};

export default function Hero() {
  const [c, setC] = useState(FALLBACK);

  useEffect(() => {
    api.get("/content/hero")
      .then(({ data }) => data?.data && setC({ ...FALLBACK, ...data.data }))
      .catch(() => {}); // keep FALLBACK
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden px-6 md:px-14 pt-32 pb-20"
      style={{
        background: "linear-gradient(135deg, #0A0A0A 0%, #1a1000 50%, #0A0A0A 100%)",
      }}
    >
      <div className="gold-grid absolute inset-0 z-0" />
      <div
        className="absolute z-0 rounded-full"
        style={{
          width: 600, height: 600, right: -100, top: "50%", transform: "translateY(-50%)",
          background: "radial-gradient(circle, rgba(245,166,35,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-3xl animate-fadeUp">
        <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[2px] text-gold">
          <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse2" />
          {c.eyebrow}
        </span>

        <h1 className="h-display mt-7 text-[64px] sm:text-[84px] lg:text-[104px]">
          {c.heading_line1}
          <span className="block text-gold">{c.heading_line2}</span>
          <span className="block text-white">{c.heading_line3}</span>
        </h1>

        <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-white/65">
          {c.subheading}
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a href="#booking" className="btn-primary">
            {c.cta_primary} <ArrowRight size={18} />
          </a>
          <a href="#tools" className="btn-outline">
            <Sparkles size={16} /> {c.cta_secondary}
          </a>
        </div>

        <div className="mt-16 flex gap-12 border-t border-white/10 pt-10">
          {c.stats.map((s) => (
            <div key={s.label}>
              <div className="font-display text-4xl tracking-[2px] text-gold">{s.num}</div>
              <div className="mt-0.5 text-xs uppercase tracking-[1.5px] text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}