import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "*.r2.cloudflarestorage.com" },
      { hostname: "*.cloudflare.com" },
      { hostname: "*.workers.dev" },
      { hostname: "localhost" },
    ],
  },
};

export default nextConfig;
