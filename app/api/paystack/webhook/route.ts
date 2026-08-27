import { NextResponse, type NextRequest } from "next/server";
import { verifyWebhookSignature, verifyTransaction } from "@/lib/paystack";
import { ordersCollection, isDbConfigured } from "@/lib/db";
import { sendEmail, orderPaidEmail } from "@/lib/email";

/**
 * Source of truth for payment state. We never mark an order paid from the
 * browser's return to the callback URL — only from a verified webhook, and
 * we re-verify with Paystack directly rather than trusting the payload.
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);
  if (event.event !== "charge.success") {
    return NextResponse.json({ received: true });
  }

  const reference = event.data?.reference as string | undefined;
  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  const verification = await verifyTransaction(reference);
  if (!verification.ok || !verification.success) {
    return NextResponse.json({ error: "Could not verify transaction" }, { status: 400 });
  }

  if (!isDbConfigured()) {
    return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  }

  const orders = await ordersCollection();
  const order = await orders.findOne({ paystackReference: reference });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.status === "pending_payment") {
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

  return NextResponse.json({ received: true });
}
