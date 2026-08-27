"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/lib/types";

const STORAGE_KEY = "dmlprint.cart.v1";

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "lineId">) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
  itemCount: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Cart lives in localStorage, which doesn't exist during SSR — this can
  // only be read once mounted on the client, so an effect (not a lazy
  // useState initializer) is the correct tool here despite the lint rule.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client-only hydration from localStorage, not a render loop
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore corrupt local storage
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem: (item) =>
        setItems((prev) => [...prev, { ...item, lineId: crypto.randomUUID() }]),
      removeItem: (lineId) =>
        setItems((prev) => prev.filter((i) => i.lineId !== lineId)),
      updateQuantity: (lineId, quantity) =>
        setItems((prev) =>
          prev.map((i) => (i.lineId === lineId ? { ...i, quantity } : i))
        ),
      clear: () => setItems([]),
      itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
