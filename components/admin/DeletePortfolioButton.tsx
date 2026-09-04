"use client";

import { useTransition } from "react";
import { deletePortfolioItem } from "@/lib/actions/portfolio";

export function DeletePortfolioButton({ portfolioId, title }: { portfolioId: string; title: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(`Delete "${title}"? This can't be undone.`)) {
          startTransition(() => deletePortfolioItem(portfolioId));
        }
      }}
      className="text-xs font-bold uppercase tracking-wide text-ink-soft hover:text-danger disabled:opacity-50"
    >
      {pending ? "Deleting..." : "Delete"}
    </button>
  );
}
