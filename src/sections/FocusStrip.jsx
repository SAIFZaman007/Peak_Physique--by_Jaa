import { useEffect, useState } from "react";
import { api } from "../lib/api";

// Matches the demo UI's 4-photo "focus" strip between About and the AI
// Tools section. Content-managed via SiteContent (section_key
// "focus_strip") so the trainer can swap any of the 4 photos/labels from
// the dashboard without a code change.
const FALLBACK = [
  { label: "Strength", alt: "Strength training with weights",
    image_url: "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=600&q=80&auto=format&fit=crop&crop=center" },
  { label: "Cardio", alt: "Cardio and endurance training",
    image_url: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&q=80&auto=format&fit=crop&crop=center" },
  { label: "Nutrition", alt: "Nutrition and healthy eating",
    image_url: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=80&auto=format&fit=crop&crop=center" },
  { label: "Recovery", alt: "Flexibility and recovery training",
    image_url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80&auto=format&fit=crop&crop=center" },
];

export default function FocusStrip() {
  const [items, setItems] = useState(FALLBACK);

  useEffect(() => {
    api.get("/content/focus_strip")
      .then(({ data }) => data?.data?.items?.length && setItems(data.data.items))
      .catch(() => {}); // keep FALLBACK — section still renders correctly offline
  }, []);

  return (
    <section className="grid grid-cols-2 overflow-hidden md:grid-cols-4">
      {items.map((it, i) => (
        <div key={`${it.label}-${i}`} className="group relative h-56 overflow-hidden md:h-72">
          <img
            src={it.image_url}
            alt={it.alt || it.label}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/10 to-transparent p-4">
            <span className="text-[11px] font-bold uppercase tracking-[2px] text-gold">
              {it.label}
            </span>
          </div>
        </div>
      ))}
    </section>
  );
}