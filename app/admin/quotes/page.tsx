import type { Metadata } from "next";
import { quoteRequestsCollection, isDbConfigured } from "@/lib/db";
import { QuoteStatusUpdater } from "@/components/admin/QuoteStatusUpdater";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Quote requests" };

export default async function AdminQuotesPage() {
  const quotes = isDbConfigured()
    ? await (await quoteRequestsCollection()).find({}).sort({ createdAt: -1 }).toArray()
    : [];

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Quote requests</h1>

      <div className="mt-6 space-y-4">
        {quotes.map((quote) => (
          <div key={quote._id} className="border border-line bg-surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold">
                  {quote.name} {quote.company && `— ${quote.company}`}
                </p>
                <p className="text-sm text-ink-soft">
                  {quote.email} &middot; {quote.phone}
                </p>
                <p className="mt-1 text-xs uppercase tracking-wide text-ink-soft">
                  {quote.productCategory} &middot; {formatDate(quote.createdAt)}
                </p>
              </div>
              <QuoteStatusUpdater quoteId={quote._id} status={quote.status} />
            </div>
            <p className="mt-3 text-sm text-ink-soft">{quote.description}</p>
            {(quote.quantity || quote.deadline) && (
              <p className="mt-2 text-xs text-ink-soft">
                {quote.quantity && `Quantity: ${quote.quantity}`}
                {quote.quantity && quote.deadline && " · "}
                {quote.deadline && `Deadline: ${formatDate(quote.deadline)}`}
              </p>
            )}
          </div>
        ))}

        {quotes.length === 0 && (
          <p className="py-10 text-center text-ink-soft">No quote requests yet.</p>
        )}
      </div>
    </div>
  );
}
