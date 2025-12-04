import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@sparticuz/chromium-min", "puppeteer-core"],
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
