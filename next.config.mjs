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
      {
        source: '/free-url-shortener',
        destination: '/',
        permanent: true,
      },
      {
        source: '/qr-code-generator',
        destination: '/qr',
        permanent: true,
      },
      {
        source: '/utm-builder',
        destination: '/utm',
        permanent: true,
      },
      {
        source: '/wifi-qr-code-generator',
        destination: '/wifi',
        permanent: true,
      },
      {
        source: '/link-tracker',
        destination: '/',
        permanent: true,
      },
      {
        source: '/link-in-bio',
        destination: '/',
        permanent: true,
      },
      {
        source: '/url-expander',
        destination: '/',
        permanent: true,
      },
      {
        source: '/qr-code-for-business',
        destination: '/qr',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
