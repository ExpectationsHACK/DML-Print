import type { Product, SelectedVariants } from "@/lib/types";

/** Flat delivery fee for MVP — replace with a courier-rate lookup later. */
export const DELIVERY_FEE = 2500;
export const FREE_DELIVERY_THRESHOLD = 150000;

export function unitPriceForQuantity(product: Product, quantity: number): number {
  const tiers = [...product.quantityTiers].sort((a, b) => a.minQty - b.minQty);
  let unitPrice = tiers[0]?.unitPrice ?? 0;
  for (const tier of tiers) {
    if (quantity >= tier.minQty) unitPrice = tier.unitPrice;
  }
  return unitPrice;
}

export function variantSurcharge(
  product: Product,
  selected: SelectedVariants
): number {
  return product.variantGroups.reduce((sum, group) => {
    const chosen = selected[group.key];
    const option = group.options.find((o) => o.value === chosen);
    return sum + (option?.priceModifier ?? 0);
  }, 0);
}

export function lineUnitPrice(
  product: Product,
  selected: SelectedVariants,
  quantity: number
): number {
  return unitPriceForQuantity(product, quantity) + variantSurcharge(product, selected);
}

export function variantLabel(product: Product, selected: SelectedVariants): string {
  return product.variantGroups
    .map((group) => {
      const chosen = selected[group.key];
      const option = group.options.find((o) => o.value === chosen);
      return option ? `${group.label}: ${option.label}` : null;
    })
    .filter(Boolean)
    .join(" · ");
}

export type CartTotals = {
  subtotal: number;
  delivery: number;
  total: number;
};

export function computeCartTotals(
  items: { unitPrice: number; quantity: number }[],
  deliveryMethod: "delivery" | "pickup"
): CartTotals {
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const delivery =
    deliveryMethod === "pickup" || subtotal >= FREE_DELIVERY_THRESHOLD || subtotal === 0
      ? 0
      : DELIVERY_FEE;
  return { subtotal, delivery, total: subtotal + delivery };
}
