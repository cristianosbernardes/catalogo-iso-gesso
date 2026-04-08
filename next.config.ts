import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "*.r2.cloudflarestorage.com" },
      { hostname: "*.cloudflare.com" },
      { hostname: "localhost" },
    ],
  },
};

export default nextConfig;
