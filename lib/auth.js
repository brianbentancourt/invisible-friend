import { cookies } from 'next/headers';
import { auth } from '@/config/firebase';

export async function getSession() {
    const cookie = cookies().get('session');
    if (!cookie) return null;

    try {
        const decodedClaims = await auth.verifySessionCookie(cookie.value);
        return decodedClaims;
    } catch (error) {
        return null;
    }
}