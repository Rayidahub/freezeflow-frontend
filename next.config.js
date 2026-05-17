/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better DX
  reactStrictMode: true,

  // Images from external sources (add domains as needed)
  images: {
    domains: [],
  },
};

module.exports = nextConfig;
