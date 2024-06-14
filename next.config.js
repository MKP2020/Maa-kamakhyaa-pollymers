// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    // Important: return the modified config
    if (isServer) {
      config.externals = ["@sparticuz/chromium", ...config.externals];
    }
    return config;
  },
};

module.exports = nextConfig;
