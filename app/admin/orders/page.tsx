import Link from "next/link";
import type { Metadata } from "next";
import type { Filter } from "mongodb";
import { ordersCollection, isDbConfigured, type OrderDoc } from "@/lib/db";
import { StatusPill } from "@/components/ui/StatusPill";
import { Input } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { formatDate, formatNaira } from "@/lib/format";
import { cn } from "@/lib/cn";
import { ORDER_STATUS_LABEL, type OrderStatus } from "@/lib/types";

export const metadata: Metadata = { title: "Orders" };

function statusHref(status: string | undefined, q: string, from: string, to: string): string {
  const params = new URLSearchParams();
  if (status) params.set("status", status);
  if (q) params.set("q", q);
  if (from) params.set("from", from);
  if (to) params.set("to", to);
  const qs = params.toString();
  return `/admin/orders${qs ? `?${qs}` : ""}`;
}

export default async function AdminOrdersPage({
  searchParams,
}: PageProps<"/admin/orders">) {
  const params = await searchParams;
  const activeStatus = typeof params.status === "string" ? (params.status as OrderStatus) : undefined;
  const q = typeof params.q === "string" ? params.q.trim() : "";
  const from = typeof params.from === "string" ? params.from : "";
  const to = typeof params.to === "string" ? params.to : "";

  const filter: Filter<OrderDoc> = {};
  if (activeStatus) filter.status = activeStatus;
  if (q) {
    const pattern = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { orderNumber: { $regex: pattern, $options: "i" } },
      { email: { $regex: pattern, $options: "i" } },
    ];
  }
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(`${from}T00:00:00`);
    if (to) filter.createdAt.$lte = new Date(`${to}T23:59:59`);
  }

  const orders = isDbConfigured()
    ? await (await ordersCollection()).find(filter).sort({ createdAt: -1 }).toArray()
    : [];

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Orders</h1>

      <form className="mt-6 flex flex-wrap items-end gap-3" action="/admin/orders">
        {activeStatus && <input type="hidden" name="status" value={activeStatus} />}
        <div className="min-w-48 flex-1">
          <label htmlFor="q" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Search
          </label>
          <Input id="q" name="q" defaultValue={q} placeholder="Order number or email" />
        </div>
        <div>
          <label htmlFor="from" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
            From
          </label>
          <Input id="from" name="from" type="date" defaultValue={from} />
        </div>
        <div>
          <label htmlFor="to" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
            To
          </label>
          <Input id="to" name="to" type="date" defaultValue={to} />
        </div>
        <Button type="submit" className="!px-5 !py-2.5 text-sm">
          Filter
        </Button>
        {(q || from || to) && (
          <Link
            href={statusHref(activeStatus, "", "", "")}
            className="text-sm font-semibold text-ink-soft hover:text-ink"
          >
            Clear
          </Link>
        )}
      </form>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-line pb-4">
        <Link
          href={statusHref(undefined, q, from, to)}
          className={cn(
            "px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
            !activeStatus ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
          )}
        >
          All
        </Link>
        {Object.entries(ORDER_STATUS_LABEL).map(([value, label]) => (
          <Link
            key={value}
            href={statusHref(value, q, from, to)}
            className={cn(
              "px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
              activeStatus === value ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
            )}
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-soft">
              <th className="py-3 pr-4">Order</th>
              <th className="py-3 pr-4">Customer</th>
              <th className="py-3 pr-4">Date</th>
              <th className="py-3 pr-4">Total</th>
              <th className="py-3 pr-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="py-3 pr-4">
                  <Link href={`/admin/orders/${order._id}`} className="font-mono hover:underline">
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="py-3 pr-4 text-ink-soft">{order.email}</td>
                <td className="py-3 pr-4 text-ink-soft">{formatDate(order.createdAt)}</td>
                <td className="py-3 pr-4 font-mono">{formatNaira(order.total)}</td>
                <td className="py-3 pr-4">
                  <StatusPill status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="py-10 text-center text-ink-soft">No orders match these filters.</p>
        )}
      </div>
    </div>
  );
}
