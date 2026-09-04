# DML Prints

A single-vendor custom-print storefront for DML Prints — customers browse
products, customise them, upload artwork, pay with Paystack, and track their
order to delivery. Staff manage everything through `/admin`.

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4,
MongoDB (native driver, no ORM), Auth.js (credentials-based accounts), Resend
(transactional email), and Vercel Blob for file uploads. There's no separate
backend — every data read/write runs server-side in Next.js itself, via
Server Components, Server Actions, and two Route Handlers (the Auth.js
catch-all and the Paystack webhook).

## What's in the app

- **Storefront** — database-backed catalog across 7 categories, product
  customisation (variants, quantity tiers, artwork upload with a resolution
  warning), cart, and a WhatsApp order fallback on every product.
- **Checkout** — Nigerian address form, Paystack payment (server-side
  initialize + webhook-verified confirmation — the browser redirect is never
  trusted on its own). Without a Paystack key, checkout still creates a real
  order and walks through an on-site demo payment screen instead, so the
  full flow can be demoed before Paystack is connected.
- **Accounts** — email/password auth (Auth.js), order history, saved
  addresses.
- **Order tracking** — guest-friendly lookup by order number + phone.
- **Bulk quotes** — a `/quote` request form for corporate/bulk jobs that
  don't fit a fixed price, emailed straight to the admin inbox.
- **Learn** — a public `/learn` section of written or video courses, fully
  managed from `/admin/learn`.
- **Brand pages** — `/about`, `/corporate` and `/faq`, plus a homepage "Our
  Work" portfolio section pulling real project photography from MongoDB.
- **Transactional email** — order received, payment confirmed, and status
  change emails to customers; new order and new quote alerts to the admin.
  No verification emails.
- **Admin** — dashboard; orders queue with status updates, search, and date
  filtering; full product CRUD with an in-browser crop/resize tool for
  photos; portfolio CRUD for the "Our Work" section; quote request inbox;
  customer list with a detail view (orders, addresses) and a promote/demote
  control. Role-gated via `users.role = 'admin'`, checked server-side on
  every read and write, not just in the UI.

## Deliberately left out for now

- Multi-printer marketplace, routing/matching, split orders, seller
  storefronts — DML Prints is a single vendor, not a marketplace, so none of
  this applies yet.
- Canva-style design editor, AI design tools, mockup generator.
- Payment splitting, automated payouts.
- Courier API integration — delivery is coordinated manually for now.
- Product variant groups and quantity-discount tiers are still seeded from
  code / edited by hand in the database — the admin form covers name,
  category, description, price and photo, not building new variant options
  from scratch.

## Getting started

1. **Install dependencies** (already done if you're reading this from the
   scaffold): `npm install`
2. **Create a MongoDB database** — [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
   has a free forever tier (M0) and is the easiest drop-in (a local `mongod`
   or self-hosted instance also works). Copy `.env.example` to `.env.local`
   and set `MONGODB_URI` to its connection string — include a database name
   in the path, e.g. `mongodb+srv://user:pass@cluster.mongodb.net/dmlprint`.
   No schema push step: collections and indexes (unique email, unique order
   number, etc.) are created automatically the first time the app connects.
3. **Generate an auth secret**: run `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
   and set it as `AUTH_SECRET` in `.env.local` (the `npx auth secret` CLI
   works too, but prompts interactively).
4. **Make yourself an admin**: sign up through `/signup`, then in MongoDB
   Atlas's Data Explorer (or `mongosh`) open the `users` collection and edit
   your document's `role` field from `"customer"` to `"admin"`. With
   `mongosh`: `db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })`.
5. **Connect file uploads** (customer artwork *and* admin product photos):
   1. Go to [vercel.com](https://vercel.com) and log in or sign up (free).
   2. Open (or create) a project, then go to its **Storage** tab.
   3. **Create Database** → **Blob** → give it a name → create.
   4. Vercel shows a `BLOB_READ_WRITE_TOKEN` — copy it into `.env.local`.
   Until this is set: customers are told uploads aren't connected yet and
   can mention artwork in the order notes instead, and the admin product
   form's photo cropper still works, but saving falls back to the "paste an
   image URL" field since there's nowhere to store the cropped file yet.
6. **Connect Paystack**: add `PAYSTACK_SECRET_KEY` (test key to start), and
   in the Paystack dashboard point a webhook at
   `https://<your-domain>/api/paystack/webhook`. Until this is set, checkout
   still creates a real order, then shows an on-site **demo payment**
   screen (`/checkout/demo-pay`) instead of the real Paystack redirect, so
   you can walk through the full flow before Paystack is connected. That
   screen refuses to do anything once a real key is set — real payment
   verification takes over automatically.
