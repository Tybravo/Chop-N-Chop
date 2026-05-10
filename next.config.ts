import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            // Allows Vercel to render the preview iframe on the dashboard
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
          {
            // Explicitly whitelist Vercel domains for embedding
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://vercel.com https://*.vercel.app;",
          }
        ],
      },
    ];
  },
};

export default nextConfig;
