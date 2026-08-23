/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/blog/best-url-shorteners-2025',
        destination: '/blog/best-url-shorteners-2026',
        permanent: true,
      },
      {
        source: '/compare/ul0-vs-goo-gl',
        destination: '/blog/best-url-shorteners-2026',
        permanent: true,
      },
      {
        source: '/compare/ul0-vs-bitly',
        destination: '/blog/bitly-alternative-free',
        permanent: true,
      },
      {
        source: '/compare/:path*',
        destination: '/blog',
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/1b98f244195a4bb896890d3bb639f7ee.txt',
        destination: '/api/indexnow-key',
      },
    ]
  },
}

export default nextConfig
