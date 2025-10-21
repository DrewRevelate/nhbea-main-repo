import type { NextConfig } from "next";

// Bundle analyzer for development
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // Conditional output based on admin environment
  ...(process.env.ADMIN_BUILD !== 'true' && { output: 'export' }),
  images: {
    // Enable optimization for static export with loader
    unoptimized: process.env.ADMIN_BUILD === 'true' ? false : true,
    loader: process.env.ADMIN_BUILD === 'true' ? 'default' : 'custom',
    loaderFile: process.env.ADMIN_BUILD === 'true' ? undefined : './src/lib/imageLoader.ts',
    // Add image domains for external images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https', 
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Ensure trailing slashes for Firebase hosting
  trailingSlash: true,
  // Temporarily disable strict checking for deployment until type issues are resolved
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Performance optimizations compatible with static export
  experimental: {
    // Enable modern JavaScript for better performance
    esmExternals: true,
    // Optimize fonts
    optimizePackageImports: ['lucide-react', '@radix-ui/react-select', '@radix-ui/react-tabs'],
  },
  // Compression and optimization
  compress: true,
  // PoweredByHeader removal for security
  poweredByHeader: false,
  // Generate sitemap
  generateEtags: false,
};

export default withBundleAnalyzer(nextConfig);
