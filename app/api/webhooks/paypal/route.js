import { NextResponse } from 'next/server';
import { verifyWebhookSignature, parseCustomId } from '@/lib/paypal';
import { activatePaidPlan } from '@/lib/plans';

/**
 * Webhook de PayPal. Es la red de seguridad del flujo: si el usuario cierra el
 * navegador antes de volver al sitio, la activación igual ocurre acá.
 * Suscribir el evento PAYMENT.CAPTURE.COMPLETED en el panel de PayPal.
 */
export async function POST(request) {
    try {
        const event = await request.json();

        const verified = await verifyWebhookSignature(request.headers, event);
        if (!verified) {
            console.warn('Webhook de PayPal con firma inválida. Ignorado.');
            return NextResponse.json({ error: 'Firma inválida' }, { status: 401 });
        }

        if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
            const resource = event.resource || {};
            const metadata = parseCustomId(resource.custom_id);

            if (metadata) {
                // activatePaidPlan es idempotente: que el retorno ya haya
                // activado el plan no es un problema.
                await activatePaidPlan({
                    userEmail: metadata.userEmail,
                    plan: metadata.plan,
                    paymentId: resource.id,
                    provider: 'paypal',
                });
            } else {
                console.warn('Captura de PayPal sin custom_id reconocible:', resource.id);
            }
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Error procesando webhook de PayPal:', error);
        return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
    }
}
