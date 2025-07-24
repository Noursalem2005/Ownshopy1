import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "m.media-amazon.com",
      // add other domains as needed
    ],
  },
  // Disable static optimization for dynamic pages
  output: 'standalone',
};

export default nextConfig;
