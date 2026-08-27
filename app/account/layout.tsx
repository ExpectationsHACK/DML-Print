import Link from "next/link";
import { redirect } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { auth } from "@/auth";
import { signOut } from "@/lib/actions/auth";

const links = [
  { href: "/account", label: "Orders" },
  { href: "/account/addresses", label: "Addresses" },
];

export default async function AccountLayout({ children }: LayoutProps<"/account">) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?next=/account");
  }

  return (
    <Container className="grid gap-10 py-12 sm:grid-cols-[200px_1fr]">
      <aside>
        <p className="mb-4 truncate text-sm text-ink-soft">{session.user.email}</p>
        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-2 py-1.5 text-sm font-semibold uppercase tracking-wide text-ink-soft hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
          <form action={signOut}>
            <button className="mt-2 px-2 py-1.5 text-left text-sm font-semibold text-ink-soft hover:text-ink">
              Sign out
            </button>
          </form>
        </nav>
      </aside>
      <div>{children}</div>
    </Container>
  );
}
