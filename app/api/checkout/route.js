import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import {
    SITE_URL,
    SITE_NAME,
    PLANS,
    PAID_PLANS,
    PAYMENT_PROVIDERS,
    DEFAULT_PAYMENT_PROVIDER,
    localeFromParam,
} from '@/config/site';
import { createOrder, buildCustomId, isPaypalConfigured } from '@/lib/paypal';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });

const PLAN_TITLES = {
    premium: {
        es: 'Plan Premium - Amigo Invisible',
        en: 'Premium Plan - Secret Santa',
        pt: 'Plano Premium - Amigo Oculto',
    },
    business: {
        es: 'Plan Empresas - Amigo Invisible',
        en: 'Business Plan - Secret Santa',
        pt: 'Plano Empresas - Amigo Oculto',
    },
};

function planTitle(plan, locale) {
    return PLAN_TITLES[plan][locale] || PLAN_TITLES[plan].es;
}

async function mercadoPagoCheckout({ plan, locale, userEmail }) {
    const selectedPlan = PLANS[plan];
    const preference = new Preference(client);

    // Las back_urls tienen que ser absolutas y públicas: con auto_return activo
    // MercadoPago rechaza la preferencia si apuntan a localhost.
    const dashboardUrl = `${SITE_URL}/${locale}/dashboard`;

    const body = {
        items: [
            {
                id: `${plan}_plan`,
                title: planTitle(plan, locale),
                quantity: 1,
                unit_price: selectedPlan.price,
                currency_id: selectedPlan.currency,
            },
        ],
        payer: {
            email: userEmail,
        },
        back_urls: {
            success: `${dashboardUrl}?payment=success`,
            failure: `${dashboardUrl}?payment=failure`,
            pending: `${dashboardUrl}?payment=pending`,
        },
        auto_return: 'approved',
        notification_url: `${SITE_URL}/api/webhooks/mercadopago`,
        statement_descriptor: 'AMIGOINVISIBLE',
        // El webhook lee estos datos para activar el plan correcto.
        metadata: {
            user_email: userEmail,
            plan,
            locale,
        },
        external_reference: `${plan}:${userEmail}`,
    };

    const response = await preference.create({ body });

    return response.init_point;
}

async function paypalCheckout({ plan, locale, userEmail }) {
    const dashboardUrl = `${SITE_URL}/${locale}/dashboard`;

    const order = await createOrder({
        amountUsd: PLANS[plan].priceUsd,
        description: planTitle(plan, locale),
        customId: buildCustomId({ plan, locale, userEmail }),
        // PayPal vuelve al sitio con ?token=<orderId>; ahí capturamos el pago.
        returnUrl: `${SITE_URL}/api/payments/paypal/capture?lang=${locale}`,
        cancelUrl: `${dashboardUrl}?payment=failure`,
        brandName: SITE_NAME,
        locale,
    });

    return order.url;
}

export async function POST(request) {
    try {
        const {
            userEmail,
            plan = 'premium',
            lang,
            provider = DEFAULT_PAYMENT_PROVIDER,
        } = await request.json();

        if (!userEmail) {
            return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
        }

        if (!PAID_PLANS.includes(plan)) {
            return NextResponse.json({ error: 'Plan inválido' }, { status: 400 });
        }

        if (!PAYMENT_PROVIDERS[provider]) {
            return NextResponse.json({ error: 'Medio de pago inválido' }, { status: 400 });
        }

        if (provider === 'paypal' && !isPaypalConfigured()) {
            return NextResponse.json({ error: 'PayPal no está disponible' }, { status: 503 });
        }

        const locale = localeFromParam(lang);
        const url =
            provider === 'paypal'
                ? await paypalCheckout({ plan, locale, userEmail })
                : await mercadoPagoCheckout({ plan, locale, userEmail });

        return NextResponse.json({ url, provider });
    } catch (error) {
        console.error('Error creando el checkout:', error);
        return NextResponse.json({ error: 'Error al iniciar pago' }, { status: 500 });
    }
}
