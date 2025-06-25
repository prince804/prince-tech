/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/go/:slug',
        destination: '/dashboard/:slug',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
