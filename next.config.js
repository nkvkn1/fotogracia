/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
    // Derivative URLs carry a ?v=<hash> cache-busting query (see lib/images.js).
    // next/image rejects query strings on local images unless the pattern is
    // declared; required from Next 16, warned about before that.
    localPatterns: [{ pathname: '/images/processed/**', search: '' }],
    // Derivatives are pre-sized and pre-compressed offline by
    // `npm run publish-images`, so routing them through /_next/image at request
    // time would re-encode work that is already done. See lib/images.js.
    unoptimized: true,
  },

  async headers() {
    return [
      {
        // Compiled derivatives never change in place: lib/images.js appends a
        // ?v= content version to every URL, so a replaced photograph is a new
        // URL rather than the same one with new bytes. That makes a one-year
        // immutable cache safe.
        source: '/images/processed/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
