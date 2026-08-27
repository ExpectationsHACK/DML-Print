"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { ordersCollection, isDbConfigured, newId } from "@/lib/db";
import { initializeTransaction, isPaystackConfigured } from "@/lib/paystack";
import { computeCartTotals } from "@/lib/pricing";
import { NIGERIAN_STATES } from "@/lib/data/states";
import { sendEmail, orderReceivedEmail, newOrderAdminEmail } from "@/lib/email";
import type { CartItem } from "@/lib/types";

const addressSchema = z.object({
  fullName: z.string().min(2, "Enter your full name."),
  phone: z.string().min(7, "Enter a valid phone number."),
  email: z.string().email("Enter a valid email."),
  state: z.enum(NIGERIAN_STATES as unknown as [string, ...string[]]),
  lga: z.string().min(2, "Enter your LGA."),
  city: z.string().min(2, "Enter your city."),
  street: z.string().min(4, "Enter your street address."),
  landmark: z.string().optional(),
  deliveryMethod: z.enum(["delivery", "pickup"]),
  notes: z.string().optional(),
});

const cartItemSchema = z.object({
  lineId: z.string(),
  productSlug: z.string(),
  productName: z.string(),
  categorySlug: z.string(),
  selectedVariants: z.record(z.string(), z.string()),
  variantLabel: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().nonnegative(),
  artworkFileName: z.string().optional(),
  artworkPath: z.string().optional(),
  notes: z.string().optional(),
});

export type CheckoutInput = z.infer<typeof addressSchema> & { items: CartItem[] };

export type CheckoutResult =
  | { ok: true; redirectUrl: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

function generateOrderNumber(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = crypto.randomUUID().slice(0, 4).toUpperCase();
  return `DML-${stamp}-${random}`;
}

export async function submitOrder(input: CheckoutInput): Promise<CheckoutResult> {
  const parsedAddress = addressSchema.safeParse(input);
  if (!parsedAddress.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsedAddress.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { ok: false, error: "Please check the highlighted fields.", fieldErrors };
  }

  const parsedItems = z.array(cartItemSchema).min(1, "Your cart is empty.").safeParse(input.items);
  if (!parsedItems.success) {
    return { ok: false, error: "Your cart looks empty — add a product first." };
  }

  const address = parsedAddress.data;
  const items = parsedItems.data;
  const totals = computeCartTotals(items, address.deliveryMethod);

  if (!isDbConfigured()) {
    return {
      ok: false,
      error:
        "Checkout isn't fully connected yet — the database needs to be configured before orders can be placed. In the meantime, use the WhatsApp order link on the product page.",
    };
  }

  const orderNumber = generateOrderNumber();
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const now = new Date();

  const order = {
    _id: newId(),
    orderNumber,
    userId,
    email: address.email,
    phone: address.phone,
    status: "pending_payment" as const,
    subtotal: totals.subtotal,
    deliveryFee: totals.delivery,
    total: totals.total,
    deliveryMethod: address.deliveryMethod,
    address: {
      fullName: address.fullName,
      phone: address.phone,
      state: address.state,
      lga: address.lga,
      city: address.city,
      street: address.street,
      landmark: address.landmark ?? null,
    },
    paystackReference: orderNumber,
    paidAt: null,
    notes: address.notes ?? null,
    items: items.map((item) => ({
      productSlug: item.productSlug,
      productName: item.productName,
      category: item.categorySlug,
      variantLabel: item.variantLabel || null,
      selectedVariants: item.selectedVariants,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      artworkPath: item.artworkPath ?? null,
      notes: item.notes ?? null,
    })),
    createdAt: now,
    updatedAt: now,
  };

  try {
    const orders = await ordersCollection();
    await orders.insertOne(order);
  } catch {
    return { ok: false, error: "Could not create your order. Please try again." };
  }

  const emailOrder = {
    orderNumber: order.orderNumber,
    total: order.total,
    deliveryMethod: order.deliveryMethod,
    items: order.items,
  };
  await sendEmail({ to: order.email, ...orderReceivedEmail(emailOrder) });
  if (process.env.ADMIN_NOTIFICATION_EMAIL) {
    await sendEmail({
      to: process.env.ADMIN_NOTIFICATION_EMAIL,
      ...newOrderAdminEmail({ ...emailOrder, email: order.email }),
    });
  }

  if (!isPaystackConfigured()) {
    return {
      ok: true,
      redirectUrl: `/checkout/demo-pay?order=${order.orderNumber}`,
    };
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const payment = await initializeTransaction({
    email: address.email,
    amountNaira: totals.total,
    reference: order.orderNumber,
    callbackUrl: `${origin}/checkout/success?order=${order.orderNumber}`,
    metadata: { order_number: order.orderNumber },
  });

  if (!payment.ok) {
    return {
      ok: true,
      redirectUrl: `/checkout/success?order=${order.orderNumber}&payment=pending`,
    };
  }

  return { ok: true, redirectUrl: payment.authorizationUrl };
}
