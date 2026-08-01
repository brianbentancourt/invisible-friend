'use client';

import { PAYPAL_ENABLED } from '@/config/site';
import { useLanguage } from '@/components/LanguageProvider';

const OPTIONS = [
    { id: 'mercadopago', icon: '💳', labelKey: 'pricing.provider_mp', descKey: 'pricing.provider_mp_desc' },
    { id: 'paypal', icon: '🌎', labelKey: 'pricing.provider_paypal', descKey: 'pricing.provider_paypal_desc' },
];

/**
 * Selector de pasarela. Sólo se muestra si PayPal está configurado: con una
 * sola opción disponible el selector es ruido.
 *
 * `compact` es para lugares donde no hay espacio (cabecera del dashboard);
 * la versión completa muestra además qué acepta cada medio.
 */
export default function PaymentMethodSelector({ value, onChange, compact = false, className = '' }) {
    const { t } = useLanguage();

    if (!PAYPAL_ENABLED) return null;

    return (
        <div className={`flex ${compact ? 'items-center gap-2' : 'flex-col items-center gap-3'} ${className}`}>
            <span className="text-xs text-default-500">{t('pricing.pay_with')}</span>
            <div
                role="radiogroup"
                aria-label={t('pricing.pay_with')}
                className="inline-flex gap-1 p-1 rounded-full bg-default-100 border border-default-200"
            >
                {OPTIONS.map((option) => {
                    const isSelected = value === option.id;
                    return (
                        <button
                            key={option.id}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            onClick={() => onChange(option.id)}
                            className={`flex items-center gap-2 rounded-full transition-colors ${
                                compact ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-sm'
                            } ${
                                isSelected
                                    ? 'bg-background shadow-sm font-semibold text-foreground'
                                    : 'text-default-500 hover:text-foreground'
                            }`}
                        >
                            <span aria-hidden="true">{option.icon}</span>
                            <span>{t(option.labelKey)}</span>
                        </button>
                    );
                })}
            </div>
            {!compact && (
                <p className="text-xs text-default-400 text-center">
                    {t(OPTIONS.find((option) => option.id === value)?.descKey || OPTIONS[0].descKey)}
                </p>
            )}
        </div>
    );
}
