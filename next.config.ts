import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
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
