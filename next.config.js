/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/index-landing.html",
      },
    ];
  },
};
module.exports = nextConfig;
