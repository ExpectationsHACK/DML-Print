import Link from "next/link";
import type { Metadata } from "next";
import { usersCollection, isDbConfigured } from "@/lib/db";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Customers" };

export default async function AdminCustomersPage() {
  const customers = isDbConfigured()
    ? await (await usersCollection()).find({}).sort({ createdAt: -1 }).toArray()
    : [];

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Customers</h1>
      <p className="mt-2 text-sm text-ink-soft">
        Every account, customer and admin. Click a name to view their orders and
        addresses, or change their role.
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-soft">
              <th className="py-3 pr-4">Name</th>
              <th className="py-3 pr-4">Email</th>
              <th className="py-3 pr-4">Phone</th>
              <th className="py-3 pr-4">Role</th>
              <th className="py-3 pr-4">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {customers.map((customer) => (
              <tr key={customer._id}>
                <td className="py-3 pr-4">
                  <Link href={`/admin/customers/${customer._id}`} className="font-semibold hover:underline">
                    {customer.fullName ?? "—"}
                  </Link>
                </td>
                <td className="py-3 pr-4 text-ink-soft">{customer.email}</td>
                <td className="py-3 pr-4 text-ink-soft">{customer.phone ?? "—"}</td>
                <td className="py-3 pr-4">
                  {customer.role === "admin" ? (
                    <span className="rounded-md bg-lime/40 px-2 py-0.5 text-xs font-bold text-ink">
                      Admin
                    </span>
                  ) : (
                    <span className="text-ink-soft">Customer</span>
                  )}
                </td>
                <td className="py-3 pr-4 text-ink-soft">{formatDate(customer.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && (
          <p className="py-10 text-center text-ink-soft">No customer accounts yet.</p>
        )}
      </div>
    </div>
  );
}
