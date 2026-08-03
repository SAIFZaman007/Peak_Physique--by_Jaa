import { useEffect, useState } from "react";
import { api } from "../lib/api";

const FALLBACK = {
  eyebrow: "Our Mission",
  heading: "Built To Help You Rise",
  body:
    "Peak Physique was built on a mission — to help students build stronger, healthier lives while navigating the real challenges of campus life.\n\n" +
    "We know what it takes to balance classes, late nights, dining hall food, and still want to look and feel your best. That's exactly why we built Peak Physique — training programs that actually work in the real world of college.\n\n" +
    "Our approach combines science-based programming with practical nutrition strategies to help you build the body and the discipline to match your ambitions. Every program is NASM-certified, science-driven, and built with intention.",
  image_url: null,
  image_caption: "Science-Based Training",
  stats: [
    { num: "100%", label: "Science-Based" },
    { num: "1:1", label: "Personalized" },
    { num: "0", label: "Cookie-Cutter Plans" },
  ],
  tags: ["NASM-Certified", "Nutrition Coaching", "Strength & Conditioning", "Body Recomposition", "Campus-Focused", "Real Results"],
};

const BANDS = ["Push Limits", "Stay Consistent", "Get Stronger", "Own Your Peak"];

export default function About() {
  const [c, setC] = useState(FALLBACK);

  useEffect(() => {
    api.get("/content/about")
      .then(({ data }) => data?.data && setC({ ...FALLBACK, ...data.data }))
      .catch(() => {});
  }, []);

  // `body` is stored as one string with blank-line breaks between
  // paragraphs — splitting here keeps the admin-side JSON simple (one
  // text field) while still rendering as proper <p> tags like the demo.
  const paragraphs = (c.body || "").split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);

  return (
    <>
      <section id="about" className="px-6 md:px-14 py-24">
        <div className="max-w-6xl mx-auto grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="eyebrow">{c.eyebrow}</p>
            <h2 className="h-display text-5xl md:text-6xl">{c.heading}</h2>

            {paragraphs.map((para, i) => (
              <p key={i} className="mt-5 text-white/60 leading-relaxed">{para}</p>
            ))}

            <div className="mt-8 flex flex-wrap gap-2">
              {(c.tags || []).map((t) => (
                <span key={t} className="rounded-full border border-ink-700 px-3 py-1.5 text-xs text-white/60">
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-10 flex gap-10 border-t border-white/10 pt-8">
              {c.stats.map((s) => (
                <div key={s.label}>
                  <div className="font-display text-4xl tracking-[2px] text-gold">{s.num}</div>
                  <div className="mt-0.5 text-xs uppercase tracking-[1.5px] text-muted">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {c.image_url ? (
            <div className="relative overflow-hidden rounded-sm border border-ink-700">
              <img src={c.image_url} alt={c.image_caption} className="aspect-[4/5] w-full object-cover" />
              {c.image_caption && (
                <span className="absolute bottom-4 left-4 rounded-sm bg-ink-950/80 px-3 py-1.5 text-xs font-medium text-gold backdrop-blur">
                  {c.image_caption}
                </span>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {/* {BANDS.map((b, i) => (
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
              ))} */}
            </div>
          )}
        </div>
      </section>

      {/* Atmosphere band */}
      <section className="overflow-hidden border-y border-ink-800 bg-ink-900 py-0">
        <div className="flex divide-x divide-ink-800">
          {BANDS.map((t, i) => (
            <div key={t} className={`flex-1 px-4 py-10 text-center ${i % 2 ? "bg-ink-950/40" : ""}`}>
              <span className="font-display text-xl md:text-3xl tracking-[2px] text-white/70">{t}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}