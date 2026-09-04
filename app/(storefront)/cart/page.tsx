import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = { title: "Your cart" };

export default function CartPage() {
  return (
    <Container className="py-12">
      <h1 className="mb-8 font-display text-4xl font-extrabold tracking-tight">Your cart</h1>
      <CartView />
    </Container>
  );
}
