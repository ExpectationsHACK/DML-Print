/**
 * Not a closed set — the built-in categories in lib/data/catalog.ts are
 * seeded defaults, but admins can add more from the product form, stored in
 * the `categories` collection. See lib/data/categories.ts.
 */
export type CategorySlug = string;

export type Category = {
  slug: CategorySlug;
  name: string;
  tagline: string;
  description: string;
};

export type VariantOption = {
  value: string;
  label: string;
  /** Added to the unit price when this option is selected. */
  priceModifier: number;
};

export type VariantGroup = {
  key: string;
  label: string;
  options: VariantOption[];
};

export type QuantityTier = {
  minQty: number;
  unitPrice: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  shortDescription: string;
  description: string;
  /** Full image URL — an uploaded Vercel Blob URL, or any other hosted image. */
  image: string;
  imageAlt: string;
  variantGroups: VariantGroup[];
  quantityTiers: QuantityTier[];
  minQuantity: number;
  quantityStep: number;
  allowsArtworkUpload: boolean;
  customQuoteOnly: boolean;
  turnaroundDays: number;
  productionNote: string;
};

export type CourseType = "video" | "written";

export type Course = {
  id: string;
  slug: string;
  title: string;
  type: CourseType;
  summary: string;
  /** Video: an embeddable URL (YouTube/Vimeo/etc). Written: the article body (plain text/markdown-ish). */
  content: string;
  coverImage: string;
  published: boolean;
  createdAt: string;
};

export type PortfolioCategory = "corporate" | "branding" | "apparel" | "events" | "personalized";

export const PORTFOLIO_CATEGORY_LABEL: Record<PortfolioCategory, string> = {
  corporate: "Corporate",
  branding: "Branding",
  apparel: "Apparel",
  events: "Events",
  personalized: "Personalized",
};

export type PortfolioItem = {
  id: string;
  slug: string;
  title: string;
  category: PortfolioCategory;
  clientName: string | null;
  productionDetails: string | null;
  description: string;
  image: string;
  imageAlt: string;
  published: boolean;
  createdAt: string;
};

export type SelectedVariants = Record<string, string>;

export type CartItem = {
  lineId: string;
  productSlug: string;
  productName: string;
  categorySlug: CategorySlug;
  selectedVariants: SelectedVariants;
  variantLabel: string;
  quantity: number;
  unitPrice: number;
  artworkFileName?: string;
  artworkPath?: string;
  notes?: string;
};

export type NigerianAddress = {
  fullName: string;
  phone: string;
  state: string;
  lga: string;
  city: string;
  street: string;
  landmark?: string;
};

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "in_production"
  | "quality_check"
  | "ready_for_dispatch"
  | "dispatched"
  | "delivered"
  | "cancelled";

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  pending_payment: "Pending payment",
  paid: "Payment confirmed",
  in_production: "In production",
  quality_check: "Quality check",
  ready_for_dispatch: "Ready for dispatch",
  dispatched: "Dispatched",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const ORDER_STATUS_SEQUENCE: OrderStatus[] = [
  "paid",
  "in_production",
  "quality_check",
  "ready_for_dispatch",
  "dispatched",
  "delivered",
];
