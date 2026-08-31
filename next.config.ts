import type { NextConfig } from 'next';

const configuredBasePath = process.env.SITE_BASE_PATH?.trim() || '';
const basePath = configuredBasePath
  ? `/${configuredBasePath.replace(/^\/+|\/+$/g, '')}`
  : '';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: false,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
