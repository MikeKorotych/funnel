import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Break Free — Your Journey to Digital Freedom",
  description:
    "Discover your digital habits and get a personalized plan to reclaim your time, focus, and life from screen addiction.",
  openGraph: {
    title: "Break Free — Your Journey to Digital Freedom",
    description:
      "Take the quiz and get your personalized digital detox plan.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-dvh flex flex-col antialiased">{children}</body>
    </html>
  );
}
