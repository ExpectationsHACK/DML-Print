import { portfolioCollection, isDbConfigured, type PortfolioDoc } from "@/lib/db";
import type { PortfolioItem } from "@/lib/types";

function toPortfolioItem(doc: PortfolioDoc): PortfolioItem {
  return {
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
}

export async function getPublishedPortfolio(): Promise<PortfolioItem[]> {
  if (!isDbConfigured()) return [];
  const portfolio = await portfolioCollection();
  const docs = await portfolio.find({ published: true }).sort({ createdAt: -1 }).toArray();
  return docs.map(toPortfolioItem);
}

export async function getAllPortfolioForAdmin(): Promise<PortfolioItem[]> {
  if (!isDbConfigured()) return [];
  const portfolio = await portfolioCollection();
  const docs = await portfolio.find({}).sort({ createdAt: -1 }).toArray();
  return docs.map(toPortfolioItem);
}
