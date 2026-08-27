import type { Metadata } from "next";
import { auth } from "@/auth";
import { addressesCollection, isDbConfigured } from "@/lib/db";
import { AddressForm } from "@/components/account/AddressForm";
import { deleteAddress } from "@/lib/actions/addresses";

export const metadata: Metadata = { title: "Your addresses" };

export default async function AddressesPage() {
  const session = await auth();
  const addresses =
    isDbConfigured() && session?.user
      ? await (await addressesCollection())
          .find({ userId: session.user.id })
          .sort({ createdAt: -1 })
          .toArray()
      : [];

  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl font-extrabold tracking-tight">Your addresses</h1>

      {addresses.length > 0 && (
        <ul className="space-y-3">
          {addresses.map((address) => (
            <li
              key={address._id}
              className="flex items-start justify-between border border-line bg-surface p-4"
            >
              <div className="text-sm">
                <p className="font-semibold">{address.fullName}</p>
                <p className="text-ink-soft">{address.phone}</p>
                <p className="text-ink-soft">
                  {address.street}, {address.city}, {address.lga}, {address.state}
                </p>
              </div>
              <form action={deleteAddress.bind(null, address._id)}>
                <button className="text-xs font-semibold uppercase tracking-wide text-ink-soft hover:text-danger">
                  Remove
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}

      <AddressForm />
    </div>
  );
}
