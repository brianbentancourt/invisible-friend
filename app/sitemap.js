import { SITE_URL, LOCALES, HREFLANG } from '@/config/site';
import { getAllPages, getAlternateSlugs } from '@/lib/content';

/**
 * El sitemap tenía 4 URLs (dos de ellas de login). Ahora incluye las home de
 * cada idioma y todas las páginas de contenido con sus alternates hreflang.
 */
export default function sitemap() {
    const now = new Date();

    const homes = LOCALES.map((locale) => ({
        url: `${SITE_URL}/${locale}`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 1,
        alternates: {
            languages: LOCALES.reduce((acc, alt) => {
                acc[HREFLANG[alt]] = `${SITE_URL}/${alt}`;
                return acc;
            }, {}),
        },
    }));

    const contentPages = getAllPages().map((page) => ({
        url: `${SITE_URL}/${page.locale}/${page.slug}`,
        lastModified: now,
        changeFrequency: page.changeFrequency || 'monthly',
        priority: page.priority ?? 0.6,
        alternates: {
            languages: Object.entries(getAlternateSlugs(page.key)).reduce((acc, [loc, slug]) => {
                acc[HREFLANG[loc]] = `${SITE_URL}/${loc}/${slug}`;
                return acc;
            }, {}),
        },
    }));

    return [...homes, ...contentPages];
}
