import { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      '@tanstack/react-query': './node_modules/@tanstack/react-query',
    },
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = ['@tanstack/react-query', ...config.externals];
    }
    config.resolve.alias['@tanstack/react-query'] = path.resolve(
      './node_modules/@tanstack/react-query',
    );

    return config;
  },
};

export default nextConfig;
