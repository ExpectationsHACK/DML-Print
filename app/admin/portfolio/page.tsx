import Link from "next/link";
import type { Metadata } from "next";
import { getAllPortfolioForAdmin } from "@/lib/data/portfolio";
import { PORTFOLIO_CATEGORY_LABEL } from "@/lib/types";
import { LinkButton } from "@/components/ui/Button";
import { DeletePortfolioButton } from "@/components/admin/DeletePortfolioButton";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Portfolio" };

export default async function AdminPortfolioPage() {
  const items = await getAllPortfolioForAdmin();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-extrabold tracking-tight">Portfolio</h1>
        <LinkButton href="/admin/portfolio/new" className="!px-5 !py-2.5 text-sm">
          Add work
        </LinkButton>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-soft">
              <th className="py-3 pr-4">Title</th>
              <th className="py-3 pr-4">Category</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4">Added</th>
              <th className="py-3 pr-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="py-3 pr-4">
                  <Link href={`/admin/portfolio/${item.id}`} className="font-semibold hover:underline">
                    {item.title}
                  </Link>
                </td>
                <td className="py-3 pr-4 text-ink-soft">{PORTFOLIO_CATEGORY_LABEL[item.category]}</td>
                <td className="py-3 pr-4">
                  {item.published ? (
                    <span className="rounded-md bg-lime/40 px-2 py-0.5 text-xs font-bold text-ink">
                      Published
                    </span>
                  ) : (
                    <span className="text-ink-soft">Draft</span>
                  )}
                </td>
                <td className="py-3 pr-4 text-ink-soft">{formatDate(item.createdAt)}</td>
                <td className="py-3 pr-4 text-right">
                  <div className="flex justify-end gap-4">
                    <Link href={`/admin/portfolio/${item.id}`} className="text-xs font-bold uppercase tracking-wide text-ink-soft hover:text-ink">
                      Edit
                    </Link>
                    <DeletePortfolioButton portfolioId={item.id} title={item.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <p className="py-10 text-center text-ink-soft">No portfolio items yet — add the first one.</p>
        )}
      </div>
    </div>
  );
}
