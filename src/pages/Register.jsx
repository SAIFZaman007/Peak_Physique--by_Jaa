import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, CheckCircle2, Clock, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { apiError } from "../lib/api";
import { AuthShell } from "./Login.jsx";

export default function Register() {
  const { register } = useAuth();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    goal: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setBusy(true);
    try {
      await register({
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        goal: form.goal.trim() || null,
      });
      setSubmitted(true);
    } catch (err) {
      setError(apiError(err, "Could not create your account."));
    } finally {
      setBusy(false);
    }
  };

  if (submitted) {
    return (
      <AuthShell
        title="Registration Received"
        subtitle="Thank you for joining Peak Physique."
      >
        <div className="space-y-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400">
            <Clock size={32} />
          </div>

          <div className="space-y-2">
            <h3 className="font-display text-xl text-white">
              Account Pending Approval
            </h3>
            <p className="text-sm text-white/70 leading-relaxed">
              Your account has been created successfully! To maintain high coaching standards, all new client accounts are reviewed and approved by our head coach.
            </p>
          </div>

          <div className="rounded-sm border border-ink-800 bg-ink-900/60 p-4 text-xs text-white/50 text-left space-y-1.5">
            <p className="font-medium text-white/70">What happens next?</p>
            <p>1. Our team reviews your registration details.</p>
            <p>2. Once approved, you will be able to log in to your client portal.</p>
            <p>3. You will receive an email confirmation once your account is active.</p>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Link to="/login" className="btn-primary w-full text-center">
              Go to Sign In
            </Link>
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-1.5 text-xs text-white/50 hover:text-gold"
            >
              <ArrowLeft size={14} /> Back to Homepage
            </Link>
          </div>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Create Your Account"
      subtitle="Join Peak Physique and start tracking real progress."
    >
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="field-label">First name *</label>
            <input
              required
              value={form.first_name}
              onChange={set("first_name")}
              className="field-input"
              placeholder="Jordan"
            />
          </div>
          <div>
            <label className="field-label">Last name</label>
            <input
              value={form.last_name}
              onChange={set("last_name")}
              className="field-input"
              placeholder="Lee"
            />
          </div>
        </div>
        <div>
          <label className="field-label">Email *</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={set("email")}
            className="field-input"
            placeholder="you@email.com"
          />
        </div>
        <div>
          <label className="field-label">Password *</label>
          <input
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={set("password")}
            className="field-input"
            placeholder="At least 6 characters"
          />
        </div>
        <div>
          <label className="field-label">Main goal (optional)</label>
          <input
            value={form.goal}
            onChange={set("goal")}
            className="field-input"
            placeholder="e.g. Build muscle, lose weight"
          />
        </div>

        <p className="text-[11px] text-white/40">
          * New client accounts are activated upon administrator approval.
        </p>

        {error && <p className="text-sm text-danger">{error}</p>}
        <button disabled={busy} className="btn-primary w-full">
          {busy ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={18} className="animate-spin" /> Submitting…
            </span>
          ) : (
            "Create Account"
          )}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-white/50">
        Already have an account?{" "}
        <Link to="/login" className="text-gold hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
