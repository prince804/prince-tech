/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/go',
        has: [
          {
            type: 'query',
            key: 'utm_campaign',
          },
        ],
        destination: '/dashboard/:utm_campaign',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
