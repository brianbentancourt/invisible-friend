import { SITE_URL, SITE_NAME, AUTHOR, PLANS } from '@/config/site';

/** Ficha de la aplicación: alimenta el snippet enriquecido de la home. */
export function softwareApplicationSchema({ locale, name, description }) {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name,
        description,
        url: `${SITE_URL}/${locale}`,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web',
        inLanguage: locale,
        author: {
            '@type': 'Person',
            name: AUTHOR.name,
            url: AUTHOR.url,
        },
        offers: [
            {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
                description: 'Free plan up to 15 participants',
            },
            {
                '@type': 'Offer',
                price: String(PLANS.premium.price),
                priceCurrency: PLANS.premium.currency,
                description: 'Premium plan',
            },
        ],
    };
}

/** Preguntas frecuentes: puede mostrarse como acordeón en los resultados. */
export function faqSchema(faqs) {
    if (!faqs?.length) return null;

    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map(({ q, a }) => ({
            '@type': 'Question',
            name: q,
            acceptedAnswer: {
                '@type': 'Answer',
                text: a,
            },
        })),
    };
}

/** Migas de pan: mejoran cómo se ve la URL en el buscador. */
export function breadcrumbSchema(items) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

export function articleSchema({ locale, title, description, slug }) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description,
        inLanguage: locale,
        mainEntityOfPage: `${SITE_URL}/${locale}/${slug}`,
        author: {
            '@type': 'Person',
            name: AUTHOR.name,
            url: AUTHOR.url,
        },
        publisher: {
            '@type': 'Organization',
            name: SITE_NAME,
            url: SITE_URL,
        },
    };
}

export function organizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/icon.png`,
        founder: {
            '@type': 'Person',
            name: AUTHOR.name,
            url: AUTHOR.url,
        },
    };
}
