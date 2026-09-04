import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { QuoteForm } from "@/components/quote/QuoteForm";
import { getAllCategories } from "@/lib/data/categories";

export const metadata: Metadata = {
  title: "Request a quote",
  description: "Bulk and corporate print orders, quoted to your brief.",
};

export default async function QuotePage() {
  const categories = await getAllCategories();

  return (
    <Container className="max-w-2xl py-12">
      <h1 className="font-display text-4xl font-extrabold tracking-tight">Request a quote</h1>
      <p className="mt-3 text-ink-soft">
        For bulk runs, corporate branding or anything that doesn&apos;t fit a
        standard product, tell us the brief and we&apos;ll send pricing and a
        timeline.
      </p>
      <div className="mt-8">
        <Suspense fallback={null}>
          <QuoteForm categories={categories} />
        </Suspense>
      </div>
    </Container>
  );
}
