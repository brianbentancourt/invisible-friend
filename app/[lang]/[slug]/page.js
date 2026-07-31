import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPage, getAlternateSlugs, getPages } from '@/lib/content';
import { getTranslator } from '@/lib/i18n';
import { LOCALES, SITE_URL, SITE_NAME, HREFLANG, OG_LOCALES, localeFromParam } from '@/config/site';
import JsonLd from '@/components/JsonLd';
import FaqAccordion from '@/components/FaqAccordion';
import PricingTable from '@/components/PricingTable';
import CtaBanner from '@/components/CtaBanner';
import AdBanner from '@/components/AdBanner';
import { faqSchema, breadcrumbSchema, articleSchema } from '@/lib/schema';

/** Pre-genera todas las páginas de contenido de todos los idiomas. */
export function generateStaticParams() {
    return LOCALES.flatMap((lang) =>
        getPages(lang).map((page) => ({ lang, slug: page.slug }))
    );
}

export async function generateMetadata({ params }) {
    const { lang, slug } = await params;
    const locale = localeFromParam(lang);
    const page = getPage(locale, slug);

    if (!page) return {};

    const alternates = getAlternateSlugs(page.key);
    const languages = Object.entries(alternates).reduce((acc, [loc, altSlug]) => {
        acc[HREFLANG[loc]] = `${SITE_URL}/${loc}/${altSlug}`;
        return acc;
    }, {});

    const url = `${SITE_URL}/${locale}/${page.slug}`;
    // Al declarar openGraph aquí se pierde la imagen heredada del layout,
    // así que apuntamos explícitamente a la que genera opengraph-image.js.
    const ogImage = `${SITE_URL}/${locale}/opengraph-image`;

    return {
        title: page.title,
        description: page.description,
        keywords: page.keywords,
        alternates: {
            canonical: url,
            languages,
        },
        openGraph: {
            title: page.title,
            description: page.description,
            url,
            siteName: SITE_NAME,
            type: page.type === 'article' ? 'article' : 'website',
            locale: OG_LOCALES[locale],
            images: [{ url: ogImage, width: 1200, height: 630, alt: page.h1 }],
        },
        twitter: {
            card: 'summary_large_image',
            title: page.title,
            description: page.description,
            images: [ogImage],
        },
        robots: page.type === 'legal' ? { index: true, follow: true } : undefined,
    };
}

function Section({ section }) {
    return (
        <section className="mt-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">{section.h2}</h2>

            {section.p?.map((paragraph, index) => (
                <p key={index} className="text-default-600 leading-relaxed mb-4">
                    {paragraph}
                </p>
            ))}

            {section.ul && (
                <ul className="flex flex-col gap-3 my-6">
                    {section.ul.map((item, index) => (
                        <li key={index} className="flex gap-3 text-default-600 leading-relaxed">
                            <span className="text-primary mt-1">•</span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            )}

            {section.ol && (
                <ol className="flex flex-col gap-3 my-6">
                    {section.ol.map((item, index) => (
                        <li key={index} className="flex gap-3 text-default-600 leading-relaxed">
                            <span className="font-bold text-primary shrink-0">{index + 1}.</span>
                            <span>{item}</span>
                        </li>
                    ))}
                </ol>
            )}

            {section.p2?.map((paragraph, index) => (
                <p key={index} className="text-default-600 leading-relaxed mb-4">
                    {paragraph}
                </p>
            ))}
        </section>
    );
}

export default async function ContentPage({ params }) {
    const { lang, slug } = await params;
    const locale = localeFromParam(lang);
    const page = getPage(locale, slug);

    if (!page) notFound();

    const t = getTranslator(locale);
    const url = `${SITE_URL}/${locale}/${page.slug}`;

    const schemas = [
        breadcrumbSchema([
            { name: SITE_NAME, url: `${SITE_URL}/${locale}` },
            { name: page.h1, url },
        ]),
        faqSchema(page.faqs),
        page.type === 'article'
            ? articleSchema({ locale, title: page.title, description: page.description, slug: page.slug })
            : null,
    ].filter(Boolean);

    return (
        <div className="min-h-screen bg-background">
            {schemas.map((schema, index) => (
                <JsonLd key={index} data={schema} />
            ))}

            <main className="container mx-auto px-6 max-w-3xl pt-16 pb-24">
                <nav className="text-sm text-default-400 mb-6">
                    <Link href={`/${locale}`} className="hover:text-primary transition-colors">
                        {SITE_NAME}
                    </Link>
                    <span className="mx-2">/</span>
                    <span className="text-default-500">{page.h1}</span>
                </nav>

                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
                    {page.h1}
                </h1>

                {page.intro && (
                    <p className="text-lg text-default-500 leading-relaxed">{page.intro}</p>
                )}

                {page.showPricing && (
                    <div className="mt-12">
                        <PricingTable />
                    </div>
                )}

                {page.sections?.map((section, index) => (
                    <Section key={index} section={section} />
                ))}

                {page.faqs?.length > 0 && (
                    <section className="mt-16">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6">
                            {page.type === 'pricing' ? t('pricing.faq_title') : t('landing.faq_title')}
                        </h2>
                        <FaqAccordion faqs={page.faqs} />
                    </section>
                )}

                {page.cta && (
                    <CtaBanner
                        title={page.cta.title}
                        desc={page.cta.desc}
                        label={page.cta.label}
                        source={`content_${page.key}`}
                    />
                )}

                {page.type !== 'legal' && <AdBanner />}
            </main>
        </div>
    );
}
