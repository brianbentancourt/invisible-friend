/**
 * Configuración central del sitio.
 * Cualquier dato que se repita en metadatos, sitemap, checkout o emails vive acá.
 */

// Ojo: sin esta variable el checkout de MercadoPago apuntaba a localhost en producción.
// El fallback al dominio real evita que el pago se rompa si la env var falta en Vercel.
export const SITE_URL = (
    process.env.NEXT_PUBLIC_BASE_URL || 'https://amigoinvisible.brianbentancourt.com'
).replace(/\/$/, '');

export const SITE_NAME = 'Amigo Invisible';

export const LOCALES = ['es', 'en', 'pt'];
export const DEFAULT_LOCALE = 'es';

// Mapeo a los códigos que esperan Open Graph y hreflang.
export const OG_LOCALES = {
    es: 'es_ES',
    en: 'en_US',
    pt: 'pt_BR',
};

export const HREFLANG = {
    es: 'es',
    en: 'en',
    pt: 'pt-BR',
};

export const FREE_PARTICIPANT_LIMIT = 15;

/**
 * Planes. El precio se cobra en UYU porque la cuenta de MercadoPago es uruguaya
 * (acepta tarjetas internacionales igual), pero mostramos el equivalente en USD
 * para que el usuario de fuera de LatAm entienda qué está pagando.
 */
export const PLANS = {
    free: {
        id: 'free',
        price: 0,
        priceUsd: 0,
    },
    premium: {
        id: 'premium',
        price: 300,
        priceUsd: 8,
        currency: 'UYU',
    },
    business: {
        id: 'business',
        price: 900,
        priceUsd: 22,
        currency: 'UYU',
    },
};

export const PAID_PLANS = ['premium', 'business'];

export const DONATION_LINKS = {
    buymeacoffee: 'https://buymeacoffee.com/brianbent',
    paypal: 'https://www.paypal.com/donate/?hosted_button_id=LRFX7GE2YG3JU',
};

export const AUTHOR = {
    name: 'Brian Bentancourt',
    url: 'https://brianbentancourt.com',
};

export function localeFromParam(lang) {
    return LOCALES.includes(lang) ? lang : DEFAULT_LOCALE;
}
