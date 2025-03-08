/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  eslint: {
    dirs: ['pages', 'app', 'components', 'entity'],
  },
};

module.exports = nextConfig;
