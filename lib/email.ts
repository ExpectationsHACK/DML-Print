import { Resend } from "resend";
import { formatNaira } from "@/lib/format";
import { ORDER_STATUS_LABEL, type OrderStatus } from "@/lib/types";

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

/** Escapes user-supplied text before it's interpolated into an HTML email. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

let client: Resend | undefined;
function getClient(): Resend {
  if (!client) client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

/**
 * Fire-and-forget: email delivery never blocks or breaks the caller's main
 * flow (an order still gets created even if Resend is down or unconfigured).
 */
export async function sendEmail(params: { to: string; subject: string; html: string }): Promise<void> {
  if (!isEmailConfigured()) return;

  try {
    await getClient().emails.send({
      from: process.env.EMAIL_FROM || "DML Prints <onboarding@resend.dev>",
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
  } catch (error) {
    console.error("sendEmail failed:", error);
  }
}

function shell(title: string, bodyHtml: string): string {
  return `
    <div style="font-family: -apple-system, Helvetica, Arial, sans-serif; background: #F7F5EF; padding: 32px 16px;">
      <div style="max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden;">
        <div style="background: #0B2F24; padding: 20px 28px;">
          <div style="display: inline-block; vertical-align: middle; width: 28px; height: 28px; background: #0B2F24; border: 1px solid rgba(247,245,239,0.2); border-radius: 8px; padding: 5px 6px; box-sizing: border-box;">
            <div style="width: 100%; height: 4px; background: #E4392E; border-radius: 1px;"></div>
            <div style="width: 100%; height: 4px; background: #F2C230; border-radius: 1px; margin-top: 2px;"></div>
            <div style="width: 100%; height: 4px; background: #1E9DD8; border-radius: 1px; margin-top: 2px;"></div>
          </div>
          <span style="color: #F7F5EF; font-weight: 800; font-size: 16px; margin-left: 8px; vertical-align: middle;">DML Prints</span>
        </div>
        <div style="padding: 28px;">
          <h1 style="font-size: 20px; font-weight: 800; margin: 0 0 12px; color: #161B18;">${title}</h1>
          ${bodyHtml}
        </div>
      </div>
    </div>
  `;
}

type EmailOrder = {
  orderNumber: string;
  total: number;
  deliveryMethod: string;
  items: { productName: string; quantity: number }[];
};

function itemsList(items: EmailOrder["items"]): string {
  return items
    .map(
      (i) =>
        `<tr><td style="padding: 6px 0; color: #4B564F;">${escapeHtml(i.productName)} &times; ${i.quantity}</td></tr>`
    )
    .join("");
}

export function orderReceivedEmail(order: EmailOrder): { subject: string; html: string } {
  return {
    subject: `Order received — ${order.orderNumber}`,
    html: shell(
      "We've got your order",
      `
      <p style="color: #4B564F; line-height: 1.6;">Thanks for your order. Here's what you ordered:</p>
      <table style="width: 100%; border-collapse: collapse;">${itemsList(order.items)}</table>
      <p style="margin-top: 16px; font-weight: 700; color: #161B18;">Total: ${formatNaira(order.total)}</p>
      <p style="color: #4B564F; line-height: 1.6;">Order number: <strong>${order.orderNumber}</strong></p>
      <p style="color: #4B564F; line-height: 1.6;">We'll email you again once payment is confirmed and when your order's status changes.</p>
      `
    ),
  };
}

export function orderPaidEmail(order: EmailOrder): { subject: string; html: string } {
  return {
    subject: `Payment confirmed — ${order.orderNumber}`,
    html: shell(
      "Payment confirmed",
      `
      <p style="color: #4B564F; line-height: 1.6;">We've received your payment for order <strong>${order.orderNumber}</strong> — it's now headed into production.</p>
      <p style="margin-top: 16px; font-weight: 700; color: #161B18;">Total: ${formatNaira(order.total)}</p>
      `
    ),
  };
}

export function orderStatusChangedEmail(
  order: EmailOrder,
  status: OrderStatus
): { subject: string; html: string } {
  const label = ORDER_STATUS_LABEL[status];
  return {
    subject: `Order update — ${order.orderNumber} is now "${label}"`,
    html: shell(
      "Your order status changed",
      `
      <p style="color: #4B564F; line-height: 1.6;">Order <strong>${order.orderNumber}</strong> is now:</p>
      <p style="font-size: 18px; font-weight: 800; color: #161B18;">${label}</p>
      `
    ),
  };
}

export function newOrderAdminEmail(order: EmailOrder & { email: string }): { subject: string; html: string } {
  return {
    subject: `New order — ${order.orderNumber}`,
    html: shell(
      "New order placed",
      `
      <p style="color: #4B564F; line-height: 1.6;">From: ${escapeHtml(order.email)}</p>
      <table style="width: 100%; border-collapse: collapse;">${itemsList(order.items)}</table>
      <p style="margin-top: 16px; font-weight: 700; color: #161B18;">Total: ${formatNaira(order.total)}</p>
      `
    ),
  };
}

export function newQuoteAdminEmail(quote: {
  name: string;
  email: string;
  phone: string;
  productCategory: string;
  description: string;
  materialFinish?: string;
  filePath?: string;
}): { subject: string; html: string } {
  const safeFileLink =
    quote.filePath && /^https:\/\//.test(quote.filePath)
      ? `<p style="color: #4B564F; line-height: 1.6;">Design/brief: <a href="${escapeHtml(quote.filePath)}" style="color: #164D3A;">View file</a></p>`
      : "";

  return {
    subject: `New quote request — ${escapeHtml(quote.productCategory)}`,
    html: shell(
      "New bulk quote request",
      `
      <p style="color: #4B564F; line-height: 1.6;">${escapeHtml(quote.name)} &middot; ${escapeHtml(quote.email)} &middot; ${escapeHtml(quote.phone)}</p>
      <p style="font-weight: 700; color: #161B18;">${escapeHtml(quote.productCategory)}</p>
      ${quote.materialFinish ? `<p style="color: #4B564F; line-height: 1.6;">Material/finish: ${escapeHtml(quote.materialFinish)}</p>` : ""}
      <p style="color: #4B564F; line-height: 1.6;">${escapeHtml(quote.description)}</p>
      ${safeFileLink}
      `
    ),
  };
}
