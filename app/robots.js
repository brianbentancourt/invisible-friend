import { SITE_URL, LOCALES } from '@/config/site';

export default function robots() {
    // Los enlaces de revelación y el panel no deben indexarse: son privados
    // y además generarían miles de URLs sin valor de búsqueda.
    const privatePaths = LOCALES.flatMap((locale) => [
        `/${locale}/dashboard`,
        `/${locale}/sorteo/`,
        `/${locale}/auth/`,
    ]);

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [...privatePaths, '/api/'],
        },
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}
