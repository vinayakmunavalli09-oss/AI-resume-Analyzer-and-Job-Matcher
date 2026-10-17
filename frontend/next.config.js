/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allows CI/sandbox builds to use an isolated output directory.
  distDir: process.env.NEXT_BUILD_DIR || '.next',
  images: {
    domains: [],
  },
}

module.exports = nextConfig
