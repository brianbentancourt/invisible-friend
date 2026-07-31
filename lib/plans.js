import { adminDb } from '@/config/firebase-admin';
import { PAID_PLANS } from '@/config/site';

/**
 * Activa un plan pago para un usuario. Vive acá y no dentro de un webhook
 * porque ahora hay dos pasarelas (MercadoPago y PayPal) más el retorno de
 * PayPal, y los tres tienen que dejar exactamente el mismo documento.
 *
 * Es idempotente: el mismo pago puede llegar por webhook y por redirect, y
 * escribir dos veces el mismo estado no cambia nada.
 */
export async function activatePaidPlan({ userEmail, plan, paymentId, provider }) {
    if (!userEmail) return null;

    const safePlan = PAID_PLANS.includes(plan) ? plan : 'premium';

    await adminDb
        .collection('users')
        .doc(userEmail)
        .set(
            {
                isPremium: true,
                plan: safePlan,
                premiumSince: new Date().toISOString(),
                paymentId,
                paymentProvider: provider,
            },
            { merge: true }
        );

    console.log(`Usuario ${userEmail} actualizado a plan ${safePlan} vía ${provider}.`);

    return safePlan;
}
