import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { api, apiError } from "../lib/api";
import { useAuth } from "../context/AuthContext.jsx";
import { formatCurrency } from "../lib/utils";

const FALLBACK = [
  { slug: "starter", name: "Starter", price_cents: 4900, interval: "one_time", is_featured: false,
    features: ["60-min strategy session", "Goal assessment & roadmap", "Sample workout template", "Nutrition guidelines", "7-day support"] },
  { slug: "peak", name: "Peak", price_cents: 14900, interval: "month", is_featured: true,
    features: ["Full 1-on-1 coaching", "Custom workout program", "Nutrition coaching", "Weekly check-ins", "Unlimited messaging", "Progress tracking"] },
  { slug: "elite", name: "Elite", price_cents: 19900, interval: "month", is_featured: false,
    features: ["Everything in Peak", "4 live sessions / month", "In-person OR virtual", "Priority response (<1hr)", "Supplement guidance", "Monthly body analysis", "Campus lifestyle planning"] },
];

export default function Pricing() {
  const [plans, setPlans] = useState(FALLBACK);
  const [busy, setBusy] = useState(null);
  const [note, setNote] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/plans")
      .then(({ data }) => data?.length && setPlans(data))
      .catch(() => {});
  }, []);

  const choose = async (plan) => {
    setNote("");
    if (!user) {
      navigate("/register", { state: { plan: plan.slug } });
      return;
    }
    setBusy(plan.slug);
    try {
      const { data } = await api.post("/payments/checkout", {
        plan_slug: plan.slug,
        type: plan.interval === "month" ? "subscription" : "one_time",
      });
      if (data.checkout_url) {
        window.location.href = data.checkout_url;
      } else {
        setNote("Payments aren't switched on yet. Add Stripe keys to enable live checkout.");
      }
    } catch (err) {
      setNote(apiError(err));
    } finally {
      setBusy(null);
    }
  };

  return (
    <section id="pricing" className="px-6 md:px-14 py-24">
      <div className="max-w-6xl mx-auto">
        <p className="eyebrow">Pick Your Plan</p>
        <h2 className="h-display text-5xl md:text-6xl">Invest In Your Best Self</h2>
        <p className="mt-4 max-w-xl text-white/55">
          Straightforward pricing. No contracts. Cancel anytime.
        </p>

        {note && (
          <div className="mt-6 rounded-sm border border-gold/30 bg-gold/10 px-4 py-3 text-sm text-gold">
            {note}
          </div>
        )}

        <div className="mt-12 grid gap-6 md:grid-cols-3 md:items-start">
          {plans.map((p) => (
            <div
              key={p.slug}
              className={`card relative flex flex-col ${
                p.is_featured
                  ? "border-gold md:-mt-4 md:pb-10 bg-gradient-to-b from-gold/[0.08] to-transparent"
                  : ""
              }`}
            >
              {p.is_featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-sm bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink-950">
                  Most Popular
                </span>
              )}
              <h3 className="font-display text-3xl tracking-[2px] text-white">{p.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-5xl text-gold">
                  {formatCurrency(p.price_cents)}
                </span>
                <span className="text-sm text-muted">
                  {p.interval === "month" ? "/mo" : " one-time"}
                </span>
              </div>
              <ul className="mt-6 flex-1 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-white/70">
                    <Check size={17} className="mt-0.5 shrink-0 text-gold" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => choose(p)}
                disabled={busy === p.slug}
                className={p.is_featured ? "btn-primary mt-8 w-full" : "btn-outline mt-8 w-full"}
              >
                {busy === p.slug ? "Starting…" : "Get Started"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}