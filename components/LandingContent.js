'use client';

import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card, CardBody } from '@nextui-org/react';
import { motion } from 'framer-motion';
import AdBanner from '@/components/AdBanner';
import FaqAccordion from '@/components/FaqAccordion';
import PricingTable from '@/components/PricingTable';
import { useAuth } from '@/components/AuthProvider';
import { useLanguage } from '@/components/LanguageProvider';
import { getNavLinks } from '@/lib/content';
import { track, EVENTS } from '@/lib/analytics';

const fadeUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.5 },
};

export default function LandingContent() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const { t, locale } = useLanguage();
    const links = getNavLinks(locale);

    const goToDashboard = (source) => {
        track(EVENTS.CTA_CLICK, { source });
        router.push(`/${locale}/dashboard`);
    };

    const steps = [
        { title: t('landing.step1_title'), desc: t('landing.step1_desc'), icon: '📝' },
        { title: t('landing.step2_title'), desc: t('landing.step2_desc'), icon: '⚙️' },
        { title: t('landing.step3_title'), desc: t('landing.step3_desc'), icon: '🎲' },
    ];

    const benefits = [
        { title: t('landing.why1_title'), desc: t('landing.why1_desc'), icon: '🙈' },
        { title: t('landing.why2_title'), desc: t('landing.why2_desc'), icon: '🚫' },
        { title: t('landing.why3_title'), desc: t('landing.why3_desc'), icon: '🎁' },
        { title: t('landing.why4_title'), desc: t('landing.why4_desc'), icon: '📱' },
    ];

    const testimonials = t('landing.testimonials');
    const faqs = t('faq_home');

    return (
        <div className="min-h-screen bg-background overflow-hidden selection:bg-primary/30">
            {/* Elementos decorativos de fondo (Gradients) */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/20 blur-[120px] pointer-events-none" />

            <main className="container mx-auto px-6 relative z-10 pt-16 pb-24">
                {/* Hero */}
                <section className="flex flex-col items-center justify-center text-center space-y-8 min-h-[56vh]">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <span className="px-4 py-1.5 rounded-full bg-default-100 border border-default-200 text-sm font-medium tracking-wide text-default-600 mb-6 inline-block">
                            {t('landing.tagline')}
                        </span>
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
                            {t('landing.title1')}{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                {t('landing.title2')}
                            </span>
                            <br />
                            {t('landing.title3')}
                        </h1>
                        <p className="text-lg md:text-xl text-default-500 max-w-2xl mx-auto leading-relaxed">
                            {t('landing.description')}
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.25 }}
                        className="flex flex-col items-center gap-4"
                    >
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Button
                                size="lg"
                                color="primary"
                                variant="shadow"
                                className="px-10 py-6 text-lg font-semibold"
                                isLoading={loading}
                                onPress={() => goToDashboard('hero')}
                            >
                                {user ? t('landing.cta_dashboard') : t('landing.cta_start')}
                            </Button>
                            {links.generator && (
                                <Button
                                    as={NextLink}
                                    href={`/${locale}/${links.generator.slug}`}
                                    size="lg"
                                    variant="flat"
                                    className="px-8 py-6 text-lg"
                                >
                                    {t('landing.cta_secondary')}
                                </Button>
                            )}
                        </div>
                        <p className="text-sm text-default-400">{t('landing.no_signup')}</p>
                    </motion.div>
                </section>

                {/* Prueba social */}
                <motion.section {...fadeUp} className="mt-24">
                    <div className="rounded-3xl border border-default-100 bg-default-50/50 backdrop-blur-md p-8 md:p-10">
                        <p className="text-center text-sm uppercase tracking-widest text-default-400 mb-8">
                            {t('landing.social_proof')}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
                            <div>
                                <p className="text-4xl font-extrabold text-primary">+2.000</p>
                                <p className="text-default-500 text-sm mt-1">{t('landing.stat1')}</p>
                            </div>
                            <div>
                                <p className="text-4xl font-extrabold text-secondary">+20.000</p>
                                <p className="text-default-500 text-sm mt-1">{t('landing.stat2')}</p>
                            </div>
                            <div>
                                <p className="text-4xl font-extrabold text-foreground">100%</p>
                                <p className="text-default-500 text-sm mt-1">{t('landing.stat3')}</p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Cómo funciona: 3 pasos */}
                <section className="mt-28" id="como-funciona">
                    <motion.div {...fadeUp} className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-bold">{t('landing.steps_title')}</h2>
                        <p className="text-default-500 mt-4 text-lg">{t('landing.steps_subtitle')}</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {steps.map((step, index) => (
                            <motion.div key={step.title} {...fadeUp} transition={{ duration: 0.5, delay: index * 0.1 }}>
                                <Card className="border-none bg-default-50/50 backdrop-blur-md h-full">
                                    <CardBody className="p-8">
                                        <div className="text-4xl mb-5">{step.icon}</div>
                                        <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                        <p className="text-default-500 leading-relaxed">{step.desc}</p>
                                    </CardBody>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Beneficios */}
                <section className="mt-28">
                    <motion.div {...fadeUp} className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-bold">{t('landing.why_title')}</h2>
                        <p className="text-default-500 mt-4 text-lg">{t('landing.why_subtitle')}</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={benefit.title}
                                {...fadeUp}
                                transition={{ duration: 0.5, delay: index * 0.08 }}
                            >
                                <Card className="border-none bg-default-50/50 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow h-full">
                                    <CardBody className="p-8 text-center flex flex-col items-center">
                                        <div className="text-4xl mb-5 bg-default-100 w-16 h-16 rounded-full flex items-center justify-center shadow-inner">
                                            {benefit.icon}
                                        </div>
                                        <h3 className="text-lg font-bold mb-3">{benefit.title}</h3>
                                        <p className="text-default-500 text-sm leading-relaxed">{benefit.desc}</p>
                                    </CardBody>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <div className="mt-20">
                    <AdBanner />
                </div>

                {/* Testimonios */}
                {Array.isArray(testimonials) && (
                    <section className="mt-24">
                        <motion.h2 {...fadeUp} className="text-3xl md:text-4xl font-bold text-center mb-14">
                            {t('landing.testimonials_title')}
                        </motion.h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {testimonials.map((testimonial, index) => (
                                <motion.div
                                    key={testimonial.author}
                                    {...fadeUp}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <Card className="border border-default-100 bg-default-50/40 h-full">
                                        <CardBody className="p-8 flex flex-col gap-5">
                                            <p className="text-default-600 leading-relaxed italic">
                                                “{testimonial.quote}”
                                            </p>
                                            <div className="mt-auto">
                                                <p className="font-semibold text-sm">{testimonial.author}</p>
                                                <p className="text-default-400 text-xs">{testimonial.role}</p>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Precios */}
                <section className="mt-28" id="precios">
                    <motion.div {...fadeUp} className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl font-bold">{t('pricing.title')}</h2>
                        <p className="text-default-500 mt-4 text-lg">{t('pricing.subtitle')}</p>
                    </motion.div>
                    <PricingTable />
                </section>

                {/* FAQ */}
                {Array.isArray(faqs) && (
                    <section className="mt-28 max-w-3xl mx-auto" id="faq">
                        <motion.div {...fadeUp} className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold">{t('landing.faq_title')}</h2>
                            <p className="text-default-500 mt-4 text-lg">{t('landing.faq_subtitle')}</p>
                        </motion.div>
                        <FaqAccordion faqs={faqs} />
                        {links.faq && (
                            <div className="text-center mt-8">
                                <NextLink
                                    href={`/${locale}/${links.faq.slug}`}
                                    className="text-primary hover:underline text-sm font-medium"
                                >
                                    {t('landing.faq_more')} →
                                </NextLink>
                            </div>
                        )}
                    </section>
                )}

                {/* CTA final */}
                <motion.section
                    {...fadeUp}
                    className="mt-28 rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/10 p-10 md:p-16 text-center"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('landing.final_cta_title')}</h2>
                    <p className="text-default-500 max-w-xl mx-auto mb-8">{t('landing.final_cta_desc')}</p>
                    <Button
                        size="lg"
                        color="primary"
                        variant="shadow"
                        className="px-10 py-6 text-lg font-semibold"
                        onPress={() => goToDashboard('final_cta')}
                    >
                        {t('landing.final_cta_btn')}
                    </Button>
                </motion.section>
            </main>
        </div>
    );
}
