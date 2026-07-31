/**
 * Cliente mínimo de la API REST de PayPal (Orders v2).
 *
 * PayPal es el segundo medio de pago del sitio y existe por una razón concreta:
 * MercadoPago cobra en pesos uruguayos y fuera de LatAm mucha gente no lo
 * reconoce ni puede pagar cómodamente. PayPal cubre 200+ países, cobra en USD
 * y acepta tarjeta sin necesidad de tener cuenta PayPal.
 *
 * No usamos SDK: son cuatro llamadas HTTP y el paquete oficial arrastra
 * dependencias que no necesitamos en el runtime de Next.
 */

const LIVE_API = 'https://api-m.paypal.com';
const SANDBOX_API = 'https://api-m.sandbox.paypal.com';

/** `live` sólo si se pide explícitamente: equivocarse hacia sandbox no cobra de más. */
export function paypalApiBase() {
    return process.env.PAYPAL_ENV === 'live' ? LIVE_API : SANDBOX_API;
}

export function isPaypalConfigured() {
    return Boolean(
        (process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) &&
            process.env.PAYPAL_CLIENT_SECRET
    );
}

function credentials() {
    const clientId = process.env.PAYPAL_CLIENT_ID || process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !secret) {
        throw new Error('PayPal no está configurado (falta PAYPAL_CLIENT_ID o PAYPAL_CLIENT_SECRET)');
    }

    return Buffer.from(`${clientId}:${secret}`).toString('base64');
}

// El token dura ~9 horas; lo cacheamos en memoria para no pedir uno por request.
let cachedToken = null;

async function accessToken() {
    if (cachedToken && cachedToken.expiresAt > Date.now()) {
        return cachedToken.value;
    }

    const response = await fetch(`${paypalApiBase()}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${credentials()}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
        cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(`PayPal auth falló: ${data.error_description || response.status}`);
    }

    cachedToken = {
        value: data.access_token,
        // Margen de un minuto para no usar un token que expira en pleno checkout.
        expiresAt: Date.now() + (data.expires_in - 60) * 1000,
    };

    return cachedToken.value;
}

async function paypalFetch(path, { method = 'GET', body, headers = {} } = {}) {
    const token = await accessToken();

    const response = await fetch(`${paypalApiBase()}${path}`, {
        method,
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...headers,
        },
        body: body ? JSON.stringify(body) : undefined,
        cache: 'no-store',
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};

    return { ok: response.ok, status: response.status, data };
}

const PAYPAL_LOCALES = {
    es: 'es-ES',
    en: 'en-US',
    pt: 'pt-BR',
};

/**
 * Crea una orden de pago único y devuelve la URL a la que hay que mandar al
 * usuario. `customId` viaja en la orden y vuelve en la captura y en el webhook:
 * es lo que nos permite saber a quién activarle el plan.
 */
export async function createOrder({
    amountUsd,
    description,
    customId,
    returnUrl,
    cancelUrl,
    brandName,
    locale = 'es',
}) {
    const { ok, data } = await paypalFetch('/v2/checkout/orders', {
        method: 'POST',
        body: {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    description: description.slice(0, 127),
                    custom_id: customId.slice(0, 127),
                    amount: {
                        currency_code: 'USD',
                        value: Number(amountUsd).toFixed(2),
                    },
                },
            ],
            payment_source: {
                paypal: {
                    experience_context: {
                        brand_name: brandName,
                        locale: PAYPAL_LOCALES[locale] || PAYPAL_LOCALES.es,
                        // Es un producto digital: pedir dirección de envío sólo agrega fricción.
                        shipping_preference: 'NO_SHIPPING',
                        user_action: 'PAY_NOW',
                        return_url: returnUrl,
                        cancel_url: cancelUrl,
                    },
                },
            },
        },
    });

    if (!ok) {
        throw new Error(`PayPal no pudo crear la orden: ${JSON.stringify(data)}`);
    }

    // Con `payment_source.paypal` el link de aprobación se llama `payer-action`;
    // el nombre clásico (`approve`) sigue apareciendo en algunas respuestas.
    const link = data.links?.find((l) => l.rel === 'payer-action' || l.rel === 'approve');

    if (!link?.href) {
        throw new Error('PayPal no devolvió link de aprobación');
    }

    return { id: data.id, url: link.href };
}

export async function getOrder(orderId) {
    const { ok, data } = await paypalFetch(`/v2/checkout/orders/${orderId}`);
    return ok ? data : null;
}

/**
 * Captura el dinero de una orden aprobada. Si el usuario recarga la página de
 * retorno PayPal responde 422/ORDER_ALREADY_CAPTURED: en ese caso releemos la
 * orden y devolvemos su estado real en lugar de tratarlo como error.
 */
export async function captureOrder(orderId) {
    const { ok, status, data } = await paypalFetch(`/v2/checkout/orders/${orderId}/capture`, {
        method: 'POST',
        // Idempotencia del lado de PayPal por si el navegador reintenta.
        headers: { 'PayPal-Request-Id': `capture-${orderId}` },
    });

    if (ok) return data;

    const alreadyCaptured = data?.details?.some((d) => d.issue === 'ORDER_ALREADY_CAPTURED');
    if (status === 422 && alreadyCaptured) {
        const order = await getOrder(orderId);
        if (order) return order;
    }

    throw new Error(`PayPal no pudo capturar la orden ${orderId}: ${JSON.stringify(data)}`);
}

/**
 * Verifica la firma de un webhook contra la API de PayPal. Sin PAYPAL_WEBHOOK_ID
 * no hay nada contra qué validar: rechazamos, porque este endpoint otorga planes
 * pagos y aceptar notificaciones sin verificar lo haría falsificable.
 */
export async function verifyWebhookSignature(headers, event) {
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;
    if (!webhookId) {
        console.warn('PAYPAL_WEBHOOK_ID no configurado: se rechazan las notificaciones de PayPal.');
        return false;
    }

    const required = {
        transmission_id: headers.get('paypal-transmission-id'),
        transmission_time: headers.get('paypal-transmission-time'),
        cert_url: headers.get('paypal-cert-url'),
        auth_algo: headers.get('paypal-auth-algo'),
        transmission_sig: headers.get('paypal-transmission-sig'),
    };

    if (Object.values(required).some((value) => !value)) return false;

    const { ok, data } = await paypalFetch('/v1/notifications/verify-webhook-signature', {
        method: 'POST',
        body: { ...required, webhook_id: webhookId, webhook_event: event },
    });

    return ok && data.verification_status === 'SUCCESS';
}

/** Formato `plan:locale:email`, igual que el external_reference de MercadoPago. */
export function buildCustomId({ plan, locale, userEmail }) {
    return `${plan}:${locale}:${userEmail}`;
}

export function parseCustomId(customId) {
    if (!customId) return null;

    const [plan, locale, ...rest] = String(customId).split(':');
    const userEmail = rest.join(':');

    if (!plan || !userEmail) return null;

    return { plan, locale: locale || 'es', userEmail };
}
