import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { api } from "../lib/api";

const FALLBACK = [
  { id: "f1", name: "Marcus T.", role: "Sophomore · Lost 18 lbs", rating: 5, result_tag: "Lost 18 lbs", avatar_url: null,
    quote: "I lost 18 lbs in my first semester and actually kept it off. Peak Physique built a plan around my dining hall and class schedule — it actually fit my life." },
  { id: "f2", name: "DeShawn R.", role: "Junior · Gained 22 lbs muscle", rating: 5, result_tag: "Gained 22 lbs muscle", avatar_url: null,
    quote: "The virtual training sessions are perfect for my schedule. I went from barely benching 95 lbs to 185 lbs in 4 months. The programming is elite." },
  { id: "f3", name: "Aaliyah S.", role: "Freshman · Body recomp", rating: 5, result_tag: "Body recomp", avatar_url: null,
    quote: "The nutrition coaching alone was worth every penny. I finally understand how to eat for my goals. The AI tools on the site helped me figure out where I was going wrong." },
];

export default function Testimonials() {
  const [reviews, setReviews] = useState(FALLBACK);

  useEffect(() => {
    api.get("/testimonials")
      .then(({ data }) => data?.length && setReviews(data))
      .catch(() => {});
  }, []);

  return (
    <section id="testimonials" className="px-6 md:px-14 py-24">
      <div className="max-w-6xl mx-auto">
        <p className="eyebrow">Client Results</p>
        <h2 className="h-display text-5xl md:text-6xl">Real People. Real Results.</h2>
        <p className="mt-4 max-w-xl text-white/55">
          Here's what students are saying after working with Peak Physique.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {reviews.map((r) => (
            <div key={r.id} className="card flex flex-col">
              <div className="flex gap-1 text-gold">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-white/70">“{r.quote}”</p>
              <div className="mt-5 flex items-center gap-3 border-t border-ink-800 pt-4">
                {r.avatar_url ? (
                  <img
                    src={r.avatar_url}
                    alt={r.name}
                    className="h-10 w-10 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/15 font-display text-gold">
                    {r.name.charAt(0)}
                  </div>
                )}
                <div className="min-w-0">
                  <div className="truncate font-semibold">{r.name}</div>
                  <div className="truncate text-xs text-white/40">{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}