/**
 * One-time / idempotent seed script.
 *   npx tsx scripts/seed.ts
 *
 * - Upserts the admin account from SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD.
 * - Inserts the starter product catalog (lib/data/seed-products.ts) — only
 *   products that don't already exist by slug, so re-running this never
 *   clobbers catalog edits made later through the admin UI.
 * - Inserts two sample Learn courses, same insert-if-missing rule.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { MongoClient } from "mongodb";
import type { UserDoc, ProductDoc, CourseDoc } from "../lib/db";

function loadEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key]) continue;
    process.env[key] = rawValue.trim().replace(/^"(.*)"$/, "$1");
  }
}

loadEnvLocal();

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set in .env.local");

  const adminEmail = process.env.SEED_ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    throw new Error("SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD are not set in .env.local");
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db();
  console.log(`Connected to database: ${db.databaseName}`);

  // --- admin user -----------------------------------------------------
  const users = db.collection<UserDoc>("users");
  await users.createIndex({ email: 1 }, { unique: true });
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  const existingAdmin = await users.findOne({ email: adminEmail });

  if (existingAdmin) {
    await users.updateOne(
      { email: adminEmail },
      { $set: { passwordHash, role: "admin" } }
    );
    console.log(`Admin user updated: ${adminEmail}`);
  } else {
    await users.insertOne({
      _id: crypto.randomUUID(),
      email: adminEmail,
      passwordHash,
      fullName: "DML Prints Admin",
      phone: null,
      role: "admin",
      createdAt: new Date(),
    });
    console.log(`Admin user created: ${adminEmail}`);
  }

  // --- products ---------------------------------------------------------
  const { SEED_PRODUCTS } = await import("../lib/data/seed-products");
  const products = db.collection<ProductDoc>("products");
  await products.createIndex({ slug: 1 }, { unique: true });
  await products.createIndex({ category: 1 });

  let inserted = 0;
  for (const product of SEED_PRODUCTS) {
    const exists = await products.findOne({ slug: product.slug });
    if (exists) continue;
    const now = new Date();
    await products.insertOne({ _id: crypto.randomUUID(), ...product, createdAt: now, updatedAt: now });
    inserted += 1;
  }
  console.log(`Products: ${inserted} inserted, ${SEED_PRODUCTS.length - inserted} already present.`);

  // --- sample Learn courses ---------------------------------------------
  const courses = db.collection<CourseDoc>("courses");
  await courses.createIndex({ slug: 1 }, { unique: true });

  const sampleCourses = [
    {
      slug: "preparing-print-ready-artwork",
      title: "Preparing Print-Ready Artwork",
      type: "written" as const,
      summary: "The five things that make a file print cleanly the first time.",
      content:
        "Most print delays come from the same handful of file problems — here's how to avoid them.\n\nUse the right resolution. Anything printed at its final size should be at least 300dpi. A logo pulled from a website is usually 72dpi, which looks sharp on screen and blurry on paper.\n\nConvert text to outlines or embed your fonts. If we don't have the font installed, your text can shift or fall back to a default typeface.\n\nWork in CMYK, not RGB, for anything full colour. Screens mix light (RGB); printers mix ink (CMYK). Colours can shift between the two, so proofing in CMYK avoids surprises.\n\nLeave bleed on anything that touches the edge of the page — 3mm is standard. Without it, trimming can leave a thin white edge.\n\nFlatten your file before sending it. Layered PSDs and files with live effects can render differently on our end than on yours.",
      coverImage: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=800&auto=format&fit=crop",
      published: true,
    },
    {
      slug: "choosing-the-right-material",
      title: "Choosing the Right Material for Outdoor Signage",
      type: "written" as const,
      summary: "PVC banner vs roll-up vs ACP signage — what holds up outdoors, and for how long.",
      content:
        "PVC banners are the cheapest and most flexible option — good for short campaigns (weeks to a few months), events, and anywhere you need to hang something quickly with eyelets or rope. They fade faster in direct sun than the alternatives.\n\nRoll-up (pull-up) banner stands are indoor-first. The stand and print are portable, so they're built for exhibitions, shop entrances, and anywhere you need to set up and pack away the same day — not for permanent outdoor use.\n\nACP (aluminium composite panel) and acrylic signage are the long-term option. They're rigid, weatherproof, and hold colour for years, which is why they're what we use for shopfront signage — but they need to be measured and installed on site, so they're quoted per job rather than sold as a fixed-price product.\n\nAs a rule of thumb: PVC for weeks, roll-up for indoors and travel, ACP or acrylic for anything meant to stay up year-round.",
      coverImage: "https://images.unsplash.com/photo-1544059799-1e84c415f2d6?q=80&w=800&auto=format&fit=crop",
      published: true,
    },
  ];

  let coursesInserted = 0;
  for (const course of sampleCourses) {
    const exists = await courses.findOne({ slug: course.slug });
    if (exists) continue;
    const now = new Date();
    await courses.insertOne({ _id: crypto.randomUUID(), ...course, createdAt: now, updatedAt: now });
    coursesInserted += 1;
  }
  console.log(`Courses: ${coursesInserted} inserted, ${sampleCourses.length - coursesInserted} already present.`);

  await client.close();
  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
