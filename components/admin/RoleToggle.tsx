"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { setUserRole } from "@/lib/actions/admin";

export function RoleToggle({
  userId,
  role,
  isSelf,
}: {
  userId: string;
  role: "customer" | "admin";
  isSelf: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const nextRole = role === "admin" ? "customer" : "admin";

  return (
    <div>
      <Button
        variant="secondary"
        disabled={pending || (isSelf && role === "admin")}
        onClick={() =>
          startTransition(async () => {
            setError(null);
            const result = await setUserRole(userId, nextRole);
            if (!result.ok) setError(result.error ?? "Could not change role.");
          })
        }
        className="!px-5 !py-2.5 text-sm"
      >
        {pending ? "Updating..." : nextRole === "admin" ? "Promote to admin" : "Demote to customer"}
      </Button>
      {isSelf && role === "admin" && (
        <p className="mt-2 text-xs text-ink-soft">You can&apos;t remove your own admin access.</p>
      )}
      {error && <p className="mt-2 text-xs text-danger">{error}</p>}
    </div>
  );
}
