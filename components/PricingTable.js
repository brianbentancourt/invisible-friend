'use client';

import { useState } from 'react';
import { Button, Card, CardBody, Chip } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAuth } from '@/components/AuthProvider';
import { useLanguage } from '@/components/LanguageProvider';
import { PLANS } from '@/config/site';
import { track, EVENTS } from '@/lib/analytics';

function Check() {
    return (
        <svg
            className="w-5 h-5 shrink-0 text-primary mt-0.5"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
        >
            <path
                fillRule="evenodd"
                d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 111.4-1.4l3.8 3.8 6.8-6.8a1 1 0 011.4 0z"
                clipRule="evenodd"
            />
        </svg>
    );
}

export default function PricingTable() {
    const { t, locale } = useLanguage();
    const { user } = useAuth();
    const router = useRouter();
    const [loadingPlan, setLoadingPlan] = useState(null);

    const startCheckout = async (plan) => {
        track(EVENTS.UPGRADE_CLICK, { plan, source: 'pricing_table' });

        if (!user?.email) {
            // Sin cuenta no podemos asociar el pago, así que primero login.
            router.push(`/${locale}/auth/signin?next=pricing`);
            return;
        }

        setLoadingPlan(plan);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail: user.email, plan, lang: locale }),
            });
            const data = await response.json();

            if (data.url) {
                track(EVENTS.CHECKOUT_STARTED, { plan });
                window.location.href = data.url;
            } else {
                toast.error(t('dashboard.errors.payment_init_error'));
            }
        } catch (error) {
            toast.error(t('dashboard.errors.payment_conn_error'));
        } finally {
            setLoadingPlan(null);
        }
    };

    const tiers = [
        {
            id: 'free',
            name: t('pricing.free_name'),
            desc: t('pricing.free_desc'),
            price: 0,
            priceUsd: 0,
            features: t('pricing.free_features'),
            cta: t('pricing.free_cta'),
            onPress: () => {
                track(EVENTS.CTA_CLICK, { source: 'pricing_free' });
                router.push(`/${locale}/dashboard`);
            },
            highlight: false,
        },
        {
            id: 'premium',
            name: t('pricing.premium_name'),
            desc: t('pricing.premium_desc'),
            price: PLANS.premium.price,
            priceUsd: PLANS.premium.priceUsd,
            features: t('pricing.premium_features'),
            cta: t('pricing.premium_cta'),
            onPress: () => startCheckout('premium'),
            highlight: true,
        },
        {
            id: 'business',
            name: t('pricing.business_name'),
            desc: t('pricing.business_desc'),
            price: PLANS.business.price,
            priceUsd: PLANS.business.priceUsd,
            features: t('pricing.business_features'),
            cta: t('pricing.business_cta'),
            onPress: () => startCheckout('business'),
            highlight: false,
        },
    ];

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                {tiers.map((tier) => (
                    <Card
                        key={tier.id}
                        className={`border h-full ${
                            tier.highlight
                                ? 'border-primary/50 bg-primary/5 shadow-lg md:scale-[1.03]'
                                : 'border-default-200 bg-default-50/50'
                        }`}
                    >
                        <CardBody className="p-8 flex flex-col gap-6">
                            <div>
                                <div className="flex items-center justify-between gap-2 mb-2">
                                    <h3 className="text-xl font-bold">{tier.name}</h3>
                                    {tier.highlight && (
                                        <Chip color="primary" size="sm" variant="flat">
                                            {t('pricing.popular')}
                                        </Chip>
                                    )}
                                </div>
                                <p className="text-default-500 text-sm leading-relaxed">{tier.desc}</p>
                            </div>

                            <div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-extrabold">
                                        {tier.price === 0 ? '$0' : `$${tier.price}`}
                                    </span>
                                    {tier.price > 0 && (
                                        <span className="text-default-400 text-sm">UYU</span>
                                    )}
                                </div>
                                <p className="text-default-400 text-xs mt-1">
                                    {tier.price === 0
                                        ? t('pricing.free_forever')
                                        : `≈ USD ${tier.priceUsd} · ${t('pricing.per_draw')}`}
                                </p>
                            </div>

                            <ul className="flex flex-col gap-3 flex-1">
                                {(Array.isArray(tier.features) ? tier.features : []).map((feature) => (
                                    <li key={feature} className="flex gap-2 text-sm text-default-600">
                                        <Check />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                color={tier.highlight ? 'primary' : 'default'}
                                variant={tier.highlight ? 'shadow' : 'flat'}
                                className="font-semibold w-full"
                                isLoading={loadingPlan === tier.id}
                                onPress={tier.onPress}
                            >
                                {tier.cta}
                            </Button>
                        </CardBody>
                    </Card>
                ))}
            </div>

            <p className="text-center text-default-400 text-xs mt-8 max-w-2xl mx-auto">
                {t('pricing.note')}
            </p>
        </div>
    );
}
