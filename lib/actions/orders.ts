"use server";

import { auth } from "@/auth";
import { ordersCollection, isDbConfigured, type OrderDoc } from "@/lib/db";
import type { OrderStatus } from "@/lib/types";

export type OrderSummary = {
  orderNumber: string;
  status: OrderStatus;
  total: number;
  deliveryMethod: "delivery" | "pickup";
  createdAt: string;
  items: { productName: string; quantity: number; variantLabel: string | null }[];
};

function toSummary(order: OrderDoc): OrderSummary {
  return {
    orderNumber: order.orderNumber,
    status: order.status as OrderStatus,
    total: order.total,
    deliveryMethod: order.deliveryMethod,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((i) => ({
      productName: i.productName,
      quantity: i.quantity,
      variantLabel: i.variantLabel,
    })),
  };
}

/**
 * Looked up by order number alone (a capability-token-style identifier),
 * used right after checkout where there is no session yet. Returns only
 * confirmation-page fields, not the full order/address.
 */
export async function getOrderByNumber(orderNumber: string): Promise<OrderSummary | null> {
  if (!isDbConfigured()) return null;

  const orders = await ordersCollection();
  const order = await orders.findOne({ orderNumber });

  return order ? toSummary(order) : null;
}

/** Guest-friendly tracking: requires both the order number and the phone on file. */
export async function trackOrder(
  orderNumber: string,
  phone: string
): Promise<OrderSummary | { error: string }> {
  if (!isDbConfigured()) {
    return { error: "Order tracking isn't connected yet." };
  }

  const orders = await ordersCollection();
  const order = await orders.findOne({ orderNumber: orderNumber.trim().toUpperCase() });

  if (!order || order.phone.replace(/\D/g, "") !== phone.replace(/\D/g, "")) {
    return { error: "We couldn't find an order with that number and phone." };
  }

  return toSummary(order);
}

export type AccountOrder = OrderSummary & { id: string };

/** Orders for the signed-in customer's account page, scoped to that user. */
export async function listMyOrders(): Promise<AccountOrder[]> {
  if (!isDbConfigured()) return [];

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return [];

  const orders = await ordersCollection();
  const list = await orders.find({ userId }).sort({ createdAt: -1 }).toArray();

  return list.map((order) => ({ id: order._id, ...toSummary(order) }));
}
