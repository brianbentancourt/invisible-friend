export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/es/dashboard/', '/en/dashboard/', '/es/sorteo/', '/en/sorteo/'],
    },
    sitemap: 'https://tu-dominio.com/sitemap.xml',
  }
}
