/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://ul0.site',
  generateRobotsTxt: true,
  generateIndexSitemap: true, // Enable index sitemap for better organization
  outDir: './public',
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/r/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
      },
      {
        userAgent: 'Slurp', // Yahoo
        allow: '/',
      },
      {
        userAgent: 'DuckDuckBot',
        allow: '/',
      },
      {
        userAgent: 'Baiduspider',
        allow: '/',
      },
      {
        userAgent: 'YandexBot',
        allow: '/',
      },
    ],
  },
  exclude: ['/api/*', '/r/*', '/fight', '/fight/*'],
  changefreq: 'daily',
  priority: 0.7,
  // Additional paths to include
  additionalPaths: async (config) => {
    const result = []
    
    // Add all blog posts with high priority
    const blogPosts = [
      '/blog/best-url-shorteners-2026',
      '/blog/bitly-alternative-free',
      '/blog/free-url-shortener-no-signup',
      '/blog/how-to-shorten-url-free',
      '/blog/tinyurl-alternative',
    ]
    
    for (const path of blogPosts) {
      result.push({
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      })
    }
    
    // Add language variants
    const languages = ['es', 'pt', 'hi', 'id', 'vi', 'th']
    for (const lang of languages) {
      result.push({
        loc: `/${lang}`,
        changefreq: 'weekly',
        priority: 0.9,
        lastmod: new Date().toISOString(),
        alternateRefs: [
          { href: 'https://ul0.site', hreflang: 'en' },
          { href: `https://ul0.site/${lang}`, hreflang: lang },
          { href: 'https://ul0.site', hreflang: 'x-default' },
        ],
      })
    }
    
    return result
  },
  transform: async (config, path) => {
    // Custom priority for important pages
    const priorities = {
      '/': 1.0,
      '/split': 0.95,
      '/qr': 0.95,
      '/compare': 0.95,
      '/wifi': 0.9,
      '/utm': 0.9,
      '/json': 0.9,
      '/pomodoro': 0.9,
      '/clock': 0.85,
      '/ambient': 0.85,
      '/countdown': 0.85,
      '/quotes': 0.85,
      '/worldclock': 0.85,
      '/about': 0.7,
      '/privacy': 0.5,
      '/terms': 0.5,
      '/contact': 0.6,
      '/faq': 0.8,
      '/blog': 0.85,
    }
    
    // Set higher changefreq for main tools
    const toolPages = ['/', '/split', '/qr', '/wifi', '/utm', '/json', '/pomodoro']
    const isToolPage = toolPages.includes(path)
    
    return {
      loc: path,
      changefreq: isToolPage ? 'daily' : 'weekly',
      priority: priorities[path] || 0.7,
      lastmod: new Date().toISOString(),
      // Add alternate language links for main page
      ...(path === '/' && {
        alternateRefs: [
          { href: 'https://ul0.site', hreflang: 'en' },
          { href: 'https://ul0.site/es', hreflang: 'es' },
          { href: 'https://ul0.site/pt', hreflang: 'pt' },
          { href: 'https://ul0.site/hi', hreflang: 'hi' },
          { href: 'https://ul0.site/id', hreflang: 'id' },
          { href: 'https://ul0.site/vi', hreflang: 'vi' },
          { href: 'https://ul0.site/th', hreflang: 'th' },
          { href: 'https://ul0.site', hreflang: 'x-default' },
        ],
      }),
    }
  },
}
