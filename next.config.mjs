/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify: false,
    eslint: {
      ignoreDuringBuilds: true,
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**', // This allows images from any domain
        },
      ],
    },
  };
  
  export default nextConfig;
  