/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = withBundleAnalyzer({
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  eslint: {
    dirs: ['pages', 'app', 'components', 'entity'],
  },
});

module.exports = nextConfig;
