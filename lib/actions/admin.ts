"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { ordersCollection, quoteRequestsCollection, usersCollection, isDbConfigured } from "@/lib/db";
import { sendEmail, orderStatusChangedEmail } from "@/lib/email";
import type { OrderStatus } from "@/lib/types";

/**
 * There's no RLS here — every function in this file must check the caller
 * is an admin itself before writing anything.
 */
async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== "admin") return null;
  return session.user;
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  if (!isDbConfigured()) return;
  if (!(await requireAdmin())) return;

  const orders = await ordersCollection();
  const order = await orders.findOneAndUpdate(
    { _id: orderId },
    { $set: { status, updatedAt: new Date() } }
  );
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");

  if (order) {
    await sendEmail({
      to: order.email,
      ...orderStatusChangedEmail(
        { orderNumber: order.orderNumber, total: order.total, deliveryMethod: order.deliveryMethod, items: order.items },
        status
      ),
    });
  }
}

export async function updateQuoteStatus(
  quoteId: string,
  status: "new" | "quoted" | "closed"
): Promise<void> {
  if (!isDbConfigured()) return;
  if (!(await requireAdmin())) return;

  const quotes = await quoteRequestsCollection();
  await quotes.updateOne({ _id: quoteId }, { $set: { status } });
  revalidatePath("/admin/quotes");
}

export type SetRoleResult = { ok: boolean; error?: string };

export async function setUserRole(userId: string, role: "customer" | "admin"): Promise<SetRoleResult> {
  if (!isDbConfigured()) return { ok: false, error: "Not connected." };

  const admin = await requireAdmin();
  if (!admin) return { ok: false, error: "Admins only." };

  // Guard against an admin accidentally locking themselves out.
  if (admin.id === userId && role !== "admin") {
    return { ok: false, error: "You can't remove your own admin access." };
  }

  const users = await usersCollection();
  const result = await users.updateOne({ _id: userId }, { $set: { role } });
  if (result.matchedCount === 0) return { ok: false, error: "Customer not found." };

  revalidatePath(`/admin/customers/${userId}`);
  revalidatePath("/admin/customers");
  return { ok: true };
}
