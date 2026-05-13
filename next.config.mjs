/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', /* Permitimos cualquier host para probar */
      },
    ],
  },
};

export default nextConfig;
