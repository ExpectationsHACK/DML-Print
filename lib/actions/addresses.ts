"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { addressesCollection, isDbConfigured, newId } from "@/lib/db";
import { NIGERIAN_STATES } from "@/lib/data/states";

const addressSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(7),
  state: z.enum(NIGERIAN_STATES as unknown as [string, ...string[]]),
  lga: z.string().min(2),
  city: z.string().min(2),
  street: z.string().min(4),
  landmark: z.string().optional(),
});

export type AddAddressResult = { ok: boolean; error?: string };

export async function addAddress(
  _prevState: AddAddressResult | null,
  formData: FormData
): Promise<AddAddressResult> {
  const parsed = addressSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    state: formData.get("state"),
    lga: formData.get("lga"),
    city: formData.get("city"),
    street: formData.get("street"),
    landmark: formData.get("landmark") || undefined,
  });

  if (!parsed.success) {
    return { ok: false, error: "Please fill in all required fields." };
  }

  if (!isDbConfigured()) {
    return { ok: false, error: "Addresses aren't connected yet." };
  }

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { ok: false, error: "You need to be signed in." };

  const addresses = await addressesCollection();
  await addresses.insertOne({
    _id: newId(),
    userId,
    fullName: parsed.data.fullName,
    phone: parsed.data.phone,
    state: parsed.data.state,
    lga: parsed.data.lga,
    city: parsed.data.city,
    street: parsed.data.street,
    landmark: parsed.data.landmark ?? null,
    isDefault: false,
    createdAt: new Date(),
  });

  revalidatePath("/account/addresses");
  return { ok: true };
}

export async function deleteAddress(addressId: string): Promise<void> {
  if (!isDbConfigured()) return;

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return;

  // Scoped to the signed-in user — there's no RLS here, so ownership has to
  // be checked explicitly rather than trusted from the client.
  const addresses = await addressesCollection();
  await addresses.deleteOne({ _id: addressId, userId });
  revalidatePath("/account/addresses");
}
