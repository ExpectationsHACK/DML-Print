import type { Category, Product } from "@/lib/types";

export const CATEGORIES: Category[] = [
  {
    slug: "business-cards-stationery",
    name: "Business Cards & Stationery",
    tagline: "First impressions, printed sharp",
    description:
      "Business cards, receipt books, ID cards and journals for everyday business.",
  },
  {
    slug: "flyers-posters",
    name: "Flyers & Posters",
    tagline: "Get the word out",
    description: "Flyers and posters for launches, events and promotions.",
  },
  {
    slug: "banners-signage",
    name: "Banners & Signage",
    tagline: "Big format, built to last",
    description: "Banners, roll-up stands and shopfront signage.",
  },
  {
    slug: "apparel",
    name: "Apparel",
    tagline: "Wear the brand",
    description: "T-shirts and hoodies, printed or embroidered.",
  },
  {
    slug: "mugs-gifts",
    name: "Mugs & Gifts",
    tagline: "Made for giving",
    description: "Mugs, cushions and award plaques for gifts and recognition.",
  },
  {
    slug: "stickers-labels",
    name: "Stickers & Labels",
    tagline: "Small format, big detail",
    description: "Cut-to-shape stickers and labels for products and packs.",
  },
  {
    slug: "logo-branding",
    name: "Logo & Branding",
    tagline: "Start from the mark",
    description: "Logo design and brand identity, quoted to the brief.",
  },
];

function pluralize(word: string, count: number): string {
  if (count === 1) return word;
  if (/[sxz]$|[cs]h$/.test(word)) return `${word}es`;
  if (/[^aeiou]y$/.test(word)) return `${word.slice(0, -1)}ies`;
  return `${word}s`;
}

export function variantSummary(product: Product): string {
  if (product.variantGroups.length === 0) return product.productionNote;
  return product.variantGroups
    .map((g) => `${g.options.length} ${pluralize(g.label.toLowerCase(), g.options.length)}`)
    .join(" · ");
}

export function priceFrom(product: Product): number {
  if (product.customQuoteOnly) return 0;
  const base = product.quantityTiers[0]?.unitPrice ?? 0;
  const cheapestVariant = product.variantGroups.reduce((sum, group) => {
    const min = Math.min(...group.options.map((o) => o.priceModifier));
    return sum + min;
  }, 0);
  return base + cheapestVariant;
}

/** URL-safe slug from a product name — used by the admin product form. */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
