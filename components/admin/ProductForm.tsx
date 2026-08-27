"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { ImageCropper } from "@/components/admin/ImageCropper";
import { CATEGORIES } from "@/lib/data/catalog";
import type { ProductFormResult } from "@/lib/actions/products";
import type { Product } from "@/lib/types";

const initialState: ProductFormResult | null = null;

export function ProductForm({
  action,
  product,
}: {
  action: (prevState: ProductFormResult | null, formData: FormData) => Promise<ProductFormResult>;
  product?: Product;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const fieldErrors = state?.fieldErrors ?? {};
  const currentPrice = product?.quantityTiers[0]?.unitPrice ?? "";

  return (
    <form action={formAction} className="max-w-xl space-y-5">
      <Field label="Product name" htmlFor="name" required>
        <Input id="name" name="name" required defaultValue={product?.name} />
        {fieldErrors.name && <p className="mt-1 text-xs text-danger">{fieldErrors.name}</p>}
      </Field>

      <Field label="Category" htmlFor="category" required>
        <Select id="category" name="category" required defaultValue={product?.category ?? ""}>
          <option value="" disabled>
            Select a category
          </option>
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </Select>
        {fieldErrors.category && <p className="mt-1 text-xs text-danger">{fieldErrors.category}</p>}
      </Field>

      <Field label="Short description" htmlFor="shortDescription" required hint="Shown on product cards.">
        <Input id="shortDescription" name="shortDescription" required defaultValue={product?.shortDescription} />
        {fieldErrors.shortDescription && (
          <p className="mt-1 text-xs text-danger">{fieldErrors.shortDescription}</p>
        )}
      </Field>

      <Field label="Description" htmlFor="description" required>
        <Textarea id="description" name="description" required defaultValue={product?.description} />
        {fieldErrors.description && (
          <p className="mt-1 text-xs text-danger">{fieldErrors.description}</p>
        )}
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Price (₦)" htmlFor="price" required hint="Base price for the first unit.">
          <Input id="price" name="price" type="number" min="1" step="1" required defaultValue={currentPrice} />
          {fieldErrors.price && <p className="mt-1 text-xs text-danger">{fieldErrors.price}</p>}
        </Field>
        <Field label="Turnaround (days)" htmlFor="turnaroundDays" required>
          <Input
            id="turnaroundDays"
            name="turnaroundDays"
            type="number"
            min="1"
            step="1"
            required
            defaultValue={product?.turnaroundDays ?? 3}
          />
          {fieldErrors.turnaroundDays && (
            <p className="mt-1 text-xs text-danger">{fieldErrors.turnaroundDays}</p>
          )}
        </Field>
      </div>

      <Field
        label="Product image"
        htmlFor="imageFile"
        hint="Cropped to a 4:3 frame and resized automatically — or skip the crop and paste a URL below instead."
      >
        <ImageCropper name="imageFile" existingImage={product?.image} />
      </Field>
      <Field label="Or image URL" htmlFor="imageUrl">
        <Input id="imageUrl" name="imageUrl" type="url" placeholder="https://..." defaultValue={product?.image} />
        {fieldErrors.imageUrl && <p className="mt-1 text-xs text-danger">{fieldErrors.imageUrl}</p>}
      </Field>

      <div className="flex flex-col gap-2">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="allowsArtworkUpload"
            defaultChecked={product?.allowsArtworkUpload ?? true}
          />
          Customers can upload artwork for this product
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="customQuoteOnly" defaultChecked={product?.customQuoteOnly ?? false} />
          Quote-only (no fixed price / add to cart)
        </label>
      </div>

      {state && !state.ok && state.error && (
        <p className="text-sm text-danger">{state.error}</p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : product ? "Save changes" : "Create product"}
      </Button>
    </form>
  );
}
