/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa");
const defaultRuntimeCaching = require("next-pwa/cache");

const nextConfig = {
  reactStrictMode: false,
};

module.exports = withPWA({
  dest: "public",
  runtimeCaching: [
    {
      urlPattern: "https://*/**/*.woff2",
      method: "GET",
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "fonts",
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 24 * 60 * 60 * 30 * 365, // 1 Years
        },
      },
    },
    ...defaultRuntimeCaching,
  ],
})(nextConfig);
