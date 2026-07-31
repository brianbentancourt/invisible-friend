import { pagesEs } from './es';
import { pagesEn } from './en';
import { pagesPt } from './pt';
import { LOCALES } from '@/config/site';

const byLocale = {
    es: pagesEs,
    en: pagesEn,
    pt: pagesPt,
};

/** Todas las páginas de contenido de un idioma. */
export function getPages(locale) {
    return byLocale[locale] || [];
}

/** Una página concreta por su slug traducido. */
export function getPage(locale, slug) {
    return getPages(locale).find((page) => page.slug === slug) || null;
}

/** Todas las páginas de todos los idiomas, para el sitemap. */
export function getAllPages() {
    return LOCALES.flatMap((locale) =>
        getPages(locale).map((page) => ({ ...page, locale }))
    );
}

/**
 * Mapa idioma -> slug para una misma página, con el que se construyen
 * los hreflang alternates de cada URL de contenido.
 */
export function getAlternateSlugs(key) {
    return LOCALES.reduce((acc, locale) => {
        const page = getPages(locale).find((p) => p.key === key);
        if (page) acc[locale] = page.slug;
        return acc;
    }, {});
}

/** Enlaces destacados por idioma para el menú y el pie de página. */
export function getNavLinks(locale) {
    const pages = getPages(locale);
    const find = (key) => pages.find((page) => page.key === key);

    return {
        pricing: find('pricing'),
        faq: find('faq'),
        generator: find('generator'),
        work: find('work'),
        giftIdeas: find('gift-ideas'),
        rules: find('rules'),
        privacy: find('privacy'),
        terms: find('terms'),
    };
}
