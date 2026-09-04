import { MongoClient, type Collection } from "mongodb";

export type Role = "customer" | "admin";
export type OrderStatusValue =
  | "pending_payment"
  | "paid"
  | "in_production"
  | "quality_check"
  | "ready_for_dispatch"
  | "dispatched"
  | "delivered"
  | "cancelled";
export type DeliveryMethodValue = "delivery" | "pickup";
export type QuoteStatusValue = "new" | "quoted" | "closed";

export type UserDoc = {
  _id: string;
  email: string;
  passwordHash: string;
  fullName: string | null;
  phone: string | null;
  role: Role;
  createdAt: Date;
};

export type AddressDoc = {
  _id: string;
  userId: string;
  fullName: string;
  phone: string;
  state: string;
  lga: string;
  city: string;
  street: string;
  landmark: string | null;
  isDefault: boolean;
  createdAt: Date;
};

export type OrderItemDoc = {
  productSlug: string;
  productName: string;
  category: string;
  variantLabel: string | null;
  selectedVariants: Record<string, string>;
  quantity: number;
  unitPrice: number;
  artworkPath: string | null;
  notes: string | null;
};

export type OrderDoc = {
  _id: string;
  orderNumber: string;
  userId: string | null;
  email: string;
  phone: string;
  status: OrderStatusValue;
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryMethod: DeliveryMethodValue;
  address: Record<string, unknown> | null;
  paystackReference: string | null;
  paidAt: Date | null;
  notes: string | null;
  items: OrderItemDoc[];
  createdAt: Date;
  updatedAt: Date;
};

export type QuoteRequestDoc = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  productCategory: string;
  description: string;
  quantity: string | null;
  materialFinish: string | null;
  filePath: string | null;
  deadline: Date | null;
  status: QuoteStatusValue;
  createdAt: Date;
};

export type CategoryDoc = {
  _id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  createdAt: Date;
};

export type VariantOptionDoc = { value: string; label: string; priceModifier: number };
export type VariantGroupDoc = { key: string; label: string; options: VariantOptionDoc[] };
export type QuantityTierDoc = { minQty: number; unitPrice: number };

export type ProductDoc = {
  _id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  image: string;
  imageAlt: string;
  variantGroups: VariantGroupDoc[];
  quantityTiers: QuantityTierDoc[];
  minQuantity: number;
  quantityStep: number;
  allowsArtworkUpload: boolean;
  customQuoteOnly: boolean;
  turnaroundDays: number;
  productionNote: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PortfolioCategoryValue = "corporate" | "branding" | "apparel" | "events" | "personalized";

export type PortfolioDoc = {
  _id: string;
  slug: string;
  title: string;
  category: PortfolioCategoryValue;
  clientName: string | null;
  productionDetails: string | null;
  description: string;
  image: string;
  imageAlt: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CourseType = "video" | "written";

export type CourseDoc = {
  _id: string;
  slug: string;
  title: string;
  type: CourseType;
  summary: string;
  content: string;
  coverImage: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

async function ensureIndexes(client: MongoClient): Promise<void> {
  const database = client.db();
  await Promise.all([
    database.collection<UserDoc>("users").createIndex({ email: 1 }, { unique: true }),
    database.collection<OrderDoc>("orders").createIndex({ orderNumber: 1 }, { unique: true }),
    database
      .collection<OrderDoc>("orders")
      .createIndex({ paystackReference: 1 }, { unique: true, sparse: true }),
    database.collection<OrderDoc>("orders").createIndex({ userId: 1 }),
    database.collection<OrderDoc>("orders").createIndex({ status: 1 }),
    database.collection<AddressDoc>("addresses").createIndex({ userId: 1 }),
    database.collection<QuoteRequestDoc>("quote_requests").createIndex({ createdAt: -1 }),
    database.collection<ProductDoc>("products").createIndex({ slug: 1 }, { unique: true }),
    database.collection<ProductDoc>("products").createIndex({ category: 1 }),
    database.collection<CourseDoc>("courses").createIndex({ slug: 1 }, { unique: true }),
    database.collection<PortfolioDoc>("portfolio").createIndex({ slug: 1 }, { unique: true }),
    database.collection<PortfolioDoc>("portfolio").createIndex({ category: 1 }),
    database.collection<CategoryDoc>("categories").createIndex({ slug: 1 }, { unique: true }),
  ]);
}

const globalForMongo = globalThis as unknown as { mongoClientPromise?: Promise<MongoClient> };

function getClientPromise(): Promise<MongoClient> {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set");
  }

  // Cached on the global object in dev so Next.js's module reloading doesn't
  // open a fresh connection pool on every hot reload.
  if (globalForMongo.mongoClientPromise) {
    return globalForMongo.mongoClientPromise;
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  const promise = client.connect().then(async (connected) => {
    await ensureIndexes(connected);
    return connected;
  });

  if (process.env.NODE_ENV !== "production") {
    globalForMongo.mongoClientPromise = promise;
  }

  return promise;
}

export function isDbConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI);
}

/** Random opaque string id — used for every document's `_id` in this app. */
export function newId(): string {
  return crypto.randomUUID();
}

export async function usersCollection(): Promise<Collection<UserDoc>> {
  const client = await getClientPromise();
  return client.db().collection<UserDoc>("users");
}

export async function addressesCollection(): Promise<Collection<AddressDoc>> {
  const client = await getClientPromise();
  return client.db().collection<AddressDoc>("addresses");
}

export async function ordersCollection(): Promise<Collection<OrderDoc>> {
  const client = await getClientPromise();
  return client.db().collection<OrderDoc>("orders");
}

export async function quoteRequestsCollection(): Promise<Collection<QuoteRequestDoc>> {
  const client = await getClientPromise();
  return client.db().collection<QuoteRequestDoc>("quote_requests");
}

export async function productsCollection(): Promise<Collection<ProductDoc>> {
  const client = await getClientPromise();
  return client.db().collection<ProductDoc>("products");
}

export async function coursesCollection(): Promise<Collection<CourseDoc>> {
  const client = await getClientPromise();
  return client.db().collection<CourseDoc>("courses");
}

export async function portfolioCollection(): Promise<Collection<PortfolioDoc>> {
  const client = await getClientPromise();
  return client.db().collection<PortfolioDoc>("portfolio");
}

export async function categoriesCollection(): Promise<Collection<CategoryDoc>> {
  const client = await getClientPromise();
  return client.db().collection<CategoryDoc>("categories");
}
