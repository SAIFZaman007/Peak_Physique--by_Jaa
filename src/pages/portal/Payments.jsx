import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, CreditCard, Loader2, XCircle } from "lucide-react";
import { api } from "../../lib/api";
import { formatCurrency, formatDate, STATUS_STYLES } from "../../lib/utils";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [config, setConfig] = useState({ stripe_enabled: false });
  const [loading, setLoading] = useState(true);
  const [params, setParams] = useSearchParams();
  const [verifyState, setVerifyState] = useState(null); // null | "checking" | "succeeded" | "error"

  const loadPayments = () => api.get("/payments/me").then(({ data }) => setPayments(data));

  useEffect(() => {
    Promise.all([loadPayments(), api.get("/payments/config").then(({ data }) => setConfig(data))]).finally(() =>
      setLoading(false)
    );
  }, []);

  // The redirect back from Stripe lands here as
  // /portal/payments?status=success&session_id=cs_test_... — confirm it
  // with the backend right away instead of waiting on a webhook, so the
  // status below reads "Succeeded" the moment the page loads rather than
  // sitting on "Pending" until something else happens to refresh it.
  useEffect(() => {
    const status = params.get("status");
    const sessionId = params.get("session_id");
    if (status !== "success" || !sessionId) return;

    setVerifyState("checking");
    api
      .get(`/payments/verify/${sessionId}`)
      .then(async ({ data }) => {
        setVerifyState(data.status === "succeeded" ? "succeeded" : "error");
        await loadPayments();
      })
      .catch(() => setVerifyState("error"))
      .finally(() => {
        // Drop the query params so a page refresh doesn't re-trigger this.
        setParams({}, { replace: true });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total = payments
    .filter((p) => p.status === "succeeded")
    .reduce((s, p) => s + p.amount_cents, 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-3xl tracking-[1px]">Payments</h2>
        <p className="text-sm text-white/40">Your billing history and receipts.</p>
      </div>

      {verifyState === "checking" && (
        <div className="flex items-center gap-3 rounded-sm border border-gold/25 bg-gold/[0.05] p-4 text-sm text-white/70">
          <Loader2 size={18} className="animate-spin text-gold" /> Confirming your payment with Stripe…
        </div>
      )}
      {verifyState === "succeeded" && (
        <div className="flex items-center gap-3 rounded-sm border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400">
          <CheckCircle2 size={18} /> Payment confirmed — thank you!
        </div>
      )}
      {verifyState === "error" && (
        <div className="flex items-center gap-3 rounded-sm border border-danger/30 bg-danger/10 p-4 text-sm text-danger">
          <XCircle size={18} /> We couldn't confirm that payment automatically. If your card was charged, it'll
          sync shortly — otherwise contact us and we'll sort it out.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card">
          <span className="text-xs uppercase tracking-wider text-white/40">Total Paid</span>
          <div className="mt-2 font-display text-3xl text-gold">{formatCurrency(total)}</div>
        </div>
        <div className="card">
          <span className="text-xs uppercase tracking-wider text-white/40">Transactions</span>
          <div className="mt-2 font-display text-3xl text-white">{payments.length}</div>
        </div>
        <div className="card">
          <span className="text-xs uppercase tracking-wider text-white/40">Checkout</span>
          <div className="mt-2 flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${config.stripe_enabled ? "bg-emerald-400" : "bg-white/30"}`} />
            <span className="text-sm text-white/70">{config.stripe_enabled ? "Stripe live" : "Not configured"}</span>
          </div>
        </div>
      </div>

      {!config.stripe_enabled && (
        <div className="rounded-sm border border-gold/25 bg-gold/[0.05] p-4 text-sm text-white/60">
          Live card payments turn on automatically once Stripe keys are added to the backend.
        </div>
      )}

      <div className="card !p-0 overflow-hidden">
        {loading ? (
          <div className="p-6 text-sm text-white/40">Loading…</div>
        ) : payments.length === 0 ? (
          <div className="flex flex-col items-center py-14 text-center">
            <CreditCard size={40} className="text-gold" />
            <p className="mt-4 text-white/60">No payments yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-white/40">
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Description</th>
                  <th className="px-6 py-3 font-medium">Amount</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-t border-ink-800">
                    <td className="px-6 py-3">{formatDate(p.created_at)}</td>
                    <td className="px-6 py-3">{p.description || "—"}</td>
                    <td className="px-6 py-3 font-medium">{formatCurrency(p.amount_cents)}</td>
                    <td className="px-6 py-3">
                      <span className={`rounded-sm border px-2 py-0.5 text-xs capitalize ${STATUS_STYLES[p.status] || ""}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}