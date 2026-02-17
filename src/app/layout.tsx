import type { Metadata } from "next";
import "./globals.css";
// Force API routes to be included in build
import '../lib/route-manifest'

export const metadata: Metadata = {
  title: "Sovereign Retirement Calculator",
  description: "Calculate your retirement savings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SR Calculator - Retirement Projection Engine",
  description: "Plan your retirement with accurate SIP projections using our two-phase calculation model. Built with Next.js, TypeScript, and AWS.",
  keywords: ["Retirement Calculator", "SIP Calculator", "Investment", "Financial Planning", "Next.js", "TypeScript"],
  authors: [{ name: "Edward Santosh" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "SR Calculator",
    description: "Retirement Projection Engine - Plan your financial future",
    url: "https://github.com/edwardjsi/SR-Calculator",
    siteName: "SR Calculator",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
