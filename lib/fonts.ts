import { Plus_Jakarta_Sans, Inter, JetBrains_Mono } from "next/font/google";

export const displayFont = Plus_Jakarta_Sans({
  variable: "--font-display",
  weight: ["700", "800"],
  subsets: ["latin"],
  display: "swap",
});

export const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

export const monoFont = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});
