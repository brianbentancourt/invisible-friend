import { NextResponse } from 'next/server';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { adminDb } from '@/config/firebase-admin';

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN || '' });

export async function POST(request) {
    try {
        const body = await request.json();

        // Verificar si es una notificación de pago
        if (body.type === 'payment' && body.data?.id) {
            const paymentId = body.data.id;
            const payment = new Payment(client);
            
            // Obtener el pago completo
            const paymentInfo = await payment.get({ id: paymentId });

            if (paymentInfo.status === 'approved') {
                const userEmail = paymentInfo.metadata?.user_email;

                if (userEmail) {
                    // Actualizar el estado del usuario en Firestore
                    const userRef = adminDb.collection('users').doc(userEmail);
                    await userRef.set({
                        isPremium: true,
                        premiumSince: new Date().toISOString(),
                        paymentId: paymentId
                    }, { merge: true });
                    
                    console.log(`Usuario ${userEmail} actualizado a Premium.`);
                }
            }
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error('Error procesando webhook de MP:', error);
        return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
    }
}
