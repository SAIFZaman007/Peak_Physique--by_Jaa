import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Mail, MapPin } from "lucide-react";
import { api, apiError } from "../lib/api";
import { useAuth } from "../context/AuthContext.jsx";

const SERVICES = [
  "Free Intro Call",
  "Online Consultation",
  "Nutrition Counseling",
  "1-on-1 Coaching",
  "In-Person Training",
  "Virtual Training",
];

const INFO_FALLBACK = {
  eyebrow: "Ready To Build Your Peak?",
  heading_line1: "Book Your Free",
  heading_line2: "Intro Call",
  body:
    "No pressure, no commitment. We'll talk through your goals, answer your questions, and figure out if we're the right fit. Fifteen minutes could change your whole approach.",
  email: "join@trainpeakphysique.com",
  location: "On Campus · Virtual Available Nationwide",
  image_url: "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=800&q=80&auto=format&fit=crop&crop=center",
  quote: "The first step is always the most important. Book your call — everything else follows.",
  quote_author: "Peak Physique",
};

export default function Booking() {
  const { user } = useAuth();
  const [info, setInfo] = useState(INFO_FALLBACK);
  const [form, setForm] = useState({
    name: user ? `${user.first_name} ${user.last_name}`.trim() : "",
    email: user?.email || "",
    phone: "",
    goal: "",
    service: "Free Intro Call",
  });
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/content/booking")
      .then(({ data }) => data?.data && setInfo({ ...INFO_FALLBACK, ...data.data }))
      .catch(() => {});
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email) {
      setError("Please fill in your name and email.");
      return;
    }
    setStatus("loading");
    try {
      await api.post("/bookings", {
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        goal: form.goal || null,
        service: form.service,
      });
      setStatus("done");
    } catch (err) {
      setError(apiError(err));
      setStatus("error");
    }
  };

  return (
    <section id="booking" className="px-6 md:px-14 py-24">
      <div className="max-w-5xl mx-auto grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="eyebrow">{info.eyebrow}</p>
          <h2 className="h-display text-5xl md:text-6xl">
            {info.heading_line1}
            <br />
            {info.heading_line2}
          </h2>
          <p className="mt-5 text-white/60 leading-relaxed">{info.body}</p>
          <ul className="mt-8 space-y-3 text-white/75">
            {["100% free, zero obligation", "Personalized game plan", "Real answers from a real coach"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-gold" /> {t}
              </li>
            ))}
          </ul>

          <div className="mt-8 space-y-3">
            {info.email && (
              <a href={`mailto:${info.email}`} className="flex items-center gap-3 text-sm text-white/70 hover:text-gold">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-ink-700 text-gold">
                  <Mail size={16} />
                </span>
                {info.email}
              </a>
            )}
            {info.location && (
              <div className="flex items-center gap-3 text-sm text-white/70">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-ink-700 text-gold">
                  <MapPin size={16} />
                </span>
                {info.location}
              </div>
            )}
          </div>

          {info.image_url && (
            <div className="relative mt-7 h-56 overflow-hidden rounded-sm border border-ink-700">
              <img src={info.image_url} alt="" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/10 to-transparent" />
              {info.quote && (
                <div className="absolute inset-x-4 bottom-4">
                  <p className="text-[13px] italic leading-snug text-white/85">"{info.quote}"</p>
                  {info.quote_author && (
                    <p className="mt-1.5 text-[11px] font-bold tracking-wider text-gold">— {info.quote_author}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="card border-ink-700">
          {status === "done" ? (
            <div className="flex flex-col items-center py-10 text-center">
              <CheckCircle2 size={56} className="text-gold" />
              <h3 className="mt-5 font-display text-3xl tracking-[1px]">Request Received!</h3>
              <p className="mt-3 text-sm text-white/60">
                Thanks, {form.name.split(" ")[0]}. We've sent a note to{" "}
                <span className="text-white">{form.email}</span> and your coach will
                lock in a time on the calendar and confirm the details shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="field-label">Full name</label>
                  <input value={form.name} onChange={set("name")} className="field-input" placeholder="Jordan Lee" />
                </div>
                <div>
                  <label className="field-label">Email</label>
                  <input type="email" value={form.email} onChange={set("email")} className="field-input" placeholder="you@email.com" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="field-label">Phone (optional)</label>
                  <input value={form.phone} onChange={set("phone")} className="field-input" placeholder="(555) 000-0000" />
                </div>
                <div>
                  <label className="field-label">Service</label>
                  <select value={form.service} onChange={set("service")} className="field-input">
                    {SERVICES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="field-label">Your main goal (optional)</label>
                <input value={form.goal} onChange={set("goal")} className="field-input" placeholder="e.g. Lose 15 lbs, build muscle…" />
              </div>
              <p className="rounded-sm border border-ink-700 bg-ink-950/60 px-4 py-3 text-xs leading-relaxed text-white/50">
                No need to pick a time here — once we get your request, we'll schedule your call
                on our calendar and send you a confirmation with the exact date and time.
              </p>

              {error && <p className="text-sm text-danger">{error}</p>}

              <button type="submit" disabled={status === "loading"} className="btn-primary w-full">
                {status === "loading" ? (
                  <><Loader2 size={18} className="animate-spin" /> Booking…</>
                ) : (
                  "Book My Free Call"
                )}
              </button>
              <p className="text-center text-xs text-white/35">
                By booking you agree to be contacted about your session.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}