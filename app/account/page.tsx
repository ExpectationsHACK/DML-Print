import Link from "next/link";
import type { Metadata } from "next";
import { StatusPill } from "@/components/ui/StatusPill";
import { listMyOrders } from "@/lib/actions/orders";
import { formatDate, formatNaira } from "@/lib/format";

export const metadata: Metadata = { title: "Your orders" };

export default async function AccountOrdersPage() {
  const orders = await listMyOrders();

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Your orders</h1>

      {orders.length === 0 ? (
        <p className="mt-6 text-ink-soft">
          No orders yet.{" "}
          <Link href="/products" className="font-semibold text-ink hover:underline">
            Start shopping
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-line border-t border-line">
          {orders.map((order) => (
            <li key={order.id} className="flex items-center justify-between py-4">
              <div>
                <p className="font-mono text-sm">{order.orderNumber}</p>
                <p className="text-xs text-ink-soft">{formatDate(order.createdAt)}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm">{formatNaira(order.total)}</span>
                <StatusPill status={order.status} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
