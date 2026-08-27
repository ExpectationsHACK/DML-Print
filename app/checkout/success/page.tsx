import Link from "next/link";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { StatusPill } from "@/components/ui/StatusPill";
import { CheckIcon } from "@/components/ui/Icons";
import { getOrderByNumber } from "@/lib/actions/orders";
import { formatNaira } from "@/lib/format";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Order confirmed" };

export default async function CheckoutSuccessPage({
  searchParams,
}: PageProps<"/checkout/success">) {
  const { order: orderNumber, payment } = await searchParams;
  const order = typeof orderNumber === "string" ? await getOrderByNumber(orderNumber) : null;

  return (
    <Container className="py-16 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-lime text-ink">
        <CheckIcon className="h-8 w-8" />
      </span>
      <h1 className="mt-5 font-display text-4xl font-extrabold tracking-tight">
        {order ? "Order received" : "Thanks"}
      </h1>

      {order ? (
        <div className="mx-auto mt-8 max-w-md rounded-[var(--radius-card)] bg-surface-sunken p-6 text-left">
          <div className="flex items-center justify-between">
            <span className="font-mono text-sm">{order.orderNumber}</span>
            <StatusPill status={order.status} />
          </div>
          <ul className="mt-4 space-y-1 text-sm text-ink-soft">
            {order.items.map((item, i) => (
              <li key={i}>
                {item.productName} &times; {item.quantity}
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-between border-t border-line pt-4 font-bold">
            <span>Total</span>
            <span>{formatNaira(order.total)}</span>
          </div>
        </div>
      ) : (
        <p className="mx-auto mt-4 max-w-md text-ink-soft">
          We couldn&apos;t find that order — check your email for the confirmation, or
          contact us with your order number.
        </p>
      )}

      {payment === "pending" && (
        <p className="mx-auto mt-6 max-w-md text-sm text-danger">
          Payment isn&apos;t connected yet, so this order is on hold. Message us on
          WhatsApp with your order number and we&apos;ll confirm payment manually.
        </p>
      )}

      <div className="mt-8 flex flex-wrap justify-center gap-4">
        {order && (
          <a
            href={buildWhatsAppLink(`Hello DML Print, following up on order ${order.orderNumber}.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-control)] border-2 border-line px-6 py-3.5 text-[15px] font-bold text-ink transition-colors hover:border-ink"
          >
            Message us on WhatsApp
          </a>
        )}
        <Link
          href="/products"
          className="inline-flex items-center text-[15px] font-bold text-ink-soft hover:text-ink"
        >
          Continue shopping
        </Link>
      </div>
    </Container>
  );
}
