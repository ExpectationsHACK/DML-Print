import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ordersCollection, isDbConfigured } from "@/lib/db";
import { OrderStatusUpdater } from "@/components/admin/OrderStatusUpdater";
import { formatDate, formatNaira } from "@/lib/format";

export const metadata: Metadata = { title: "Order detail" };

export default async function AdminOrderDetailPage({
  params,
}: PageProps<"/admin/orders/[id]">) {
  const { id } = await params;

  if (!isDbConfigured()) notFound();

  const order = await (await ordersCollection()).findOne({ _id: id });
  if (!order) notFound();

  const address = order.address as Record<string, string> | null;

  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-mono text-2xl">{order.orderNumber}</h1>
          <p className="text-sm text-ink-soft">{formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusUpdater orderId={order._id} status={order.status} />
      </div>

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Customer
          </h2>
          <p className="mt-2 text-sm">{order.email}</p>
          <p className="text-sm text-ink-soft">{order.phone}</p>
        </div>

        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            {order.deliveryMethod === "pickup" ? "Pickup" : "Delivery address"}
          </h2>
          {address ? (
            <p className="mt-2 text-sm text-ink-soft">
              {address.fullName} &middot; {address.phone}
              <br />
              {address.street}, {address.city}, {address.lga}, {address.state}
              {address.landmark ? ` (near ${address.landmark})` : ""}
            </p>
          ) : (
            <p className="mt-2 text-sm text-ink-soft">Pickup — no delivery address.</p>
          )}
        </div>
      </div>

      <h2 className="mt-8 text-xs font-semibold uppercase tracking-wide text-ink-soft">
        Items
      </h2>
      <div className="mt-3 divide-y divide-line border-y border-line">
        {order.items.map((item, i) => (
          <div key={`${item.productSlug}-${i}`} className="flex items-center justify-between gap-4 py-3 text-sm">
            <div>
              <p className="font-medium">{item.productName}</p>
              {item.variantLabel && <p className="text-ink-soft">{item.variantLabel}</p>}
              {item.notes && <p className="text-xs italic text-ink-soft">&ldquo;{item.notes}&rdquo;</p>}
              {item.artworkPath && (
                <p className="text-xs text-ink-soft">Artwork stored: {item.artworkPath}</p>
              )}
            </div>
            <div className="text-right">
              <p>&times; {item.quantity}</p>
              <p className="font-mono">{formatNaira(item.unitPrice * item.quantity)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 ml-auto max-w-xs space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-ink-soft">Subtotal</span>
          <span className="font-mono">{formatNaira(order.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-ink-soft">Delivery</span>
          <span className="font-mono">{formatNaira(order.deliveryFee)}</span>
        </div>
        <div className="flex justify-between border-t border-line pt-1 font-mono text-base">
          <span>Total</span>
          <span>{formatNaira(order.total)}</span>
        </div>
      </div>

      {order.notes && (
        <p className="mt-6 border border-line bg-surface-sunken p-4 text-sm italic text-ink-soft">
          &ldquo;{order.notes}&rdquo;
        </p>
      )}
    </div>
  );
}
