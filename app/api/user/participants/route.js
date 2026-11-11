import { NextResponse } from 'next/server';
import { adminDb } from '@/config/firebase-admin';
import { getSession } from '@/lib/auth';

export async function GET(request) {
    try {
        const session = await getSession(request);
        if (!session?.email) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
        }

        const userDoc = await adminDb.collection('users').doc(session.email).get();
        
        if (userDoc.exists) {
            const data = userDoc.data();
            return NextResponse.json({ participants: data.participants || [] });
        }

        return NextResponse.json({ participants: [] });
    } catch (error) {
        console.error('Error fetching participants:', error);
        return NextResponse.json({ error: 'Error interno', details: error.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const session = await getSession(request);
        if (!session?.email) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
        }

        const { participants } = await request.json();

        if (!Array.isArray(participants)) {
            return NextResponse.json({ error: 'Participants debe ser un array' }, { status: 400 });
        }

        await adminDb.collection('users').doc(session.email).set(
            { participants },
            { merge: true }
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving participants:', error);
        return NextResponse.json({ error: 'Error interno', details: error.message }, { status: 500 });
    }
}
