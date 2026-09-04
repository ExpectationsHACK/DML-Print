import Image from "next/image";
import { cn } from "@/lib/cn";
import type { Product } from "@/lib/types";

export function ProductMockup({
  product,
  className,
  badge,
  priority,
}: {
  product: Product;
  className?: string;
  badge?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cn("relative aspect-[4/3] w-full overflow-hidden bg-surface-sunken", className)}
      style={{ borderRadius: "var(--radius-card)" }}
    >
      {badge && (
        <span className="absolute left-3 top-3 z-10 rounded-md bg-forest px-2.5 py-1 text-xs font-bold text-cream">
          {badge}
        </span>
      )}
      <Image
        src={product.image}
        alt={product.imageAlt}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        className="object-cover"
        priority={priority}
      />
    </div>
  );
}
