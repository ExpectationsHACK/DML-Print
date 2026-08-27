"use server";

import { z } from "zod";
import { quoteRequestsCollection, isDbConfigured, newId } from "@/lib/db";
import { sendEmail, newQuoteAdminEmail } from "@/lib/email";

const quoteSchema = z.object({
  name: z.string().min(2, "Enter your name."),
  email: z.string().email("Enter a valid email."),
  phone: z.string().min(7, "Enter a valid phone number."),
  company: z.string().optional(),
  productCategory: z.string().min(2, "Tell us what you need printed."),
  description: z.string().min(10, "Add a few more details about the job."),
  quantity: z.string().optional(),
  deadline: z.string().optional(),
});

export type QuoteResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export async function submitQuote(
  _prevState: QuoteResult | null,
  formData: FormData
): Promise<QuoteResult> {
  const parsed = quoteSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    company: formData.get("company") || undefined,
    productCategory: formData.get("productCategory"),
    description: formData.get("description"),
    quantity: formData.get("quantity") || undefined,
    deadline: formData.get("deadline") || undefined,
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { ok: false, error: "Please check the highlighted fields.", fieldErrors };
  }

  if (!isDbConfigured()) {
    return {
      ok: false,
      error:
        "Quote requests aren't connected yet — message us on WhatsApp instead and we'll get back to you.",
    };
  }

  try {
    const quotes = await quoteRequestsCollection();
    await quotes.insertOne({
      _id: newId(),
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      company: parsed.data.company ?? null,
      productCategory: parsed.data.productCategory,
      description: parsed.data.description,
      quantity: parsed.data.quantity ?? null,
      deadline: parsed.data.deadline ? new Date(parsed.data.deadline) : null,
      status: "new",
      createdAt: new Date(),
    });
  } catch {
    return { ok: false, error: "Could not submit your request. Please try again." };
  }

  if (process.env.ADMIN_NOTIFICATION_EMAIL) {
    await sendEmail({
      to: process.env.ADMIN_NOTIFICATION_EMAIL,
      ...newQuoteAdminEmail(parsed.data),
    });
  }

  return { ok: true };
}
