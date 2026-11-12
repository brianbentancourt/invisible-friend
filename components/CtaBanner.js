'use client';

import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';
import { track, EVENTS } from '@/lib/analytics';

export default function CtaBanner({ title, desc, label, source = 'content' }) {
    const router = useRouter();
    const { locale } = useLanguage();

    const handleClick = () => {
        track(EVENTS.CTA_CLICK, { source });
        router.push(`/${locale}/dashboard`);
    };

    return (
        <section className="my-12 sm:my-16 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/10 p-6 sm:p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3 break-words">{title}</h2>
            <p className="text-default-500 max-w-xl mx-auto mb-6 sm:mb-8 text-sm sm:text-base">{desc}</p>
            <Button
                color="primary"
                size="lg"
                variant="shadow"
                className="font-semibold px-6 sm:px-8 w-full sm:w-auto"
                onPress={handleClick}
            >
                {label}
            </Button>
        </section>
    );
}
