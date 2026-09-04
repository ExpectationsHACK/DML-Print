import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getOrderByNumber } from "@/lib/actions/orders";
import { confirmDemoPayment } from "@/lib/actions/demo-payment";
import { isPaystackConfigured } from "@/lib/paystack";
import { formatNaira } from "@/lib/format";

export const metadata: Metadata = { title: "Demo payment" };

export default async function DemoPayPage({
  searchParams,
}: PageProps<"/checkout/demo-pay">) {
  const { order: orderNumber } = await searchParams;

  // This page only exists as a stand-in for the real Paystack redirect —
  // once Paystack is actually connected, real payment takes over instead.
  if (isPaystackConfigured() || typeof orderNumber !== "string") {
    redirect("/products");
  }

  const order = await getOrderByNumber(orderNumber);
  if (!order) redirect("/products");

  return (
    <Container className="max-w-md py-16 text-center">
      <span className="inline-block rounded-md bg-lime/40 px-3 py-1 text-xs font-bold uppercase tracking-wide text-ink">
        Demo payment — no money moves
      </span>
      <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight">
        Confirm payment
      </h1>
      <p className="mt-3 text-ink-soft">
        Paystack isn&apos;t connected yet, so this screen stands in for the
        real hosted checkout your customers will eventually see. Connect a
        Paystack secret key to replace it with the real thing.
      </p>

      <div className="mt-8 rounded-[var(--radius-card)] bg-surface-sunken p-6 text-left">
        <span className="font-mono text-sm">{order.orderNumber}</span>
        <ul className="mt-3 space-y-1 text-sm text-ink-soft">
          {order.items.map((item, i) => (
            <li key={i}>
              {item.productName} &times; {item.quantity}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-line pt-4 text-lg font-extrabold">
          <span>Total</span>
          <span>{formatNaira(order.total)}</span>
        </div>
      </div>

      <form action={confirmDemoPayment.bind(null, order.orderNumber)} className="mt-6">
        <Button type="submit" className="w-full justify-center">
          Confirm demo payment
        </Button>
      </form>

      <a
        href={`/checkout/success?order=${order.orderNumber}&payment=pending`}
        className="mt-4 inline-block text-sm font-semibold text-ink-soft hover:text-ink"
      >
        Cancel and pay later
      </a>
    </Container>
  );
}
