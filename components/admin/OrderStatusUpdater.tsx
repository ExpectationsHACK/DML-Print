"use client";

import { useTransition } from "react";
import { Select } from "@/components/ui/Field";
import { updateOrderStatus } from "@/lib/actions/admin";
import { ORDER_STATUS_LABEL, type OrderStatus } from "@/lib/types";

export function OrderStatusUpdater({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Select
      defaultValue={status}
      disabled={pending}
      onChange={(e) =>
        startTransition(() => updateOrderStatus(orderId, e.target.value as OrderStatus))
      }
      className="w-56"
    >
      {Object.entries(ORDER_STATUS_LABEL).map(([value, label]) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </Select>
  );
}
