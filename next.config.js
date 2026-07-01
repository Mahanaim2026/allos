/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // TODO: Fix remaining strict TS errors, then set to false
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};
module.exports = nextConfig;
