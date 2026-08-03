import { Star } from "lucide-react";

const REVIEWS = [
  { name: "Marcus T.", tag: "Lost 22 lbs", text: "I've tried every app out there. Having a real coach who adjusts my plan every week changed everything. Down 22 pounds and actually stronger." },
  { name: "Priya K.", tag: "First pull-up", text: "The nutrition coaching alone was worth it. No crazy restrictions, just habits that stuck. Hit my first unassisted pull-up last month!" },
  { name: "Devon R.", tag: "Gained 15 lbs muscle", text: "As a student on a budget and tight schedule, the virtual sessions were perfect. Packed on 15 lbs of muscle over a semester." },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="px-6 md:px-14 py-24">
      <div className="max-w-6xl mx-auto">
        <p className="eyebrow">Real People. Real Results.</p>
        <h2 className="h-display text-5xl md:text-6xl">The Proof Is In The Progress</h2>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {REVIEWS.map((r) => (
            <div key={r.name} className="card flex flex-col">
              <div className="flex gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-white/70">“{r.text}”</p>
              <div className="mt-5 flex items-center justify-between border-t border-ink-800 pt-4">
                <span className="font-semibold">{r.name}</span>
                <span className="rounded-sm bg-gold/10 px-2.5 py-1 text-xs font-medium text-gold">
                  {r.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
