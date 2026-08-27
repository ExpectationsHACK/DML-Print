"use server";

import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";
import { signIn as authSignIn, signOut as authSignOut } from "@/auth";
import { usersCollection, isDbConfigured, newId } from "@/lib/db";

export type AuthResult = { ok: true } | { ok: false; error: string };

function friendlyAuthError(message: string): string {
  if (!isDbConfigured()) {
    return "Sign-in isn't connected yet — the database needs to be configured first.";
  }
  return message;
}

export async function signIn(
  _prevState: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/account");

  try {
    await authSignIn("credentials", { email, password, redirectTo: next });
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, error: friendlyAuthError("That email and password don't match.") };
    }
    throw error;
  }

  return { ok: true };
}

export async function signUp(
  _prevState: AuthResult | null,
  formData: FormData
): Promise<AuthResult> {
  const email = String(formData.get("email") || "").toLowerCase().trim();
  const password = String(formData.get("password") || "");
  const fullName = String(formData.get("fullName") || "");

  if (!isDbConfigured()) {
    return {
      ok: false,
      error: "Sign-up isn't connected yet — the database needs to be configured first.",
    };
  }

  try {
    const users = await usersCollection();
    const existing = await users.findOne({ email });
    if (existing) {
      return { ok: false, error: "An account with that email already exists." };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await users.insertOne({
      _id: newId(),
      email,
      passwordHash,
      fullName: fullName || null,
      phone: null,
      role: "customer",
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("signUp failed:", error);
    return { ok: false, error: "Could not create your account. Please try again." };
  }

  try {
    await authSignIn("credentials", { email, password, redirectTo: "/account" });
  } catch (error) {
    if (error instanceof AuthError) {
      return { ok: false, error: "Account created — please sign in." };
    }
    throw error;
  }

  return { ok: true };
}

export async function signOut(): Promise<void> {
  await authSignOut({ redirectTo: "/" });
}
