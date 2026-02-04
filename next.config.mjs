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
      },
      {
        source: '/payflow-an-exploration-of-agentic-commerce',
        destination: '/payflow',
        permanent: true,
      },
      {
        source:
          '/exploring-verifiable-continuous-sequencing-with-delay-functions',
        destination: '/verifiable-continuous-sequencing-with-delay-functions',
        permanent: true,
      },
      {
        source: '/flowproxy-optimality',
        destination: '/flowproxy-approaching-optimality',
        permanent: false,
      },
    ];
  },
};

export default withMDX(config);
