import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = { title: "Create account" };

export default function SignupPage() {
  return (
    <Container className="max-w-sm py-16">
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Create account</h1>
      <div className="mt-8">
        <SignupForm />
      </div>
    </Container>
  );
}
