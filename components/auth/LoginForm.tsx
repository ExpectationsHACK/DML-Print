"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { signIn, type AuthResult } from "@/lib/actions/auth";

const initialState: AuthResult | null = null;

export function LoginForm({ dbConfigured }: { dbConfigured: boolean }) {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/account";
  const [state, action, pending] = useActionState(signIn, initialState);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="next" value={next} />

      {!dbConfigured && (
        <p className="border border-line bg-surface-sunken p-3 text-sm text-ink-soft">
          Sign-in isn&apos;t connected yet in this environment — the database
          needs to be configured first.
        </p>
      )}

      <Field label="Email" htmlFor="email" required>
        <Input id="email" name="email" type="email" required autoComplete="email" />
      </Field>
      <Field label="Password" htmlFor="password" required>
        <Input id="password" name="password" type="password" required autoComplete="current-password" />
      </Field>

      {state && !state.ok && <p className="text-sm text-danger">{state.error}</p>}

      <Button type="submit" disabled={pending} className="w-full justify-center">
        {pending ? "Signing in..." : "Sign in"}
      </Button>

      <p className="text-center text-sm text-ink-soft">
        No account yet?{" "}
        <Link href="/signup" className="font-semibold text-ink hover:underline">
          Create one
        </Link>
      </p>
    </form>
  );
}