7. **Set `NEXT_PUBLIC_WHATSAPP_NUMBER`** to the business WhatsApp number
   (digits only, country code first, no `+`).
8. `npm run dev` and open the printed local URL.

Everything above is optional to *look at* the site — without any env vars
set, the catalog, homepage, and every page render (checkout, accounts, and
admin will tell you what's not connected yet rather than erroring).

**Seeded product photos are placeholder stock photography** from Unsplash
(free license, hot-linked from `images.unsplash.com`) or your own uploads —
either is fine. `npm run seed` only inserts a product if its slug doesn't
already exist, so re-running it after editing products in `/admin/products`
never overwrites those edits.

## Project structure

```
app/                  routes (App Router)
  products/            catalog + product detail (reads from MongoDB)
  cart/, checkout/      cart, checkout, and the Paystack demo-pay screen
  learn/                 public Learn courses
  about/, corporate/, faq/  brand pages
  quote/, track-order/  bulk quote form, guest order tracking
  account/              customer area (protected)
  admin/                staff area (protected, role=admin): dashboard,
                         orders, products, portfolio, learn, quotes, customers
  api/auth/              Auth.js route handler
  api/paystack/webhook/ payment confirmation (source of truth)
components/            UI, grouped by feature area (admin/, shop/, home/, ...)
lib/
  actions/              Server Actions (checkout, auth, admin, products,
                         portfolio, courses, uploads, demo-payment...)
  data/                  categories + pure helpers (catalog.ts), MongoDB
                         product/course/portfolio queries (products.ts,
                         courses.ts, portfolio.ts), starter catalog for the
                         seed script (seed-products.ts)
  db.ts                  MongoDB client singleton + typed collection accessors
  email.ts               Resend wrapper + email templates
  types.ts, pricing.ts, format.ts, whatsapp.ts, paystack.ts
scripts/seed.ts        idempotent: admin user + starter products + courses
auth.ts                 Auth.js config (Credentials provider, JWT sessions)
proxy.ts                route protection for /account and /admin
```

There's no ORM and no relational schema file — `lib/db.ts` defines each
collection's document shape as a plain TypeScript type
(`UserDoc`, `OrderDoc`, ...) and exposes a typed accessor per collection
(`usersCollection()`, `ordersCollection()`, ...). Orders embed their line
items directly (`OrderDoc.items`) rather than joining a separate collection,
since they're always read and written together. Indexes (unique email,
unique order number, etc.) are created once, automatically, the first time
the app connects — see `ensureIndexes()` in `lib/db.ts`.

Authorization used to be enforced by Postgres Row-Level Security; without
Supabase there's no RLS layer, so every Server Action and data-fetching page
checks the caller's session (and role, for admin actions) explicitly before
touching the database — see `lib/actions/admin.ts` for the pattern.

## Design system

A premium, editorial print-studio identity: a warm ivory background, a
forest-green anchor (navigation, footer, primary CTAs) rather than a colour
wash over every section, and Manrope (ExtraBold/Bold headings, SemiBold
nav, Regular/Medium body) throughout. Tokens live in `app/globals.css`.
