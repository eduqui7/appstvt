import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['www.instagram.com'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' instagram.com *.instagram.com",
          },
        ],
      },
    ]
  }
};

export default nextConfig;
