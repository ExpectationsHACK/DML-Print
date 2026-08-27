"use client";

import { useState } from "react";
import { LinkButton } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { useCart } from "@/lib/cart-context";
import { formatNaira } from "@/lib/format";
import { computeCartTotals, DELIVERY_FEE, FREE_DELIVERY_THRESHOLD } from "@/lib/pricing";

export function CartView() {
  const { items, removeItem, updateQuantity } = useCart();
  const [deliveryMethod] = useState<"delivery" | "pickup">("delivery");

  if (items.length === 0) {
    return (
      <div className="rounded-[var(--radius-card)] bg-surface-sunken p-10 text-center">
        <p className="text-ink-soft">Your cart is empty.</p>
        <LinkButton href="/products" className="mt-4">
          Browse products
        </LinkButton>
      </div>
    );
  }

  const totals = computeCartTotals(items, deliveryMethod);

  return (
    <div className="grid gap-10 lg:grid-cols-3">
      <div className="space-y-4 lg:col-span-2">
        {items.map((item) => (
          <div
            key={item.lineId}
            className="flex flex-col gap-3 rounded-[var(--radius-card)] bg-surface-sunken p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-display text-lg font-bold tracking-tight">{item.productName}</p>
              {item.variantLabel && (
                <p className="text-sm text-ink-soft">{item.variantLabel}</p>
              )}
              {item.artworkFileName && (
                <p className="text-xs text-ink-soft">Artwork: {item.artworkFileName}</p>
              )}
              {item.notes && (
                <p className="text-xs italic text-ink-soft">&ldquo;{item.notes}&rdquo;</p>
              )}
            </div>

            <div className="flex items-center gap-4">
              <Input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item.lineId, Math.max(1, Number(e.target.value) || 1))
                }
                className="w-20"
              />
              <p className="w-28 text-right font-bold">
                {formatNaira(item.unitPrice * item.quantity)}
              </p>
              <button
                onClick={() => removeItem(item.lineId)}
                className="text-xs font-bold uppercase tracking-wide text-ink-soft hover:text-danger"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="h-fit rounded-[var(--radius-card)] bg-surface-sunken p-6">
        <h2 className="font-display text-xl font-extrabold tracking-tight">Order summary</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-soft">Subtotal</dt>
            <dd className="font-semibold">{formatNaira(totals.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-soft">Delivery</dt>
            <dd className="font-semibold">
              {totals.delivery === 0 ? "Free" : formatNaira(totals.delivery)}
            </dd>
          </div>
          {totals.subtotal < FREE_DELIVERY_THRESHOLD && (
            <p className="text-xs font-semibold text-ink">
              Add {formatNaira(FREE_DELIVERY_THRESHOLD - totals.subtotal)} more for free
              delivery.
            </p>
          )}
        </dl>
        <div className="mt-4 flex justify-between border-t border-line pt-4 text-lg font-extrabold">
          <span>Total</span>
          <span>{formatNaira(totals.total)}</span>
        </div>
        <LinkButton href="/checkout" className="mt-6 w-full justify-center">
          Checkout
        </LinkButton>
        <p className="mt-3 text-center text-xs text-ink-soft">
          Delivery fee shown is a flat estimate ({formatNaira(DELIVERY_FEE)}) — final
          fee is confirmed at checkout.
        </p>
      </div>
    </div>
  );
}
