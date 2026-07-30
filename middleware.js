import { NextResponse } from 'next/server';

const locales = ['es', 'en'];
const defaultLocale = 'es';

function getLocale(request) {
    const cookie = request.cookies.get('NEXT_LOCALE')?.value;
    if (cookie && locales.includes(cookie)) {
        return cookie;
    }
    
    // Fallback a accept-language (simple pero priorizando el que aparece primero)
    const acceptLang = request.headers.get('accept-language');
    if (acceptLang) {
        const esIndex = acceptLang.indexOf('es');
        const enIndex = acceptLang.indexOf('en');
        
        if (esIndex !== -1 && (enIndex === -1 || esIndex < enIndex)) return 'es';
        if (enIndex !== -1 && (esIndex === -1 || enIndex < esIndex)) return 'en';
    }
    
    return defaultLocale;
}

export function middleware(request) {
    const { pathname } = request.nextUrl;

    // Ignorar rutas estáticas y api (esto ya lo hace el matcher, pero por si acaso)
    if (
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next') ||
        pathname.includes('.')
    ) {
        return NextResponse.next();
    }

    // Comprobar si la ruta actual tiene un locale
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    // Si no tiene locale, redirigir
    if (!pathnameHasLocale) {
        const locale = getLocale(request);
        request.nextUrl.pathname = `/${locale}${pathname}`;
        return NextResponse.redirect(request.nextUrl);
    }

    // Extraer el locale actual de la URL
    const currentLocale = locales.find((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`);
    
    // Validar autenticación
    const publicRoutes = [`/${currentLocale}/auth/signin`, `/${currentLocale}`];
    
    if (publicRoutes.includes(pathname) || pathname.startsWith(`/${currentLocale}/sorteo/`)) {
        return NextResponse.next();
    }

    const token = request.cookies.get('session');

    if (!token && pathname !== `/${currentLocale}/auth/signin`) {
        return NextResponse.redirect(new URL(`/${currentLocale}/auth/signin`, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};