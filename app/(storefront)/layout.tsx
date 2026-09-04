import type { ReactNode } from "react";
import { CartProvider } from "@/lib/cart-context";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// Footer reads live, admin-editable categories from MongoDB on every
// storefront page — this must render per-request, not get baked into
// static HTML at build time (which would need a DB connection during
// the build itself). Setting this on the shared layout, rather than
// page-by-page, means no future addition to Header/Footer can silently
// reintroduce a build-time DB dependency on a page that forgot to opt in.
export const dynamic = "force-dynamic";

export default function StorefrontLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </CartProvider>
  );
}
