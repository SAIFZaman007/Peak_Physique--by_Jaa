import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { apiError } from "../lib/api";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dest = location.state?.from || "/portal";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      navigate(dest, { replace: true });
    } catch (err) {
      setError(apiError(err, "Invalid email or password."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell title="Welcome Back" subtitle="Sign in to your client portal.">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="field-label">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field-input" placeholder="you@email.com" />
        </div>
        <div>
          <label className="field-label">Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="field-input" placeholder="••••••••" />
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <button disabled={busy} className="btn-primary w-full">
          {busy ? <><Loader2 size={18} className="animate-spin" /> Signing in…</> : "Sign In"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-white/50">
        New here?{" "}
        <Link to="/register" className="text-gold hover:underline">Create an account</Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-between overflow-hidden p-14"
        style={{ background: "linear-gradient(135deg,#1a1000,#0A0A0A)" }}>
        <div className="gold-grid absolute inset-0 opacity-50" />
        <Link to="/" className="relative font-display text-2xl tracking-[3px] text-gold">
          PEAK<span className="text-white">PHYSIQUE</span>
        </Link>
        <div className="relative">
          <h2 className="h-display text-6xl leading-none">
            Your Peak<br /><span className="text-gold">Starts Here</span>
          </h2>
          <p className="mt-4 max-w-sm text-white/50">
            Track progress, manage bookings and stay connected with your coach —
            all in one place.
          </p>
        </div>
        <div className="relative text-xs text-white/30">© Peak Physique</div>
      </div>

      <div className="flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-sm">
          <Link to="/" className="mb-8 inline-block font-display text-2xl tracking-[3px] text-gold lg:hidden">
            PEAK<span className="text-white">PHYSIQUE</span>
          </Link>
          <h1 className="h-display text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-white/50">{subtitle}</p>
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}