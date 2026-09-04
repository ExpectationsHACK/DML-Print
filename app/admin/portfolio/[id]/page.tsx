import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { portfolioCollection, isDbConfigured } from "@/lib/db";
import { PortfolioForm } from "@/components/admin/PortfolioForm";
import { updatePortfolioItem } from "@/lib/actions/portfolio";
import type { PortfolioItem } from "@/lib/types";

export const metadata: Metadata = { title: "Edit work" };

export default async function EditPortfolioPage({
  params,
}: PageProps<"/admin/portfolio/[id]">) {
  const { id } = await params;

  if (!isDbConfigured()) notFound();

  const doc = await (await portfolioCollection()).findOne({ _id: id });
  if (!doc) notFound();

  const item: PortfolioItem = {
    id: doc._id,
    slug: doc.slug,
    title: doc.title,
    category: doc.category,
    clientName: doc.clientName,
    productionDetails: doc.productionDetails,
    description: doc.description,
    image: doc.image,
    imageAlt: doc.imageAlt,
    published: doc.published,
    createdAt: doc.createdAt.toISOString(),
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Edit work</h1>
      <div className="mt-6">
        <PortfolioForm action={updatePortfolioItem.bind(null, item.id)} item={item} />
      </div>
    </div>
  );
}
