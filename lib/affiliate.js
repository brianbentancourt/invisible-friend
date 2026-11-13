/**
 * Enlaces de búsqueda a tiendas con tag de afiliado.
 *
 * La página de revelación es, de lejos, la más visitada del sitio (una visita
 * por participante, no por organizador) y llega en el momento de máxima
 * intención de compra: es el mejor lugar del producto para monetizar.
 *
 * Regla: una tienda sólo se muestra si tiene tag de afiliado configurado Y
 * está disponible en el país del visitante. Si no queda ninguna, no se muestra
 * el bloque: un enlace sin comisión a una tienda que no opera en su país es
 * ruido para el usuario y cero ingreso para nosotros.
 *
 * Los tags son por marketplace, no globales: Amazon Associates es un programa
 * distinto en cada dominio (un tag de amazon.es no atribuye en amazon.com.br).
 */

// Las variables NEXT_PUBLIC_ se incrustan en build, así que hay que
// referenciarlas literalmente: no se puede acceder de forma dinámica.
const TAGS = {
    'amazon-es': process.env.NEXT_PUBLIC_AMAZON_TAG_ES,
    'amazon-com': process.env.NEXT_PUBLIC_AMAZON_TAG_COM,
    'amazon-br': process.env.NEXT_PUBLIC_AMAZON_TAG_BR,
    'amazon-mx': process.env.NEXT_PUBLIC_AMAZON_TAG_MX,
    'meli-uy': process.env.NEXT_PUBLIC_MELI_TAG_UY,
    'meli-ar': process.env.NEXT_PUBLIC_MELI_TAG_AR,
    'meli-br': process.env.NEXT_PUBLIC_MELI_TAG_BR,
    'meli-mx': process.env.NEXT_PUBLIC_MELI_TAG_MX,
    'meli-cl': process.env.NEXT_PUBLIC_MELI_TAG_CL,
};

const amazon = (name, host) => ({
    name,
    affiliateParam: 'tag',
    buildUrl: (query) => `${host}/s?k=${encodeURIComponent(query)}`,
});

// MercadoLibre busca por path normalizado
const meli = (name, host) => ({
    name,
    affiliateParam: 'matt_tool',
    buildUrl: (query) => {
        const clean = (query || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-');
        return `${host}/${clean || 'regalos'}`;
    },
});

const MARKETPLACES = {
    'amazon-es': amazon('Amazon', 'https://www.amazon.es'),
    'amazon-com': amazon('Amazon', 'https://www.amazon.com'),
    'amazon-br': amazon('Amazon', 'https://www.amazon.com.br'),
    'amazon-mx': amazon('Amazon', 'https://www.amazon.com.mx'),
    'meli-uy': meli('Mercado Libre', 'https://listado.mercadolibre.com.uy'),
    'meli-ar': meli('Mercado Libre', 'https://listado.mercadolibre.com.ar'),
    'meli-br': meli('Mercado Livre', 'https://lista.mercadolivre.com.br'),
    'meli-mx': meli('Mercado Libre', 'https://listado.mercadolibre.com.mx'),
    'meli-cl': meli('Mercado Libre', 'https://listado.mercadolibre.cl'),
};

/** Qué tiendas tienen sentido en cada país, por orden de preferencia local. */
const MARKETPLACES_BY_COUNTRY = {
    UY: ['meli-uy'],
    AR: ['meli-ar'],
    ES: ['amazon-es'],
    CL: ['meli-cl'],
    BR: ['meli-br', 'amazon-br'],
    MX: ['meli-mx', 'amazon-mx'],
    US: ['amazon-com'],
    CA: ['amazon-com'],
    GB: ['amazon-com'],
    PE: ['amazon-com'],
    CO: ['amazon-com'],
};

/** Si no sabemos el país, Uruguay es el mercado principal inicial para español. */
const FALLBACK_COUNTRY_BY_LOCALE = {
    es: 'UY',
    en: 'US',
    pt: 'BR',
};

/**
 * Tiendas mostrables para el visitante.
 * En Uruguay y Argentina mostramos Mercado Libre de forma prioritaria
 * para garantizar la mejor experiencia local de compra y entrega inmediata.
 */
export function getStores(locale, country) {
    const upperCountry = country ? country.toUpperCase() : null;
    const resolvedCountry =
        (upperCountry && MARKETPLACES_BY_COUNTRY[upperCountry] ? upperCountry : null) ||
        FALLBACK_COUNTRY_BY_LOCALE[locale] ||
        'UY';

    // Prioridad local para Uruguay y Argentina: Mercado Libre local
    if (resolvedCountry === 'UY' || resolvedCountry === 'AR') {
        const localMeliId = resolvedCountry === 'UY' ? 'meli-uy' : 'meli-ar';
        const stores = [{ id: localMeliId, ...MARKETPLACES[localMeliId] }];

        if (TAGS['amazon-com']) {
            stores.push({ id: 'amazon-com', ...MARKETPLACES['amazon-com'] });
        }
        return stores;
    }

    const preferredIds = MARKETPLACES_BY_COUNTRY[resolvedCountry] || [];

    // 1. Tiendas preferidas para este país que tengan tag configurado
    const matchedStores = preferredIds
        .filter((id) => Boolean(TAGS[id]))
        .map((id) => ({ id, ...MARKETPLACES[id] }));

    if (matchedStores.length > 0) {
        return matchedStores;
    }

    // 2. Fallback por idioma
    const fallbackPriorityByLocale = {
        es: ['meli-uy', 'amazon-es', 'amazon-mx', 'amazon-com'],
        en: ['amazon-com', 'amazon-es'],
        pt: ['amazon-br', 'meli-br', 'amazon-com'],
    };

    const fallbackIds = fallbackPriorityByLocale[locale] || ['meli-uy', 'amazon-es'];
    const fallbackStoreId = fallbackIds.find((id) => Boolean(TAGS[id]) || id === 'meli-uy');

    if (fallbackStoreId && MARKETPLACES[fallbackStoreId]) {
        return [{ id: fallbackStoreId, ...MARKETPLACES[fallbackStoreId] }];
    }

    return [{ id: 'meli-uy', ...MARKETPLACES['meli-uy'] }];
}

export function buildSearchUrl(store, query) {
    const url = store.buildUrl(query);
    const tag = TAGS[store.id];
    if (!tag) return url;

    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${store.affiliateParam}=${encodeURIComponent(tag)}`;
}

/** Categorías que se muestran en el bloque de ideas de regalo. */
export const GIFT_CATEGORIES = ['budget', 'tech', 'home', 'books', 'beauty', 'experiences'];
