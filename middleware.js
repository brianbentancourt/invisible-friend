import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname } = request.nextUrl;

    // Lista de rutas públicas que no requieren autenticación
    const publicRoutes = ['/auth/signin'];

    // Si es una ruta pública, permitir acceso
    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    // Para las rutas protegidas, verificar el token en las cookies
    const token = request.cookies.get('session');

    if (!token && pathname !== '/auth/signin') {
        return NextResponse.redirect(new URL('/auth/signin', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};