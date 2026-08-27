import { cn } from "@/lib/cn";
import { ORDER_STATUS_LABEL, type OrderStatus } from "@/lib/types";

const tone: Record<OrderStatus, string> = {
  pending_payment: "bg-surface-sunken text-ink-soft",
  paid: "bg-sky/30 text-ink",
  in_production: "bg-butter/50 text-ink",
  quality_check: "bg-butter/50 text-ink",
  ready_for_dispatch: "bg-sky/30 text-ink",
  dispatched: "bg-sky/30 text-ink",
  delivered: "bg-lime/40 text-ink",
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
