export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/es/dashboard/', '/en/dashboard/', '/es/sorteo/', '/en/sorteo/'],
    },
    sitemap: 'https://amigoinvisible.brianbentancourt.com/sitemap.xml',
  }
}
