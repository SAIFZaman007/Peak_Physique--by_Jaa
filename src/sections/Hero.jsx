import { ArrowRight } from "lucide-react";

const STATS = [
  { num: "100%", label: "Custom Plans" },
  { num: "5★", label: "Client Rated" },
  { num: "24/7", label: "Coach Support" },
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden px-6 md:px-14 pt-32 pb-20"
      style={{
        background:
          "linear-gradient(135deg, #0A0A0A 0%, #1a1000 50%, #0A0A0A 100%)",
      }}
    >
      <div className="gold-grid absolute inset-0 z-0" />
      <div
        className="absolute z-0 rounded-full"
        style={{
          width: 600,
          height: 600,
          right: -100,
          top: "50%",
          transform: "translateY(-50%)",
          background:
            "radial-gradient(circle, rgba(245,166,35,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-3xl animate-fadeUp">
        <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[2px] text-gold">
          <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse2" />
          Certified Personal Training
        </span>

        <h1 className="h-display mt-7 text-[64px] sm:text-[84px] lg:text-[104px]">
          Build Your
          <span className="block text-gold">Peak Physique</span>
        </h1>

        <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-white/65">
          Transform your body, habits and confidence with a coach who builds
          every plan around <span className="text-white">you</span> — training,
          nutrition and accountability that actually fit your life.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a href="#booking" className="btn-primary">
            Start Free Intro Call <ArrowRight size={18} />
          </a>
          <a href="#services" className="btn-outline">
            See The Programs
          </a>
        </div>

        <div className="mt-16 flex gap-12 border-t border-white/10 pt-10">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="font-display text-4xl tracking-[2px] text-gold">
                {s.num}
              </div>
              <div className="mt-0.5 text-xs uppercase tracking-[1.5px] text-muted">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
