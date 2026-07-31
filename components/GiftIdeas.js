'use client';

import { Card, CardBody, Chip } from '@nextui-org/react';
import { useLanguage } from '@/components/LanguageProvider';
import { getStores, buildSearchUrl, GIFT_CATEGORIES } from '@/lib/affiliate';
import { track, EVENTS } from '@/lib/analytics';

const CATEGORY_ICONS = {
    budget: '💸',
    tech: '🎧',
    home: '🏠',
    books: '📚',
    beauty: '🧴',
    experiences: '🎲',
};

/**
 * Bloque de ideas de regalo. Combina la lista de deseos del destinatario
 * (si la cargó) con búsquedas por categoría en tiendas con enlace de afiliado.
 */
export default function GiftIdeas({ receiverName, wishlist, country }) {
    const { t, locale } = useLanguage();
    const stores = getStores(locale, country);

    // Sin tiendas disponibles para su país no mostramos nada: enlaces sin
    // comisión a tiendas que no operan donde vive el usuario no aportan.
    if (stores.length === 0) return null;

    // Si el destinatario dejó deseos, esas búsquedas van primero: convierten
    // mucho mejor que las categorías genéricas.
    const wishlistQueries = (wishlist || '')
        .split(/[,\n;]+/)
        .map((item) => item.trim())
        .filter((item) => item.length > 2)
        .slice(0, 4);

    const handleClick = (source, query) => {
        track(EVENTS.GIFT_IDEA_CLICK, { source, query });
    };

    return (
        <section className="w-full max-w-3xl mx-auto mt-16">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">
                    {t('gift_ideas.title', { name: receiverName })}
                </h2>
                <p className="text-default-500 text-sm max-w-xl mx-auto">
                    {t('gift_ideas.subtitle')}
                </p>
            </div>

            {wishlistQueries.length > 0 && (
                <div className="mb-8 flex flex-wrap justify-center gap-2">
                    {wishlistQueries.map((query) =>
                        stores.slice(0, 1).map((store) => (
                            <a
                                key={`${store.id}-${query}`}
                                href={buildSearchUrl(store, query)}
                                target="_blank"
                                rel="noopener noreferrer sponsored"
                                onClick={() => handleClick('wishlist', query)}
                            >
                                <Chip
                                    color="primary"
                                    variant="flat"
                                    className="cursor-pointer hover:opacity-80 transition-opacity"
                                >
                                    🔎 {query}
                                </Chip>
                            </a>
                        ))
                    )}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {GIFT_CATEGORIES.map((category) => {
                    const query = t(`gift_ideas.queries.${category}`);

                    return (
                        <Card key={category} className="border border-default-100 bg-default-50/40">
                            <CardBody className="p-5">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-2xl">{CATEGORY_ICONS[category]}</span>
                                    <h3 className="font-semibold text-sm">
                                        {t(`gift_ideas.categories.${category}`)}
                                    </h3>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {stores.map((store) => (
                                        <a
                                            key={store.id}
                                            href={buildSearchUrl(store, query)}
                                            target="_blank"
                                            rel="noopener noreferrer sponsored"
                                            onClick={() => handleClick(category, store.id)}
                                            className="text-xs px-3 py-1.5 rounded-full bg-default-100 hover:bg-primary/20 text-default-600 hover:text-primary transition-colors"
                                        >
                                            {t('gift_ideas.search_on', { store: store.name })}
                                        </a>
                                    ))}
                                </div>
                            </CardBody>
                        </Card>
                    );
                })}
            </div>

            <p className="text-center text-default-400 text-xs mt-6">
                {t('gift_ideas.disclosure')}
            </p>
        </section>
    );
}
