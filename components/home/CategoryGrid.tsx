import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ProductMockup } from "@/components/shop/ProductMockup";
import { getProductBySlug } from "@/lib/data/products";

const services = [
  {
    title: "Corporate Printing",
    description: "Business cards, brochures, company profiles, stationery, reports and more.",
    href: "/products?category=business-cards-stationery",
    productSlug: "premium-business-cards",
  },
  {
    title: "Branding & Marketing",
    description: "Flyers, banners, stickers, promotional materials and brand collateral.",
    href: "/products?category=flyers-posters",
    productSlug: "flyers",
  },
  {
    title: "Apparel & Custom Printing",
    description: "T-shirts, aprons, DTF printing, branded clothing and merchandise.",
    href: "/products?category=apparel",
    productSlug: "custom-t-shirts",
  },
  {
    title: "Personalized & Event Printing",
    description: "Mugs, keychains, souvenirs, invitations, programmes and customized products.",
    href: "/products?category=mugs-gifts",
    productSlug: "custom-mugs",
  },
];

export async function CategoryGrid() {
  const products = await Promise.all(services.map((s) => getProductBySlug(s.productSlug)));

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <div className="mb-10 flex items-end justify-between">
          <h2 className="font-display text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
            What Can We Create for You?
          </h2>
          <Link
            href="/products"
            className="hidden text-sm font-bold text-ink hover:underline sm:block"
          >
            View all products
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {services.map((service, i) => {
            const product = products[i];
            if (!product) return null;
            return (
              <Link key={service.title} href={service.href} className="group block">
                <ProductMockup
                  product={product}
                  className="transition-transform duration-200 group-hover:-translate-y-1"
                />
                <p className="mt-3 font-display text-base font-bold leading-snug tracking-tight">
                  {service.title}
                </p>
                <p className="text-sm text-ink-soft">{service.description}</p>
                <span className="mt-1 inline-block text-sm font-bold text-forest">
                  Explore &rarr;
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
