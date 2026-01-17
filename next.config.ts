import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images : {
    remotePatterns : [{protocol : 'https', hostname : '*'}]
  },
  // Enable compression for better performance
  compress: true,
  // Generate standalone output for better deployment
  // output: 'standalone', // Uncomment for Docker/containerized deployments
  // Optimize for SEO
  generateEtags: true,
  // Enable trailing slash for consistent URLs
  // trailingSlash: false,
  // Add security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
    ];
  },
};

export default nextConfig;
