"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Field";
import { NIGERIAN_STATES } from "@/lib/data/states";
import { addAddress, type AddAddressResult } from "@/lib/actions/addresses";

const initialState: AddAddressResult | null = null;

export function AddressForm() {
  const [state, action, pending] = useActionState(addAddress, initialState);

  return (
    <form action={action} className="space-y-4 border border-line bg-surface-sunken p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" htmlFor="fullName" required>
          <Input id="fullName" name="fullName" required />
        </Field>
        <Field label="Phone" htmlFor="phone" required>
          <Input id="phone" name="phone" type="tel" required />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="State" htmlFor="state" required>
          <Select id="state" name="state" required defaultValue="">
            <option value="" disabled>
              Select state
            </option>
            {NIGERIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="LGA" htmlFor="lga" required>
          <Input id="lga" name="lga" required />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="City / area" htmlFor="city" required>
          <Input id="city" name="city" required />
        </Field>
        <Field label="Landmark" htmlFor="landmark">
          <Input id="landmark" name="landmark" />
        </Field>
      </div>
      <Field label="Street address" htmlFor="street" required>
        <Input id="street" name="street" required />
      </Field>

      {state && !state.ok && <p className="text-sm text-danger">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : "Save address"}
      </Button>
    </form>
  );
}
