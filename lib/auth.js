import { cookies } from 'next/headers';
import { adminAuth } from '@/config/firebase-admin';

export async function getSession(request) {
    let token = null;

    if (request?.headers) {
        const authHeader = request.headers.get('authorization');
        if (authHeader?.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
    }

    if (!token) {
        try {
            const cookieStore = await cookies();
            token = cookieStore.get('session')?.value;
        } catch {
            // Contextos sin cookies() disponibles
        }
    }

    if (!token) return null;

    try {
        const decodedClaims = await adminAuth.verifyIdToken(token);
        return decodedClaims;
    } catch (error) {
        return null;
    }
}
