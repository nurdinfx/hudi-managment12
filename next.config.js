/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', 'images.unsplash.com', 'via.placeholder.com'],
  },
  // Disable experimental features that cause memory issues
  experimental: {
    optimizeCss: false,
    workerThreads: false,
  },
  // Basic optimizations
  swcMinify: true,
  poweredByHeader: false,
  // Disable webpack cache in development to prevent memory issues
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

module.exports = nextConfig; 