import { NextResponse } from 'next/server';
import { adminDb } from '@/config/firebase-admin';
import { getSession } from '@/lib/auth';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'brianbentancourt9@gmail.com')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

export async function POST(request) {
    try {
        const session = await getSession(request);
        const userEmail = session?.email;

        if (!userEmail) {
            return NextResponse.json({ isPremium: false, plan: 'free' });
        }

        // Cuentas de administración con acceso completo.
        if (ADMIN_EMAILS.includes(userEmail.toLowerCase())) {
            return NextResponse.json({ isPremium: true, plan: 'business' });
        }

        const userDoc = await adminDb.collection('users').doc(userEmail).get();

        if (userDoc.exists && userDoc.data().isPremium) {
            return NextResponse.json({
                isPremium: true,
                plan: userDoc.data().plan || 'premium',
            });
        }

        return NextResponse.json({ isPremium: false, plan: 'free' });
    } catch (error) {
        console.error('Error fetching user status:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
