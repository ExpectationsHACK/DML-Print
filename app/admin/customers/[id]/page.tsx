import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { usersCollection, addressesCollection, ordersCollection, isDbConfigured } from "@/lib/db";
import { StatusPill } from "@/components/ui/StatusPill";
import { RoleToggle } from "@/components/admin/RoleToggle";
import { formatDate, formatNaira } from "@/lib/format";

export const metadata: Metadata = { title: "Customer detail" };

export default async function AdminCustomerDetailPage({
  params,
}: PageProps<"/admin/customers/[id]">) {
  const { id } = await params;

  if (!isDbConfigured()) notFound();

  const session = await auth();
  const [customer, addresses, orders] = await Promise.all([
    (await usersCollection()).findOne({ _id: id }),
    (await addressesCollection()).find({ userId: id }).sort({ createdAt: -1 }).toArray(),
    (await ordersCollection()).find({ userId: id }).sort({ createdAt: -1 }).toArray(),
  ]);

  if (!customer) notFound();

  return (
    <div className="max-w-2xl">
      <Link href="/admin/customers" className="text-sm font-semibold text-ink-soft hover:text-ink">
        &larr; All customers
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight">
            {customer.fullName ?? customer.email}
          </h1>
          <p className="mt-1 text-sm text-ink-soft">{customer.email}</p>
          {customer.phone && <p className="text-sm text-ink-soft">{customer.phone}</p>}
          <p className="mt-1 text-xs uppercase tracking-wide text-ink-soft">
            Joined {formatDate(customer.createdAt)}
          </p>
        </div>
        <RoleToggle userId={customer._id} role={customer.role} isSelf={session?.user?.id === customer._id} />
      </div>

      <h2 className="mt-8 text-xs font-semibold uppercase tracking-wide text-ink-soft">
        Addresses
      </h2>
      {addresses.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {addresses.map((address) => (
            <li key={address._id} className="border border-line bg-surface p-3 text-sm">
              <p className="font-semibold">{address.fullName}</p>
              <p className="text-ink-soft">{address.phone}</p>
              <p className="text-ink-soft">
                {address.street}, {address.city}, {address.lga}, {address.state}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-ink-soft">No saved addresses.</p>
      )}

      <h2 className="mt-8 text-xs font-semibold uppercase tracking-wide text-ink-soft">
        Orders
      </h2>
      {orders.length > 0 ? (
        <ul className="mt-3 divide-y divide-line border-t border-line">
          {orders.map((order) => (
            <li key={order._id} className="flex items-center justify-between py-3">
              <div>
                <Link
                  href={`/admin/orders/${order._id}`}
                  className="font-mono text-sm hover:underline"
                >
                  {order.orderNumber}
                </Link>
                <p className="text-xs text-ink-soft">{formatDate(order.createdAt)}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm">{formatNaira(order.total)}</span>
                <StatusPill status={order.status} />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-ink-soft">No orders yet.</p>
      )}
    </div>
  );
}
