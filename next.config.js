/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "via.placeholder.com", // Add the domain for external images
      "images.pexels.com", // Add images.pexels.com for external image support
      "placehold.co", // Add placehold.co for external image support
      "www.pexels.com", // Add www.pexels.com for external image support
    ],
  },
};

module.exports = nextConfig;