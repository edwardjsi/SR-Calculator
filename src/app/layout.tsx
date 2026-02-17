import type { Metadata } from "next";
import "./globals.css";
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
