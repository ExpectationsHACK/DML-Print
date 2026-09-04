import { Suspense } from "react";
import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { LoginForm } from "@/components/auth/LoginForm";
import { isDbConfigured } from "@/lib/db";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <Container className="max-w-sm py-16">
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Sign in</h1>
      <div className="mt-8">
        <Suspense fallback={null}>
          <LoginForm dbConfigured={isDbConfigured()} />
        </Suspense>
      </div>
    </Container>
  );
}
