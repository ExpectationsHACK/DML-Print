"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { ImageCropper } from "@/components/admin/ImageCropper";
import { PORTFOLIO_CATEGORY_LABEL, type PortfolioCategory, type PortfolioItem } from "@/lib/types";
import type { PortfolioFormResult } from "@/lib/actions/portfolio";

const initialState: PortfolioFormResult | null = null;
const categories = Object.entries(PORTFOLIO_CATEGORY_LABEL) as [PortfolioCategory, string][];

export function PortfolioForm({
  action,
  item,
}: {
  action: (prevState: PortfolioFormResult | null, formData: FormData) => Promise<PortfolioFormResult>;
  item?: PortfolioItem;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const fieldErrors = state?.fieldErrors ?? {};

  return (
    <form action={formAction} className="max-w-xl space-y-5">
      <Field label="Title" htmlFor="title" required>
        <Input id="title" name="title" required defaultValue={item?.title} />
        {fieldErrors.title && <p className="mt-1 text-xs text-danger">{fieldErrors.title}</p>}
      </Field>

      <Field label="Category" htmlFor="category" required>
        <Select id="category" name="category" required defaultValue={item?.category ?? ""}>
          <option value="" disabled>
            Select a category
          </option>
          {categories.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        {fieldErrors.category && <p className="mt-1 text-xs text-danger">{fieldErrors.category}</p>}
      </Field>

      <Field label="Client / project name" htmlFor="clientName" hint="Only if you have permission to name them. Leave blank to keep it anonymous.">
        <Input id="clientName" name="clientName" defaultValue={item?.clientName ?? ""} />
      </Field>

      <Field label="Production details" htmlFor="productionDetails" hint="E.g. materials, finish, quantity — shown as a short line under the description.">
        <Input id="productionDetails" name="productionDetails" defaultValue={item?.productionDetails ?? ""} />
      </Field>

      <Field label="Description" htmlFor="description" required>
        <Textarea id="description" name="description" required defaultValue={item?.description} />
        {fieldErrors.description && (
          <p className="mt-1 text-xs text-danger">{fieldErrors.description}</p>
        )}
      </Field>

      <Field
        label="Photo"
        htmlFor="imageFile"
        hint="Cropped and resized automatically — or skip the crop and paste a URL below instead."
      >
        <ImageCropper name="imageFile" existingImage={item?.image} />
      </Field>
      <Field label="Or image URL" htmlFor="imageUrl">
        <Input id="imageUrl" name="imageUrl" type="url" placeholder="https://..." defaultValue={item?.image} />
        {fieldErrors.imageUrl && <p className="mt-1 text-xs text-danger">{fieldErrors.imageUrl}</p>}
      </Field>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" defaultChecked={item?.published ?? true} />
        Published (visible in the public "Our Work" section)
      </label>

      {state && !state.ok && state.error && <p className="text-sm text-danger">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : item ? "Save changes" : "Add to portfolio"}
      </Button>
    </form>
  );
}
