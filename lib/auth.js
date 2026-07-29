import { cookies } from 'next/headers';
import { adminAuth } from '@/config/firebase-admin';

export async function getSession() {
    const cookieStore = await cookies();
    const cookie = cookieStore.get('session');
    if (!cookie) return null;

    try {
        const decodedClaims = await adminAuth.verifyIdToken(cookie.value);
        return decodedClaims;
    } catch (error) {
        return null;
    }
}