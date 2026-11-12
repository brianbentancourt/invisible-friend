'use client';

import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';
import { track, EVENTS } from '@/lib/analytics';

/**
 * Bucle viral: cada sorteo de N personas genera N visitas a esta página.
 * Sin este bloque, esas visitas veían el producto funcionando y se iban.
 */
export default function ViralCta() {
    const router = useRouter();
    const { t, locale } = useLanguage();

    const handleClick = () => {
        track(EVENTS.VIRAL_CTA_CLICK);
        router.push(`/${locale}/dashboard`);
    };

    return (
        <section className="mt-12 sm:mt-16 mb-8 sm:mb-10 w-full max-w-2xl mx-auto rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/10 p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-3 break-words">{t('reveal.viral_title')}</h2>
            <p className="text-default-500 mb-6 text-sm max-w-md mx-auto">
                {t('reveal.viral_desc')}
            </p>
            <Button color="primary" variant="shadow" className="font-semibold px-6 sm:px-8 w-full sm:w-auto" onPress={handleClick}>
                {t('reveal.viral_cta')}
            </Button>
        </section>
    );
}
