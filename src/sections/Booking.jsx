import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
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
const TIMES = ["7:00 AM", "9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM", "7:00 PM"];

function toISO(dateStr, timeLabel) {
  // Combine yyyy-mm-dd + "1:00 PM" into an ISO datetime string.
  const [time, mer] = timeLabel.split(" ");
  let [h, m] = time.split(":").map(Number);
  if (mer === "PM" && h !== 12) h += 12;
  if (mer === "AM" && h === 12) h = 0;
  const d = new Date(`${dateStr}T00:00:00`);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
}

const todayStr = new Date().toISOString().split("T")[0];

export default function Booking() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: user ? `${user.first_name} ${user.last_name}`.trim() : "",
    email: user?.email || "",
    phone: "",
    goal: "",
    service: "Free Intro Call",
    date: "",
    time: "",
  });
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.date || !form.time) {
      setError("Please fill in your name, email, and pick a date & time.");
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
        start_time: toISO(form.date, form.time),
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
          <p className="eyebrow">Ready To Build Your Peak?</p>
          <h2 className="h-display text-5xl md:text-6xl">Book Your Free Intro Call</h2>
          <p className="mt-5 text-white/60 leading-relaxed">
            No pressure, no commitment. We'll talk through your goals, answer your
            questions, and figure out if we're the right fit. Fifteen minutes could
            change your whole approach.
          </p>
          <ul className="mt-8 space-y-3 text-white/75">
            {["100% free, zero obligation", "Personalized game plan", "Real answers from a real coach"].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <CheckCircle2 size={20} className="text-gold" /> {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="card border-ink-700">
          {status === "done" ? (
            <div className="flex flex-col items-center py-10 text-center">
              <CheckCircle2 size={56} className="text-gold" />
              <h3 className="mt-5 font-display text-3xl tracking-[1px]">You're Booked!</h3>
              <p className="mt-3 text-sm text-white/60">
                Thanks, {form.name.split(" ")[0]}. We've sent a confirmation to{" "}
                <span className="text-white">{form.email}</span> and your coach will
                reach out to confirm the details shortly.
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="field-label">Preferred date</label>
                  <input type="date" min={todayStr} value={form.date} onChange={set("date")} className="field-input" />
                </div>
                <div>
                  <label className="field-label">Preferred time</label>
                  <select value={form.time} onChange={set("time")} className="field-input">
                    <option value="">Select…</option>
                    {TIMES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              {error && <p className="text-sm text-danger">{error}</p>}

              <button type="submit" disabled={status === "loading"} className="btn-primary w-full">
                {status === "loading" ? (
                  <><Loader2 size={18} className="animate-spin" /> Booking…</>
                ) : (
                  "Claim My Free Call"
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
