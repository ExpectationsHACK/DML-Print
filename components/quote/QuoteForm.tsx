"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { submitQuote, type QuoteResult } from "@/lib/actions/quotes";
import { uploadArtwork } from "@/lib/actions/uploads";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { Category } from "@/lib/types";

const initialState: QuoteResult | null = null;

export function QuoteForm({ categories }: { categories: Category[] }) {
  const searchParams = useSearchParams();
  const prefillProduct = searchParams.get("product") ?? "";
  const [state, action, pending] = useActionState(submitQuote, initialState);
  const [filePath, setFilePath] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

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

  async function handleFile(file: File | null) {
    setFilePath("");
    setUploadError(null);
    setFileName(file?.name ?? "");
    if (!file) return;

    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const result = await uploadArtwork(fd);
    setUploading(false);

    if (result.ok) {
      setFilePath(result.path);
    } else {
      setUploadError(result.error);
    }
  }

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
        <Field label="Phone / WhatsApp" htmlFor="phone" required>
          <Input id="phone" name="phone" type="tel" required />
          {fieldErrors.phone && <p className="mt-1 text-xs text-danger">{fieldErrors.phone}</p>}
        </Field>
      </div>

      <Field label="What do you need printed?" htmlFor="productCategory" required>
        <Select id="productCategory" name="productCategory" defaultValue={prefillProduct} required>
          <option value="" disabled>
            Select a category
          </option>
          {prefillProduct && !categories.some((c) => c.name === prefillProduct) && (
            <option value={prefillProduct}>{prefillProduct}</option>
          )}
          {categories.map((c) => (
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
        <Field label="Material / finish (if known)" htmlFor="materialFinish">
          <Input id="materialFinish" name="materialFinish" placeholder="e.g. matte, 300gsm" />
        </Field>
      </div>

      <Field label="Preferred deadline" htmlFor="deadline">
        <Input id="deadline" name="deadline" type="date" />
      </Field>

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

      <Field label="Upload design / brief (optional)" htmlFor="file">
        <input
          id="file"
          type="file"
          accept="image/png,image/jpeg,image/webp,application/pdf"
          onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
          className="w-full rounded-[var(--radius-control)] border-2 border-line bg-surface px-3 py-2.5 text-sm"
        />
        <input type="hidden" name="filePath" value={filePath} />
        {uploading && <p className="mt-1.5 text-xs text-ink-soft">Uploading&hellip;</p>}
        {filePath && !uploading && (
          <p className="mt-1.5 text-xs font-semibold text-ink">{fileName} uploaded ✓</p>
        )}
        {uploadError && <p className="mt-1.5 text-xs text-danger">{uploadError}</p>}
      </Field>

      {state && !state.ok && <p className="text-sm text-danger">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Sending..." : "Submit Project Request"}
      </Button>

      <p className="text-sm text-ink-soft">
        Prefer WhatsApp?{" "}
        <a
          href={buildWhatsAppLink("Hello DML Prints, I'd like to start a project.")}
          className="font-semibold text-ink underline underline-offset-4 hover:text-forest"
        >
          Chat With DML Prints
        </a>
      </p>
    </form>
  );
}
