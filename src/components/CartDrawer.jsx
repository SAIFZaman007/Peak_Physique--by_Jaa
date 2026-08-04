import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { api, apiError } from "../lib/api";
import { formatCurrency } from "../lib/utils";

export default function CartDrawer() {
  const { items, open, setOpen, totalCents, removeItem, setQuantity, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");

  if (!open) return null;

  const checkout = async () => {
    setNote("");
    if (!user) {
      setOpen(false);
      navigate("/register", { state: { redirectTo: "checkout" } });
      return;
    }
    setBusy(true);
    try {
      const { data } = await api.post("/payments/checkout", {
        items: items.map((i) => ({ type: i.type, id: i.id, quantity: i.quantity })),
      });
      if (data.checkout_url) {
        clear();
        window.location.href = data.checkout_url;
      } else {
        setNote("Payments aren't switched on yet. Add Stripe keys to enable live checkout.");
      }
    } catch (err) {
      setNote(apiError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9998] flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />

      {/* Panel */}
      <div className="relative flex h-full w-full max-w-md flex-col border-l border-ink-700 bg-ink-950 shadow-2xl animate-fadeUp">
        <div className="flex items-center justify-between border-b border-ink-800 px-6 py-5">
          <h3 className="flex items-center gap-2 font-display text-2xl tracking-[1px]">
            <ShoppingBag size={20} className="text-gold" /> Your Cart
          </h3>
          <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white" aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-white/40">
              <ShoppingBag size={40} className="mb-3 text-white/20" />
              <p>Your cart is empty.</p>
              <p className="mt-1 text-sm">Add a service to get started.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={`${item.type}-${item.id}`} className="flex gap-3 border-b border-ink-800 pb-4">
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-sm border border-ink-700 bg-ink-800">
                    {item.image_url && (
                      <img src={item.image_url} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">{item.name}</p>
                    <p className="mt-0.5 text-xs text-white/40">{formatCurrency(item.price_cents)} each</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => setQuantity(item.type, item.id, item.quantity - 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-sm border border-ink-700 text-white/60 hover:border-gold/50 hover:text-gold"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-5 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => setQuantity(item.type, item.id, item.quantity + 1)}
                        className="flex h-6 w-6 items-center justify-center rounded-sm border border-ink-700 text-white/60 hover:border-gold/50 hover:text-gold"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        onClick={() => removeItem(item.type, item.id)}
                        className="ml-auto text-white/30 hover:text-danger"
                        aria-label="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                  <div className="shrink-0 self-start text-sm font-semibold text-gold">
                    {formatCurrency(item.price_cents * item.quantity)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-ink-800 px-6 py-5">
            {note && (
              <div className="mb-4 rounded-sm border border-gold/30 bg-gold/10 px-4 py-2.5 text-sm text-gold">
                {note}
              </div>
            )}
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-white/60">Subtotal</span>
              <span className="font-display text-2xl text-gold">{formatCurrency(totalCents)}</span>
            </div>
            <button onClick={checkout} disabled={busy} className="btn-primary w-full">
              {busy ? "Starting checkout…" : "Checkout"}
            </button>
            <p className="mt-3 text-center text-xs text-white/35">
              Secure checkout powered by Stripe.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}