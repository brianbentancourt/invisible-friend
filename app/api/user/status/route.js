import { NextResponse } from 'next/server';
import { adminDb } from '@/config/firebase-admin';

export async function POST(request) {
    try {
        const { userEmail } = await request.json();

        if (!userEmail) {
            return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
        }

        // Excepción de Administrador para brianbentancourt9@gmail.com
        if (userEmail === 'brianbentancourt9@gmail.com') {
            return NextResponse.json({ isPremium: true });
        }

        const userDoc = await adminDb.collection('users').doc(userEmail).get();
        
        if (userDoc.exists && userDoc.data().isPremium) {
            return NextResponse.json({ isPremium: true });
        }

        return NextResponse.json({ isPremium: false });
    } catch (error) {
        console.error('Error fetching user status:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
