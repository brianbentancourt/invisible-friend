import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });

export async function POST(request) {
    try {
        const { userEmail } = await request.json();

        if (!userEmail) {
            return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
        }

        const preference = new Preference(client);
        
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');

        const body = {
            items: [
                {
                    id: 'premium_plan',
                    title: 'Plan Premium - Amigo Invisible',
                    quantity: 1,
                    unit_price: 300, // Precio de ejemplo en moneda local, ajustable.
                    currency_id: 'UYU', // Ajustar según el país de MercadoPago
                }
            ],
            payer: {
                email: userEmail,
            },
            back_urls: {
                success: `${baseUrl}/dashboard?payment=success`,
                failure: `${baseUrl}/dashboard?payment=failure`,
                pending: `${baseUrl}/dashboard?payment=pending`,
            },
            auto_return: 'approved',
            metadata: {
                user_email: userEmail
            }
        };

        const response = await preference.create({ body });

        return NextResponse.json({ url: response.init_point });
    } catch (error) {
        console.error('Error creating MP preference:', error);
        return NextResponse.json({ error: 'Error al iniciar pago' }, { status: 500 });
    }
}
