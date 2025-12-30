import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'unavatar.io',
      },
    ],
  },

  // Redirects for the old blog posts
  async redirects() {
    return [
      {
        source: '/blob-propagation-with-peerdas',
        destination: '/peerdas-propagation',
        permanent: true,
      }
    ]
  }
};

export default withMDX(config);
