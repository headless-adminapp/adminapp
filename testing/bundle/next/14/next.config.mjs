import path from 'path';

const nextConfig = {
  /* config options here */
  experimental: {
    // serverComponentsExternalPackages: ['sequelize'],
    missingSuspenseWithCSRBailout: false,
  },
  eslint: {
    dirs: ['app'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = ['@tanstack/react-query', ...config.externals];
    }
    config.resolve.alias['@tanstack/react-query'] = path.resolve(
      './node_modules/@tanstack/react-query'
    );

    return config;
  },
};

export default nextConfig;
