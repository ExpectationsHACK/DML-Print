"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, LinkButton } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { formatNaira } from "@/lib/format";
import {
  lineUnitPrice,
  unitPriceForQuantity,
  variantLabel,
} from "@/lib/pricing";
import { useCart } from "@/lib/cart-context";
import { buildWhatsAppLink, orderWhatsAppMessage } from "@/lib/whatsapp";
import { uploadArtwork } from "@/lib/actions/uploads";
import type { Product, SelectedVariants } from "@/lib/types";

const MIN_PRINT_DIMENSION = 1000; // px, on the shorter side

export function ProductCustomizer({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();

  const [selected, setSelected] = useState<SelectedVariants>(() =>
    Object.fromEntries(
      product.variantGroups.map((g) => [g.key, g.options[0]?.value ?? ""])
    )
  );
  const [quantity, setQuantity] = useState(product.minQuantity);
  const [notes, setNotes] = useState("");
  const [artworkFile, setArtworkFile] = useState<File | null>(null);
  const [artworkPath, setArtworkPath] = useState<string | null>(null);
  const [artworkWarning, setArtworkWarning] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [added, setAdded] = useState(false);

  const unitPrice = lineUnitPrice(product, selected, quantity);
  const total = unitPrice * quantity;
  const label = variantLabel(product, selected);

  const nextTier = useMemo(() => {
    const tiers = [...product.quantityTiers].sort((a, b) => a.minQty - b.minQty);
    return tiers.find((t) => t.minQty > quantity);
  }, [product.quantityTiers, quantity]);

  async function handleFile(file: File | null) {
    setArtworkFile(file);
    setArtworkPath(null);
    setArtworkWarning(null);
    if (!file) return;

    const isPdf = file.type === "application/pdf";
    const isImage = file.type.startsWith("image/");

    if (!isPdf && !isImage) {
      setArtworkWarning("Use an image (PNG, JPG, WebP) or PDF file.");
      return;
    }

    if (isImage) {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const shortSide = Math.min(img.width, img.height);
        if (shortSide < MIN_PRINT_DIMENSION) {
          setArtworkWarning(
            `This image is ${img.width}×${img.height}px — it may look blurry when printed at size. A higher-resolution file will print sharper.`
          );
        }
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }

    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const result = await uploadArtwork(fd);
    setUploading(false);

    if (result.ok) {
      setArtworkPath(result.path);
    } else {
      setArtworkWarning((prev) => prev ?? result.error);
    }
  }

  function handleAddToCart() {
    addItem({
      productSlug: product.slug,
      productName: product.name,
      categorySlug: product.category,
      selectedVariants: selected,
      variantLabel: label,
      quantity,
      unitPrice,
      artworkFileName: artworkFile?.name,
      artworkPath: artworkPath ?? undefined,
      notes: notes.trim() || undefined,
    });
    setAdded(true);
  }

  if (product.customQuoteOnly) {
    return (
      <div className="rounded-[var(--radius-card)] bg-surface-sunken p-6">
        <p className="text-sm text-ink-soft">
          This product is quoted per project — tell us the brief and we&apos;ll
          get back to you with pricing and a timeline.
        </p>
        <LinkButton
          href={`/quote?product=${encodeURIComponent(product.name)}`}
          className="mt-4"
        >
          Request a quote
        </LinkButton>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {product.variantGroups.map((group) => (
        <div key={group.key}>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-soft">
            {group.label}
          </span>
          <div className="flex flex-wrap gap-2">
            {group.options.map((option) => {
              const isActive = selected[group.key] === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setSelected((prev) => ({ ...prev, [group.key]: option.value }))
                  }
                  className={`rounded-[var(--radius-control)] border-2 px-3.5 py-2 text-sm font-semibold transition-colors ${
                    isActive
                      ? "border-ink bg-ink text-cream"
                      : "border-line text-ink hover:border-ink"
                  }`}
                >
                  {option.label}
                  {option.priceModifier > 0 && (
                    <span className="ml-1 text-xs opacity-70">
                      +{formatNaira(option.priceModifier)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <div>
        <Field label="Quantity" htmlFor="quantity">
          <div className="flex items-center gap-3">
            <Input
              id="quantity"
              type="number"
              min={product.minQuantity}
              step={product.quantityStep}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(product.minQuantity, Number(e.target.value) || 0))
              }
              className="w-32"
            />
            <span className="text-sm font-semibold text-ink-soft">
              {formatNaira(unitPriceForQuantity(product, quantity))} / unit
            </span>
          </div>
        </Field>
        {nextTier && (
          <p className="mt-1.5 text-xs font-semibold text-ink">
            Order {nextTier.minQty}+ and pay {formatNaira(nextTier.unitPrice)} per unit.
          </p>
        )}
      </div>

      {product.allowsArtworkUpload && (
        <Field
          label="Upload artwork"
          htmlFor="artwork"
          hint="PNG, JPG, WebP or PDF. No design yet? Leave this and add notes below — we can help."
        >
          <input
            id="artwork"
            type="file"
            accept="image/png,image/jpeg,image/webp,application/pdf"
            onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            className="w-full rounded-[var(--radius-control)] border-2 border-line bg-surface px-3 py-2.5 text-sm"
          />
          {uploading && (
            <p className="mt-1.5 text-xs text-ink-soft">Uploading&hellip;</p>
          )}
          {artworkPath && !uploading && (
            <p className="mt-1.5 text-xs font-semibold text-ink">Uploaded ✓</p>
          )}
          {artworkWarning && (
            <p className="mt-1.5 text-xs text-danger">{artworkWarning}</p>
          )}
        </Field>
      )}

      <Field label="Notes (optional)" htmlFor="notes">
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything we should know — colours, deadline, placement..."
        />
      </Field>

      <div className="border-t border-line pt-6">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-ink-soft">Total</span>
          <span className="font-display text-2xl font-extrabold">{formatNaira(total)}</span>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={handleAddToCart} className="flex-1 sm:flex-none">
            {added ? "Added ✓" : "Add to cart"}
          </Button>
          <Button variant="secondary" onClick={() => router.push("/cart")}>
            View cart
          </Button>
        </div>

        <a
          href={buildWhatsAppLink(
            orderWhatsAppMessage({
              productName: product.name,
              variantLabel: label,
              quantity,
            })
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm font-semibold text-ink-soft underline underline-offset-4 hover:text-ink"
        >
          Or order this via WhatsApp instead
        </a>
      </div>
    </div>
  );
}
