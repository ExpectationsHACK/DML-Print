export const DML_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "2348000000000";

export function buildWhatsAppLink(message: string, number = DML_WHATSAPP_NUMBER): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function orderWhatsAppMessage(params: {
  orderNumber?: string;
  productName: string;
  variantLabel?: string;
  quantity: number;
}): string {
  const lines = [
    `Hello DML Prints, I'd like to order:`,
    ``,
    `Product: ${params.productName}`,
  ];
  if (params.variantLabel) lines.push(params.variantLabel);
  lines.push(`Quantity: ${params.quantity}`);
  if (params.orderNumber) lines.push(``, `Order ID: ${params.orderNumber}`);
  return lines.join("\n");
}
