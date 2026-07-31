import { DEFAULT_PAYMENT_PROVIDER, PAYPAL_ENABLED } from '@/config/site';

/**
 * Zonas horarias de los países donde MercadoPago es el medio de pago habitual.
 * Para el resto del mundo arrancamos con PayPal seleccionado: un usuario en
 * España o EE.UU. no reconoce MercadoPago y el precio en UYU lo desconcierta.
 * Es sólo el valor inicial del selector, siempre se puede cambiar a mano.
 */
const MERCADOPAGO_TIMEZONES = new Set([
    // Uruguay
    'America/Montevideo',
    // Argentina
    'America/Buenos_Aires',
    'America/Cordoba',
    'America/Mendoza',
    'America/Argentina/Buenos_Aires',
    'America/Argentina/Catamarca',
    'America/Argentina/Cordoba',
    'America/Argentina/Jujuy',
    'America/Argentina/La_Rioja',
    'America/Argentina/Mendoza',
    'America/Argentina/Rio_Gallegos',
    'America/Argentina/Salta',
    'America/Argentina/San_Juan',
    'America/Argentina/San_Luis',
    'America/Argentina/Tucuman',
    'America/Argentina/Ushuaia',
    // Brasil
    'America/Sao_Paulo',
    'America/Araguaina',
    'America/Bahia',
    'America/Belem',
    'America/Boa_Vista',
    'America/Campo_Grande',
    'America/Cuiaba',
    'America/Eirunepe',
    'America/Fortaleza',
    'America/Maceio',
    'America/Manaus',
    'America/Noronha',
    'America/Porto_Velho',
    'America/Recife',
    'America/Rio_Branco',
    'America/Santarem',
    // Chile
    'America/Santiago',
    'America/Punta_Arenas',
    'Pacific/Easter',
    // Colombia
    'America/Bogota',
    // México
    'America/Mexico_City',
    'America/Bahia_Banderas',
    'America/Cancun',
    'America/Chihuahua',
    'America/Hermosillo',
    'America/Matamoros',
    'America/Mazatlan',
    'America/Merida',
    'America/Monterrey',
    'America/Ojinaga',
    'America/Tijuana',
    // Perú
    'America/Lima',
]);

/** Proveedor sugerido según dónde está el usuario. Sólo se usa en el cliente. */
export function suggestedProvider() {
    if (!PAYPAL_ENABLED) return DEFAULT_PAYMENT_PROVIDER;

    try {
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return MERCADOPAGO_TIMEZONES.has(timeZone) ? 'mercadopago' : 'paypal';
    } catch {
        return DEFAULT_PAYMENT_PROVIDER;
    }
}
