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
    runtimeCaching: [
      {
        // Google Identity Services must never be cached — OAuth breaks on stale GIS scripts
        urlPattern: /^https:\/\/accounts\.google\.com\/.*/i,
        handler: "NetworkOnly"
      },
      {
        urlPattern: /^https:\/\/apis\.google\.com\/.*/i,
        handler: "NetworkOnly"
      },
      {
        urlPattern: /^https:\/\/.*\.(js|css|woff2|png|jpg|jpeg|gif|svg|ico)$/i,
        handler: "CacheFirst",
        options: {
          cacheName: "static-assets-v1",
          cacheableResponse: {
            statuses: [0, 200]
          },
          expiration: {
            maxEntries: 500,
            maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
          }
        }
      },
      {
        urlPattern: /^https:\/\/.*\/api\/.*/i,
        handler: "NetworkFirst",
        options: {
          cacheName: "api-cache-v1",
          cacheableResponse: {
            statuses: [0, 200]
          },
          networkTimeoutSeconds: 10,
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 5 // 5 minutes
          }
        }
      },
      {
        urlPattern: /^https:\/\/.*/i,
        handler: "StaleWhileRevalidate",
        options: {
          cacheName: "pages-cache-v1",
          cacheableResponse: {
            statuses: [0, 200]
          },
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 60 * 60 * 24 // 24 hours
          }
        }
      }
    ]
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