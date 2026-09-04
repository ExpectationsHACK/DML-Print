import { cn } from "@/lib/cn";
import { ORDER_STATUS_LABEL, type OrderStatus } from "@/lib/types";

const tone: Record<OrderStatus, string> = {
  pending_payment: "bg-surface-sunken text-ink-soft",
  paid: "bg-lime/30 text-ink",
  in_production: "bg-lime/50 text-ink",
  quality_check: "bg-forest/15 text-forest",
  ready_for_dispatch: "bg-forest/25 text-forest",
  dispatched: "bg-forest/40 text-forest",
  delivered: "bg-forest text-cream",
  cancelled: "bg-danger/10 text-danger line-through",
};

export function StatusPill({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-bold",
        tone[status]
      )}
    >
      {ORDER_STATUS_LABEL[status]}
    </span>
  );
}
