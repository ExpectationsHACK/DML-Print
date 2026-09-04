"use client";

import { useState } from "react";
import { PORTFOLIO_CATEGORY_LABEL, type PortfolioCategory, type PortfolioItem } from "@/lib/types";

const filters: { value: PortfolioCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  ...(Object.entries(PORTFOLIO_CATEGORY_LABEL) as [PortfolioCategory, string][]).map(([value, label]) => ({
    value,
    label,
  })),
];

export function PortfolioFilter({ items }: { items: PortfolioItem[] }) {
  const [active, setActive] = useState<PortfolioCategory | "all">("all");
  const visible = active === "all" ? items : items.filter((item) => item.category === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setActive(filter.value)}
            className={
              active === filter.value
                ? "rounded-full bg-forest px-4 py-1.5 text-sm font-bold text-cream"
                : "rounded-full border border-line px-4 py-1.5 text-sm font-semibold text-ink-soft hover:border-ink hover:text-ink"
            }
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => (
          <div key={item.id}>
            <div
              className="relative aspect-[4/3] w-full overflow-hidden bg-surface-sunken"
              style={{ borderRadius: "var(--radius-card)" }}
            >
              <span className="absolute left-3 top-3 z-10 rounded-md bg-forest px-2.5 py-1 text-xs font-bold text-cream">
                {PORTFOLIO_CATEGORY_LABEL[item.category]}
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element -- portfolio images are arbitrary admin-pasted URLs, not allowlisted domains */}
              <img
                src={item.image}
                alt={item.imageAlt}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <p className="mt-3 font-display text-base font-bold leading-snug tracking-tight">
              {item.title}
              {item.clientName ? <span className="font-medium text-ink-soft"> &middot; {item.clientName}</span> : null}
            </p>
            <p className="text-sm text-ink-soft">{item.description}</p>
            {item.productionDetails && (
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">
                {item.productionDetails}
              </p>
            )}
          </div>
        ))}
      </div>

      {visible.length === 0 && (
        <p className="mt-12 text-center text-ink-soft">Nothing in this category yet.</p>
      )}
    </div>
  );
}
