import type { Metadata } from "next";
import { PortfolioForm } from "@/components/admin/PortfolioForm";
import { createPortfolioItem } from "@/lib/actions/portfolio";

export const metadata: Metadata = { title: "Add work" };

export default function NewPortfolioPage() {
  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Add work</h1>
      <div className="mt-6">
        <PortfolioForm action={createPortfolioItem} />
      </div>
    </div>
  );
}
