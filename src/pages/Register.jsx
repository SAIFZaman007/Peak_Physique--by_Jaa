import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { apiError } from "../lib/api";
import { AuthShell } from "./Login.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    goal: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

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
        first_name: form.first_name,
        last_name: form.last_name,
        email: form.email,
        password: form.password,
        goal: form.goal || null,
      });
      navigate("/portal", { replace: true, state: { plan: location.state?.plan } });
    } catch (err) {
      setError(apiError(err, "Could not create your account."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Create Your Account" subtitle="Join Peak Physique and start tracking real progress.">
      <form onSubmit={submit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="field-label">First name</label>
            <input value={form.first_name} onChange={set("first_name")} className="field-input" placeholder="Jordan" />
          </div>
          <div>
            <label className="field-label">Last name</label>
            <input value={form.last_name} onChange={set("last_name")} className="field-input" placeholder="Lee" />
          </div>
        </div>
        <div>
          <label className="field-label">Email</label>
          <input type="email" value={form.email} onChange={set("email")} className="field-input" placeholder="you@email.com" />
        </div>
        <div>
          <label className="field-label">Password</label>
          <input type="password" value={form.password} onChange={set("password")} className="field-input" placeholder="At least 6 characters" />
        </div>
        <div>
          <label className="field-label">Main goal (optional)</label>
          <input value={form.goal} onChange={set("goal")} className="field-input" placeholder="e.g. Build muscle" />
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <button disabled={busy} className="btn-primary w-full">
          {busy ? <><Loader2 size={18} className="animate-spin" /> Creating…</> : "Create Account"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-white/50">
        Already have an account?{" "}
        <Link to="/login" className="text-gold hover:underline">Sign in</Link>
      </p>
    </AuthShell>
  );
}
