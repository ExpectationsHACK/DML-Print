"use server";

import { put } from "@vercel/blob";

const MAX_SIZE_BYTES = 15 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "application/pdf"];

export type UploadResult = { ok: true; path: string } | { ok: false; error: string };

/**
 * Uploads customer artwork to a private Vercel Blob store. There's no user
 * session to scope this to (checkout is guest-friendly), so the server
 * validates the file itself rather than trusting a signed client token.
 */
export async function uploadArtwork(formData: FormData): Promise<UploadResult> {
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false, error: "No file received." };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { ok: false, error: "Use an image (PNG, JPG, WebP) or PDF file." };
  }
  if (file.size > MAX_SIZE_BYTES) {
    return { ok: false, error: "File is larger than 15MB." };
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return {
      ok: false,
      error:
        "Uploads aren't connected yet — mention your artwork in the notes and we'll follow up, or email it to us.",
    };
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");

  try {
    const blob = await put(`pending/${safeName}`, file, {
      access: "private",
      addRandomSuffix: true,
      contentType: file.type,
    });
    return { ok: true, path: blob.url };
  } catch {
    return { ok: false, error: "Upload failed — please try again." };
  }
}
