import { NextResponse } from 'next/server';
import { adminDb } from '@/config/firebase-admin';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userEmail = searchParams.get('email');

        if (!userEmail) {
            return NextResponse.json({ error: 'Email requerido' }, { status: 400 });
        }

        const userDoc = await adminDb.collection('users').doc(userEmail).get();
        
        if (userDoc.exists) {
            const data = userDoc.data();
            return NextResponse.json({ participants: data.participants || [] });
        }

        return NextResponse.json({ participants: [] });
    } catch (error) {
        console.error('Error fetching participants:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { userEmail, participants } = await request.json();

        if (!userEmail || !Array.isArray(participants)) {
            return NextResponse.json({ error: 'Email y participants son requeridos' }, { status: 400 });
        }

        await adminDb.collection('users').doc(userEmail).set(
            { participants },
            { merge: true }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving participants:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
