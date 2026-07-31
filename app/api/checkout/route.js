import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { SITE_URL, PLANS, PAID_PLANS, localeFromParam } from '@/config/site';

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

export async function POST(request) {
    try {
        const { userEmail, plan = 'premium', lang } = await request.json();

        if (!userEmail) {
            return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
        }

        if (!PAID_PLANS.includes(plan)) {
            return NextResponse.json({ error: 'Plan inválido' }, { status: 400 });
        }

        const locale = localeFromParam(lang);
        const selectedPlan = PLANS[plan];
        const preference = new Preference(client);

        // Las back_urls tienen que ser absolutas y públicas: con auto_return activo
        // MercadoPago rechaza la preferencia si apuntan a localhost.
        const dashboardUrl = `${SITE_URL}/${locale}/dashboard`;

        const body = {
            items: [
                {
                    id: `${plan}_plan`,
                    title: PLAN_TITLES[plan][locale] || PLAN_TITLES[plan].es,
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

        return NextResponse.json({ url: response.init_point });
    } catch (error) {
        console.error('Error creating MP preference:', error);
        return NextResponse.json({ error: 'Error al iniciar pago' }, { status: 500 });
    }
}
