'use client';

import NextLink from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';
import { getNavLinks } from '@/lib/content';
import { SITE_NAME, AUTHOR } from '@/config/site';

export default function Footer() {
    const { t, locale } = useLanguage();
    const links = getNavLinks(locale);
    const year = new Date().getFullYear();

    const columns = [
        {
            title: t('footer.product'),
            items: [
                { label: t('nav.cta'), href: `/${locale}/dashboard` },
                links.pricing && { label: t('nav.pricing'), href: `/${locale}/${links.pricing.slug}` },
                links.work && { label: links.work.h1, href: `/${locale}/${links.work.slug}` },
            ].filter(Boolean),
        },
        {
            title: t('footer.resources'),
            items: [
                links.generator && { label: links.generator.h1, href: `/${locale}/${links.generator.slug}` },
                links.rules && { label: links.rules.h1, href: `/${locale}/${links.rules.slug}` },
                links.giftIdeas && { label: links.giftIdeas.h1, href: `/${locale}/${links.giftIdeas.slug}` },
                links.faq && { label: t('nav.faq'), href: `/${locale}/${links.faq.slug}` },
            ].filter(Boolean),
        },
        {
            title: t('footer.legal'),
            items: [
                links.privacy && { label: links.privacy.h1, href: `/${locale}/${links.privacy.slug}` },
                links.terms && { label: links.terms.h1, href: `/${locale}/${links.terms.slug}` },
            ].filter(Boolean),
        },
    ];

    return (
        <footer className="w-full border-t border-default-100 bg-default-50/40 mt-20">
            <div className="container mx-auto px-6 py-14">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">🎁</span>
                            <span className="font-extrabold text-lg">{SITE_NAME}</span>
                        </div>
                        <p className="text-sm text-default-500 leading-relaxed">
                            {t('footer.tagline')}
                        </p>
                    </div>

                    {columns.map((column) => (
                        <div key={column.title}>
                            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-default-400">
                                {column.title}
                            </h3>
                            <ul className="flex flex-col gap-3">
                                {column.items.map((item) => (
                                    <li key={item.href}>
                                        <NextLink
                                            href={item.href}
                                            className="text-sm text-default-600 hover:text-primary transition-colors"
                                        >
                                            {item.label}
                                        </NextLink>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 pt-6 border-t border-default-100 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-default-400">
                    <p>
                        © {year} {SITE_NAME}. {t('footer.rights')}
                    </p>
                    <p>
                        {t('footer.made_by')}{' '}
                        <a
                            href={AUTHOR.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                        >
                            {AUTHOR.name}
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
