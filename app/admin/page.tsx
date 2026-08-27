import Link from "next/link";
import type { Metadata } from "next";
import { ordersCollection, isDbConfigured } from "@/lib/db";
import { formatNaira } from "@/lib/format";

export const metadata: Metadata = { title: "Admin dashboard" };

export default async function AdminDashboardPage() {
  const list = isDbConfigured() ? await (await ordersCollection()).find({}).toArray() : [];

  const pending = list.filter((o) => o.status === "pending_payment").length;
  const inProduction = list.filter((o) =>
    ["paid", "in_production", "quality_check"].includes(o.status)
  ).length;
  const readyOrDispatched = list.filter((o) =>
    ["ready_for_dispatch", "dispatched"].includes(o.status)
  ).length;
  const revenue = list
    .filter((o) => o.status !== "pending_payment" && o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: "Awaiting payment", value: pending },
    { label: "In production", value: inProduction },
    { label: "Ready / dispatched", value: readyOrDispatched },
    { label: "Total revenue", value: formatNaira(revenue) },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="border border-line bg-surface p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
              {stat.label}
            </p>
            <p className="mt-2 font-mono text-2xl">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex gap-4">
        <Link href="/admin/orders" className="text-sm font-semibold text-ink hover:underline">
          View all orders &rarr;
        </Link>
        <Link href="/admin/quotes" className="text-sm font-semibold text-ink hover:underline">
          View quote requests &rarr;
        </Link>
      </div>
    </div>
  );
}
