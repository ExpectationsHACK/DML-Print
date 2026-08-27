import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { TrackOrderForm } from "@/components/track/TrackOrderForm";

export const metadata: Metadata = { title: "Track your order" };

export default function TrackOrderPage() {
  return (
    <Container className="max-w-2xl py-12">
      <h1 className="font-display text-4xl font-extrabold tracking-tight">Track your order</h1>
      <p className="mt-3 text-ink-soft">
        Enter your order number and the phone number you checked out with.
      </p>
      <div className="mt-8">
        <TrackOrderForm />
      </div>
    </Container>
  );
}
