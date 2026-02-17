import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove output: "standalone"
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["@prisma/client", "prisma"],
  },
};

export default nextConfig;
