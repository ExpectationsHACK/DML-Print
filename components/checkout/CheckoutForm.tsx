"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { useCart } from "@/lib/cart-context";
import { computeCartTotals } from "@/lib/pricing";
import { formatNaira } from "@/lib/format";
import { NIGERIAN_STATES } from "@/lib/data/states";
import { submitOrder } from "@/lib/actions/checkout";

export function CheckoutForm({ paystackConfigured }: { paystackConfigured: boolean }) {
  const router = useRouter();
  const { items, clear } = useCart();
  const [pending, startTransition] = useTransition();
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">("delivery");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const totals = computeCartTotals(items, deliveryMethod);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    const form = new FormData(e.currentTarget);
    const payload = {
      fullName: String(form.get("fullName") || ""),
      phone: String(form.get("phone") || ""),
      email: String(form.get("email") || ""),
      state: String(form.get("state") || ""),
      lga: String(form.get("lga") || ""),
      city: String(form.get("city") || ""),
      street: String(form.get("street") || ""),
      landmark: String(form.get("landmark") || "") || undefined,
      deliveryMethod,
      notes: String(form.get("notes") || "") || undefined,
      items,
    };

    startTransition(async () => {
      const result = await submitOrder(payload);
      if (!result.ok) {
        setError(result.error);
        setFieldErrors(result.fieldErrors ?? {});
        return;
      }
      clear();
      if (result.redirectUrl.startsWith("http")) {
        window.location.href = result.redirectUrl;
      } else {
        router.push(result.redirectUrl);
      }
    });
  }

  if (items.length === 0) {
    return (
      <div className="border border-line bg-surface-sunken p-10 text-center text-ink-soft">
        Your cart is empty — add a product before checking out.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div className="flex gap-3">
          {(["delivery", "pickup"] as const).map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => setDeliveryMethod(method)}
              className={`flex-1 rounded-[var(--radius-control)] border-2 px-4 py-3 text-sm font-bold ${
                deliveryMethod === method
                  ? "border-ink bg-ink text-cream"
                  : "border-line text-ink-soft hover:border-ink"
              }`}
            >
              {method === "delivery" ? "Deliver to me" : "Pick up in Lagos"}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" htmlFor="fullName" required>
            <Input id="fullName" name="fullName" required />
            {fieldErrors.fullName && <p className="mt-1 text-xs text-danger">{fieldErrors.fullName}</p>}
          </Field>
          <Field label="Phone" htmlFor="phone" required>
            <Input id="phone" name="phone" type="tel" required />
            {fieldErrors.phone && <p className="mt-1 text-xs text-danger">{fieldErrors.phone}</p>}
          </Field>
        </div>

        <Field label="Email" htmlFor="email" required hint="Your receipt and order updates go here.">
          <Input id="email" name="email" type="email" required />
          {fieldErrors.email && <p className="mt-1 text-xs text-danger">{fieldErrors.email}</p>}
        </Field>

        {deliveryMethod === "delivery" && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="State" htmlFor="state" required>
                <Select id="state" name="state" required defaultValue="">
                  <option value="" disabled>
                    Select state
                  </option>
                  {NIGERIAN_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </Select>
                {fieldErrors.state && <p className="mt-1 text-xs text-danger">{fieldErrors.state}</p>}
              </Field>
              <Field label="LGA" htmlFor="lga" required>
                <Input id="lga" name="lga" required />
                {fieldErrors.lga && <p className="mt-1 text-xs text-danger">{fieldErrors.lga}</p>}
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="City / area" htmlFor="city" required>
                <Input id="city" name="city" required />
                {fieldErrors.city && <p className="mt-1 text-xs text-danger">{fieldErrors.city}</p>}
              </Field>
              <Field label="Landmark" htmlFor="landmark" hint="Optional but helps our rider.">
                <Input id="landmark" name="landmark" />
              </Field>
            </div>

            <Field label="Street address" htmlFor="street" required>
              <Input id="street" name="street" required />
              {fieldErrors.street && <p className="mt-1 text-xs text-danger">{fieldErrors.street}</p>}
            </Field>
          </>
        )}

        <Field label="Order notes (optional)" htmlFor="notes">
          <Textarea id="notes" name="notes" placeholder="Delivery instructions, deadline, anything else..." />
        </Field>
      </div>

      <div className="h-fit space-y-4 rounded-[var(--radius-card)] bg-surface-sunken p-6">
        <h2 className="font-display text-xl font-extrabold tracking-tight">Order summary</h2>
        <ul className="space-y-2 text-sm">
          {items.map((item) => (
            <li key={item.lineId} className="flex justify-between gap-4">
              <span className="text-ink-soft">
                {item.productName} &times; {item.quantity}
              </span>
              <span className="font-semibold">{formatNaira(item.unitPrice * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-ink-soft">Subtotal</span>
            <span className="font-semibold">{formatNaira(totals.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-soft">Delivery</span>
            <span className="font-semibold">
              {totals.delivery === 0 ? "Free" : formatNaira(totals.delivery)}
            </span>
          </div>
        </div>
        <div className="flex justify-between border-t border-line pt-4 text-lg font-extrabold">
          <span>Total</span>
          <span>{formatNaira(totals.total)}</span>
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button type="submit" disabled={pending} className="w-full justify-center">
          {pending
            ? "Processing..."
            : paystackConfigured
              ? "Pay with Paystack"
              : "Continue to demo payment"}
        </Button>
        {!paystackConfigured && (
          <p className="text-center text-xs text-ink-soft">
            Paystack isn&apos;t connected yet — this places a real order, then
            shows a demo payment screen instead of the real checkout.
          </p>
        )}
      </div>
    </form>
  );
}
