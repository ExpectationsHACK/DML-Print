"use client";

import { useTransition } from "react";
import { Select } from "@/components/ui/Field";
import { updateQuoteStatus } from "@/lib/actions/admin";

type QuoteStatus = "new" | "quoted" | "closed";

export function QuoteStatusUpdater({
  quoteId,
  status,
}: {
  quoteId: string;
  status: QuoteStatus;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Select
      defaultValue={status}
      disabled={pending}
      onChange={(e) =>
        startTransition(() => updateQuoteStatus(quoteId, e.target.value as QuoteStatus))
      }
      className="w-36"
    >
      <option value="new">New</option>
      <option value="quoted">Quoted</option>
      <option value="closed">Closed</option>
    </Select>
  );
}
