import type { Metadata } from "next";
import {
  Fraunces,
  IBM_Plex_Mono,
  Lora,
  Plus_Jakarta_Sans,
} from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const lora = Lora({
  variable: "--font-subtitle",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"],
});

const ibmPlexMono = IBM_Plex_Mono({
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
        className={`${plusJakarta.variable} ${fraunces.variable} ${lora.variable} ${ibmPlexMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
