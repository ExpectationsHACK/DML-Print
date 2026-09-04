import { Manrope, JetBrains_Mono } from "next/font/google";

export const displayFont = Manrope({
  variable: "--font-display",
  weight: ["700", "800"],
  subsets: ["latin"],
  display: "swap",
});

export const bodyFont = Manrope({
  variable: "--font-body",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
});

export const monoFont = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});
