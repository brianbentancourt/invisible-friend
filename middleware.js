import { NextResponse } from 'next/server';

const locales = ['es', 'en', 'pt'];
const defaultLocale = 'es';

function getLocale(request) {
    const cookie = request.cookies.get('NEXT_LOCALE')?.value;
    if (cookie && locales.includes(cookie)) {
        return cookie;
    }

    // Fallback a accept-language (simple pero priorizando el que aparece primero)
    const acceptLang = request.headers.get('accept-language')?.toLowerCase();
    if (acceptLang) {
        const positions = locales
            .map((locale) => ({ locale, index: acceptLang.indexOf(locale) }))
            .filter(({ index }) => index !== -1)
            .sort((a, b) => a.index - b.index);

        if (positions.length > 0) return positions[0].locale;
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

    // Todo el sitio es público. El dashboard funciona en modo invitado (los
    // participantes viven en localStorage) y el login se pide recién al sortear,
    // cuando el usuario ya invirtió tiempo cargando su lista.
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
