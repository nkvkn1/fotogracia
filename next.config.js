/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
    dangerouslyAllowSVG: true,
    // Let Next.js handle image optimisation (served via /_next/image on the Node.js server)
    unoptimized: false,
  },
};

module.exports = nextConfig;
