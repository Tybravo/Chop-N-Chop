import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
    // Prevents the service worker from caching admin and vendor routes
    exclude: [
      /\/admin\/.*$/i,
      /\/vendor\/.*$/i
    ],
  },
});

const nextConfig: NextConfig = {
  devIndicators: false,
  turbopack: {},
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

// Wrap your existing config with the PWA configuration
export default withPWA(nextConfig);