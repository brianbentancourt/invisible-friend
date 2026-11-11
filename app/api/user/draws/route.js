import { NextResponse } from 'next/server';
import { adminDb } from '@/config/firebase-admin';
import { getSession } from '@/lib/auth';

export async function GET(request) {
    try {
        const session = await getSession(request);
        if (!session?.email) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
        }

        const snapshot = await adminDb
            .collection('draws')
            .where('organizerEmail', '==', session.email)
            .get();

        const draws = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                timestamp: data.timestamp,
                locale: data.locale,
                event: data.event,
                participantCount: data.results?.length || 0,
            };
        });

        // Ordenar por fecha descendente
        draws.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        return NextResponse.json({ draws });
    } catch (error) {
        console.error('Error fetching past draws:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
