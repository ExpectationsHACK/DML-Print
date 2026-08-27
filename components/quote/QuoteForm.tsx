"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { CATEGORIES } from "@/lib/data/catalog";
import { submitQuote, type QuoteResult } from "@/lib/actions/quotes";

const initialState: QuoteResult | null = null;

export function QuoteForm() {
  const searchParams = useSearchParams();
  const prefillProduct = searchParams.get("product") ?? "";
  const [state, action, pending] = useActionState(submitQuote, initialState);

  if (state?.ok) {
    return (
      <div className="border border-line bg-surface-sunken p-8 text-center">
        <p className="font-display text-2xl font-extrabold tracking-tight">Request sent</p>
        <p className="mt-2 text-ink-soft">
          We&apos;ll review your brief and get back to you with pricing and a
          timeline, usually within one business day.
        </p>
      </div>
    );
  }

  const fieldErrors = state && !state.ok ? state.fieldErrors ?? {} : {};

  return (
    <form action={action} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" htmlFor="name" required>
          <Input id="name" name="name" required />
          {fieldErrors.name && <p className="mt-1 text-xs text-danger">{fieldErrors.name}</p>}
        </Field>
        <Field label="Company (optional)" htmlFor="company">
          <Input id="company" name="company" />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" htmlFor="email" required>
          <Input id="email" name="email" type="email" required />
          {fieldErrors.email && <p className="mt-1 text-xs text-danger">{fieldErrors.email}</p>}
        </Field>
        <Field label="Phone" htmlFor="phone" required>
          <Input id="phone" name="phone" type="tel" required />
          {fieldErrors.phone && <p className="mt-1 text-xs text-danger">{fieldErrors.phone}</p>}
        </Field>
      </div>

      <Field label="What do you need printed?" htmlFor="productCategory" required>
        <Select id="productCategory" name="productCategory" defaultValue={prefillProduct} required>
          <option value="" disabled>
            Select a category
          </option>
          {prefillProduct && !CATEGORIES.some((c) => c.name === prefillProduct) && (
            <option value={prefillProduct}>{prefillProduct}</option>
          )}
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.name}>
              {c.name}
            </option>
          ))}
          <option value="Other">Other</option>
        </Select>
        {fieldErrors.productCategory && (
          <p className="mt-1 text-xs text-danger">{fieldErrors.productCategory}</p>
        )}
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Estimated quantity" htmlFor="quantity">
          <Input id="quantity" name="quantity" placeholder="e.g. 500 pieces" />
        </Field>
        <Field label="Deadline" htmlFor="deadline">
          <Input id="deadline" name="deadline" type="date" />
        </Field>
      </div>

      <Field label="Tell us about the job" htmlFor="description" required>
        <Textarea
          id="description"
          name="description"
          required
          placeholder="Sizes, colours, branding, delivery location — the more detail, the more accurate the quote."
        />
        {fieldErrors.description && (
          <p className="mt-1 text-xs text-danger">{fieldErrors.description}</p>
        )}
      </Field>

      {state && !state.ok && <p className="text-sm text-danger">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Sending..." : "Send request"}
      </Button>
    </form>
  );
}
