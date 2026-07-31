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

// MercadoLibre busca por path, no por query string.
const meli = (name, host) => ({
    name,
    affiliateParam: 'matt_tool',
    buildUrl: (query) => `${host}/${encodeURIComponent(query).replace(/%20/g, '-')}`,
});

const MARKETPLACES = {
    'amazon-es': amazon('Amazon', 'https://www.amazon.es'),
    'amazon-com': amazon('Amazon', 'https://www.amazon.com'),
    'amazon-br': amazon('Amazon', 'https://www.amazon.com.br'),
    'amazon-mx': amazon('Amazon', 'https://www.amazon.com.mx'),
    'meli-uy': meli('MercadoLibre', 'https://listado.mercadolibre.com.uy'),
    'meli-ar': meli('MercadoLibre', 'https://listado.mercadolibre.com.ar'),
    'meli-br': meli('Mercado Livre', 'https://lista.mercadolivre.com.br'),
    'meli-mx': meli('MercadoLibre', 'https://listado.mercadolibre.com.mx'),
    'meli-cl': meli('MercadoLibre', 'https://listado.mercadolibre.cl'),
};

/** Qué tiendas tienen sentido en cada país, por orden de preferencia local. */
const MARKETPLACES_BY_COUNTRY = {
    ES: ['amazon-es'],
    UY: ['meli-uy'],
    AR: ['meli-ar'],
    CL: ['meli-cl'],
    BR: ['meli-br', 'amazon-br'],
    MX: ['meli-mx', 'amazon-mx'],
    US: ['amazon-com'],
    CA: ['amazon-com'],
    GB: ['amazon-com'],
    PE: ['amazon-com'],
    CO: ['amazon-com'],
};

/** Si no sabemos el país (dev local u otro hosting), tiramos por idioma. */
const FALLBACK_COUNTRY_BY_LOCALE = {
    es: 'ES',
    en: 'US',
    pt: 'BR',
};

/**
 * Tiendas mostrables: disponibles en el país y con tag configurado.
 * Devuelve un array vacío cuando no hay ninguna, y en ese caso el bloque
 * de ideas de regalo no se renderiza.
 */
export function getStores(locale, country) {
    const resolvedCountry =
        (country && MARKETPLACES_BY_COUNTRY[country.toUpperCase()] ? country.toUpperCase() : null) ||
        FALLBACK_COUNTRY_BY_LOCALE[locale] ||
        'ES';

    const ids = MARKETPLACES_BY_COUNTRY[resolvedCountry] || [];

    return ids
        .filter((id) => Boolean(TAGS[id]))
        .map((id) => ({ id, ...MARKETPLACES[id] }));
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
