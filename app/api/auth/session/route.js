import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
    try {
        const { token } = await request.json();

        // Configurar la cookie de sesión
        cookies().set({
            name: 'session',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 1 semana
            path: '/',
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in session API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}