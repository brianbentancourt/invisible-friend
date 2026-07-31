import Link from 'next/link';
import { getTranslator } from '@/lib/i18n';
import { DEFAULT_LOCALE } from '@/config/site';

export const metadata = {
    robots: { index: false, follow: true },
};

export default function NotFound() {
    // not-found.js no recibe params, así que usamos el idioma por defecto.
    const t = getTranslator(DEFAULT_LOCALE);

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center">
                <div className="text-6xl mb-6">🎁</div>
                <h1 className="text-4xl font-extrabold mb-3">404</h1>
                <p className="text-lg text-default-500 mb-8">Página no encontrada</p>
                <Link
                    href={`/${DEFAULT_LOCALE}`}
                    className="text-primary hover:underline font-semibold"
                >
                    {t('common.back_home')}
                </Link>
            </div>
        </div>
    );
}
