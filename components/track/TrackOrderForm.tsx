"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { StatusPill } from "@/components/ui/StatusPill";
import { ORDER_STATUS_SEQUENCE } from "@/lib/types";
import { formatDate, formatNaira } from "@/lib/format";
import { trackOrder, type OrderSummary } from "@/lib/actions/orders";
import { cn } from "@/lib/cn";

export function TrackOrderForm() {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<OrderSummary | { error: string } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const orderNumber = String(form.get("orderNumber") || "");
    const phone = String(form.get("phone") || "");

    startTransition(async () => {
      setResult(await trackOrder(orderNumber, phone));
    });
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-[2fr_2fr_auto] sm:items-end">
        <Field label="Order number" htmlFor="orderNumber" required>
          <Input id="orderNumber" name="orderNumber" placeholder="DML-XXXXX-XXXX" required />
        </Field>
        <Field label="Phone on the order" htmlFor="phone" required>
          <Input id="phone" name="phone" type="tel" required />
        </Field>
        <Button type="submit" disabled={pending}>
          {pending ? "Checking..." : "Track"}
        </Button>
      </form>

      {result && "error" in result && (
        <p className="mt-6 text-sm text-danger">{result.error}</p>
      )}

      {result && !("error" in result) && (
        <div className="mt-8 border border-line bg-surface-sunken p-6">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm">{result.orderNumber}</span>
            <StatusPill status={result.status} />
          </div>
          <p className="mt-1 text-xs text-ink-soft">
            Placed {formatDate(result.createdAt)} &middot; {formatNaira(result.total)}
          </p>

          <ol className="mt-6 space-y-3">
            {ORDER_STATUS_SEQUENCE.map((step, i) => {
              const currentIndex = ORDER_STATUS_SEQUENCE.indexOf(result.status);
              const reached = currentIndex >= i;
              return (
                <li key={step} className="flex items-center gap-3">
                  <span
                    className={cn(
                      "h-2.5 w-2.5 rounded-full",
                      reached ? "bg-lime-strong" : "bg-line"
                    )}
                  />
                  <span className={cn("text-sm", reached ? "text-ink" : "text-ink-soft")}>
                    {step.replace(/_/g, " ")}
                  </span>
                </li>
              );
            })}
          </ol>

          <ul className="mt-6 space-y-1 border-t border-line pt-4 text-sm text-ink-soft">
            {result.items.map((item, i) => (
              <li key={i}>
                {item.productName} &times; {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
