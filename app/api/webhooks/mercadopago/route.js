import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { activatePaidPlan } from '@/lib/plans';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });

/**
 * Valida la firma del webhook (header x-signature) según el esquema de MercadoPago:
 * el manifest es `id:<data.id>;request-id:<x-request-id>;ts:<ts>;` firmado con HMAC-SHA256.
 * Si MP_WEBHOOK_SECRET no está configurado dejamos pasar la notificación para no
 * romper la activación, pero lo avisamos en los logs.
 */
function isValidSignature(request, bodyDataId) {
    const secret = process.env.MP_WEBHOOK_SECRET;
    if (!secret) {
        console.warn('MP_WEBHOOK_SECRET no configurado: el webhook acepta notificaciones sin verificar.');
        return true;
    }

    const signature = request.headers.get('x-signature');
    const requestId = request.headers.get('x-request-id');
    if (!signature) return false;

    const parts = Object.fromEntries(
        signature.split(',').map((part) => {
            const [key, value] = part.split('=');
            return [key?.trim(), value?.trim()];
        })
    );

    const ts = parts.ts;
    const hash = parts.v1;
    if (!ts || !hash) return false;

    // MercadoPago firma el `data.id` de la query string, no el del cuerpo, y
    // espera minúsculas si el id es alfanumérico.
    const queryDataId = new URL(request.url).searchParams.get('data.id');
    const dataId = String(queryDataId ?? bodyDataId ?? '').toLowerCase();
    if (!dataId) return false;

    // Los campos ausentes se omiten del manifest en lugar de mandarse vacíos.
    const manifest =
        `id:${dataId};` +
        (requestId ? `request-id:${requestId};` : '') +
        `ts:${ts};`;

    const computed = crypto.createHmac('sha256', secret).update(manifest).digest('hex');

    try {
        return crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(hash));
    } catch {
        return false;
    }
}

export async function POST(request) {
    try {
        const body = await request.json();

        // Verificar si es una notificación de pago
        if (body.type === 'payment' && body.data?.id) {
            const paymentId = body.data.id;

            if (!isValidSignature(request, paymentId)) {
                console.warn('Webhook de MercadoPago con firma inválida. Ignorado.');
                return NextResponse.json({ error: 'Firma inválida' }, { status: 401 });
            }

            const payment = new Payment(client);

            // Obtener el pago completo
            const paymentInfo = await payment.get({ id: paymentId });

            if (paymentInfo.status === 'approved') {
                await activatePaidPlan({
                    userEmail: paymentInfo.metadata?.user_email,
                    plan: paymentInfo.metadata?.plan || 'premium',
                    paymentId,
                    provider: 'mercadopago',
                });
            }
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Error procesando webhook de MP:', error);
        return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
    }
}
