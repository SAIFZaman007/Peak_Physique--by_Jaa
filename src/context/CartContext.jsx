import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "pp_cart";

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Cart is intentionally client-side only (React state + localStorage), not
 * a server-side cart table — standard for a small storefront like this.
 * The cart just describes *intent* ("2x Nutrition Counseling"); the real
 * prices are always re-looked-up server-side at checkout
 * (POST /payments/checkout), so nothing here needs to be trusted.
 *
 * Items shape: { type: "service", id, name, price_cents, image_url, quantity }
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState(loadInitial);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((item, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.type === item.type && i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.type === item.type && i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { ...item, quantity }];
    });
  }, []);

  const removeItem = useCallback((type, id) => {
    setItems((prev) => prev.filter((i) => !(i.type === type && i.id === id)));
  }, []);

  const setQuantity = useCallback((type, id, quantity) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => !(i.type === type && i.id === id))
        : prev.map((i) => (i.type === type && i.id === id ? { ...i, quantity } : i))
    );
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const count = useMemo(() => items.reduce((n, i) => n + i.quantity, 0), [items]);
  const totalCents = useMemo(
    () => items.reduce((n, i) => n + i.price_cents * i.quantity, 0),
    [items]
  );

  const value = {
    items, count, totalCents,
    open, setOpen,
    addItem, removeItem, setQuantity, clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}