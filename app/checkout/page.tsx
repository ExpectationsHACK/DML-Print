import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { isPaystackConfigured } from "@/lib/paystack";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <Container className="py-12">
      <h1 className="mb-8 font-display text-4xl font-extrabold tracking-tight">Checkout</h1>
      <CheckoutForm paystackConfigured={isPaystackConfigured()} />
    </Container>
  );
}
