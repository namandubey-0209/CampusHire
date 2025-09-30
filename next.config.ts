import type { NextConfig } from "next";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns', 'lodash'],
    serverExternalPackages: ['bcryptjs', 'formidable']
  }
}

module.exports = withBundleAnalyzer(nextConfig)

export default nextConfig;
