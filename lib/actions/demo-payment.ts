"use server";

import { redirect } from "next/navigation";
import { ordersCollection, isDbConfigured } from "@/lib/db";
import { isPaystackConfigured } from "@/lib/paystack";
import { sendEmail, orderPaidEmail } from "@/lib/email";

/**
 * Stands in for the real Paystack redirect while no live keys are
 * configured, so the full order → pay → paid flow can be demoed end to end.
 * Refuses to do anything once Paystack is actually connected — real payment
 * verification takes over at that point, this path should never fire again.
 */
export async function confirmDemoPayment(orderNumber: string): Promise<void> {
  if (isPaystackConfigured() || !isDbConfigured()) {
    redirect(`/checkout/success?order=${orderNumber}`);
  }

  const orders = await ordersCollection();
  const order = await orders.findOne({ orderNumber });

  if (order && order.status === "pending_payment") {
    await orders.updateOne(
      { _id: order._id },
      { $set: { status: "paid", paidAt: new Date(), updatedAt: new Date() } }
    );
    await sendEmail({
      to: order.email,
      ...orderPaidEmail({
        orderNumber: order.orderNumber,
        total: order.total,
        deliveryMethod: order.deliveryMethod,
        items: order.items,
      }),
    });
  }

  redirect(`/checkout/success?order=${orderNumber}`);
}
