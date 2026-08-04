import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Video, Apple, Dumbbell, Users, MonitorSmartphone, Package, ShoppingCart, Zap } from "lucide-react";
import { api, apiError } from "../lib/api";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { formatCurrency } from "../lib/utils";

// Maps the `icon` string stored in the DB to an actual component — keeps
// the admin dashboard's "icon" field a simple text dropdown instead of
// needing to ship component references over JSON.
const ICONS = { Video, Apple, Dumbbell, Users, MonitorSmartphone, Package };

const FALLBACK = [
  { id: 1, icon: "Video", name: "Online Consultation", price_label: "$49", price_suffix: "session", price_cents: 4900,
    description: "A deep-dive strategy session to assess your goals, current fitness level, lifestyle, and build your roadmap to results.",
    image_url: null, is_purchasable: true },
  { id: 2, icon: "Apple", name: "Nutrition Counseling", price_label: "$79", price_suffix: "month", price_cents: 7900,
    description: "Custom meal planning and macro coaching designed around your campus lifestyle, budget, and body composition goals.",
    image_url: null, is_purchasable: true },
  { id: 3, icon: "Dumbbell", name: "1-on-1 Coaching", price_label: "$149", price_suffix: "starting", price_cents: 14900,
    description: "Fully custom programming with weekly check-ins and unlimited messaging.", image_url: null, is_featured: true, is_purchasable: true },
  { id: 4, icon: "Users", name: "In-Person Training", price_label: "$99", price_suffix: "starting", price_cents: 9900,
    description: "Hands-on sessions focused on form, intensity and real accountability.", image_url: null, is_purchasable: true },
  { id: 5, icon: "MonitorSmartphone", name: "Virtual Training", price_label: "$89", price_suffix: "starting", price_cents: 8900,
    description: "Live-guided remote sessions from anywhere, on your schedule.", image_url: null, is_purchasable: true },
  { id: 6, icon: "Package", name: "All-in-One Bundle", price_label: "$199", price_suffix: "starting", price_cents: 19900,
    description: "Training, nutrition and check-ins combined for the complete experience.", image_url: null, is_purchasable: true },
];

export default function Services() {
  const [services, setServices] = useState(FALLBACK);
  const [busyId, setBusyId] = useState(null);
  const [note, setNote] = useState("");
  const { user } = useAuth();
  const { addItem, setOpen } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/services")
      .then(({ data }) => data?.length && setServices(data))
      .catch(() => {}); // keep FALLBACK — the section still renders correctly offline
  }, []);

  const addToCart = (s) => {
    addItem({ type: "service", id: s.id, name: s.name, price_cents: s.price_cents, image_url: s.image_url });
    setOpen(true);
  };

  const buyNow = async (s) => {
    setNote("");
    if (!user) {
      navigate("/register", { state: { redirectTo: "checkout" } });
      return;
    }
    setBusyId(s.id);
    try {
      const { data } = await api.post("/payments/checkout", {
        items: [{ type: "service", id: s.id, quantity: 1 }],
      });
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        setNote("Payments aren't switched on yet. Add Stripe keys to enable live checkout.");
      }
    } catch (err) {
      setNote(apiError(err));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section id="services" className="px-6 md:px-14 py-24">
      <div className="max-w-6xl mx-auto">
        <p className="eyebrow">What We Offer</p>
        <h2 className="h-display text-5xl md:text-6xl">Train Your Way</h2>
        <p className="mt-4 max-w-xl text-white/55">
          Every service is tailored to your goals, schedule, and fitness level — whether
          you're a beginner or an athlete.
        </p>

        {note && (
          <div className="mt-6 rounded-sm border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-gold">
            {note}
          </div>
        )}

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const Icon = ICONS[s.icon] || Dumbbell;
            const purchasable = s.is_purchasable !== false && s.price_cents > 0;
            return (
              <div
                key={s.id}
                className={`card overflow-hidden !p-0 group hover:border-gold/50 flex flex-col ${
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
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-gold/10 text-gold group-hover:bg-gold group-hover:text-ink-950 transition-colors">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{s.name}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-white/55">{s.description}</p>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="font-display text-2xl text-gold">
                      {s.price_cents > 0 ? formatCurrency(s.price_cents) : s.price_label}
                    </span>
                    <span className="text-xs text-muted">/ {s.price_suffix}</span>
                  </div>

                  {purchasable ? (
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => buyNow(s)}
                        disabled={busyId === s.id}
                        className="btn-primary !flex-1 !px-3 !py-2.5 !text-xs"
                      >
                        <Zap size={14} /> {busyId === s.id ? "Starting…" : "Buy Now"}
                      </button>
                      <button
                        onClick={() => addToCart(s)}
                        className="btn-outline !px-3 !py-2.5 !text-xs"
                        aria-label={`Add ${s.name} to cart`}
                        title="Add to cart"
                      >
                        <ShoppingCart size={16} />
                      </button>
                    </div>
                  ) : (
                    <a href="#booking" className="btn-outline mt-4 !px-3 !py-2.5 !text-xs text-center">
                      Book a Call
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}