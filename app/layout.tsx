import type { Metadata } from "next";
import { DM_Serif_Display, Inter, JetBrains_Mono, Newsreader } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

/** Editorial serif for hero subcopy — distinct from Inter headlines */
const newsreader = Newsreader({
  variable: "--font-subtitle",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: "400",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "AyurGuard — Ayurvedic Research Plagiarism Detector",
  description:
    "Domain-aware originality screening for Ayurvedic manuscripts: Sanskrit terms, formulations, Shlokas, and semantic similarity.",
  keywords: [
    "Ayurveda",
    "plagiarism detection",
    "research integrity",
    "Ayurvedic manuscripts",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${newsreader.variable} ${dmSerifDisplay.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
