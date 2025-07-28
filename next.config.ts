import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "m.media-amazon.com",
      // add other domains as needed
    ],
  },
  // Remove standalone output for Vercel deployment
  experimental: {
    esmExternals: 'loose'
  }
};

export default nextConfig;
