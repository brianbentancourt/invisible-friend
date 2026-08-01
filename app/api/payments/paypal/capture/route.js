import { NextResponse } from 'next/server';
import { captureOrder, parseCustomId } from '@/lib/paypal';
import { activatePaidPlan } from '@/lib/plans';
import { SITE_URL, localeFromParam } from '@/config/site';

/**
 * Retorno de PayPal tras aprobar el pago. PayPal vuelve con ?token=<orderId>
 * y acá se hace la captura (el cobro real). El webhook también activa el plan,
 * pero capturar en el retorno es lo que hace que el usuario vea su plan activo
 * al instante en vez de esperar la notificación.
 */
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('token');
    const locale = localeFromParam(searchParams.get('lang'));
    const dashboardUrl = `${SITE_URL}/${locale}/dashboard`;

    if (!orderId) {
        return NextResponse.redirect(`${dashboardUrl}?payment=failure`);
    }

    try {
        const order = await captureOrder(orderId);

        // El custom_id lo escribimos nosotros al crear la orden: es la única
        // fuente confiable de a quién activarle el plan (nada viene de la query).
        const unit = order.purchase_units?.[0];
        const metadata = parseCustomId(unit?.custom_id);
        const capture = unit?.payments?.captures?.[0];

        if (order.status === 'COMPLETED' && capture?.status === 'COMPLETED' && metadata) {
            await activatePaidPlan({
                userEmail: metadata.userEmail,
                plan: metadata.plan,
                paymentId: capture.id,
                provider: 'paypal',
            });

            return NextResponse.redirect(`${dashboardUrl}?payment=success`);
        }

        // PENDING suele ser una revisión de PayPal: el webhook completará la activación.
        if (capture?.status === 'PENDING' || order.status === 'PENDING_APPROVAL') {
            return NextResponse.redirect(`${dashboardUrl}?payment=pending`);
        }

        return NextResponse.redirect(`${dashboardUrl}?payment=failure`);
    } catch (error) {
        console.error('Error capturando la orden de PayPal:', error);
        return NextResponse.redirect(`${dashboardUrl}?payment=failure`);
    }
}
