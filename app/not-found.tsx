import { CartProvider } from "@/lib/cart-context";
import { Header } from "@/components/layout/Header";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";

// Deliberately no <Footer /> here: Footer reads admin-editable categories
// from MongoDB, and this page must always render even if the database is
// unreachable — a 404 fallback shouldn't have a live dependency.
export default function NotFound() {
  return (
    <CartProvider>
      <Header />
      <main className="flex-1">
        <Container className="flex flex-col items-center py-24 text-center">
          <h1 className="font-display text-4xl font-extrabold tracking-tight">
            Page not found
          </h1>
          <p className="mt-3 max-w-md text-ink-soft">
            The page you&apos;re looking for doesn&apos;t exist or has moved.
          </p>
          <LinkButton href="/" className="mt-8">
            Back to home
          </LinkButton>
        </Container>
      </main>
    </CartProvider>
  );
}
