'use client';

import { useEffect } from 'react';
import { Card, CardBody, Button, Chip } from '@nextui-org/react';
import { useLanguage } from '@/components/LanguageProvider';
import { getStores, buildSearchUrl } from '@/lib/affiliate';

export default function AdBanner() {
  const { locale } = useLanguage();
  const enableAdsense = process.env.NEXT_PUBLIC_ENABLE_ADSENSE === 'true';
  const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;
  const slotId = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID;

  // Si AdSense está explícitamente activado y configurado
  useEffect(() => {
    if (enableAdsense && pubId && slotId && typeof window !== 'undefined') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('Error cargando anuncio de AdSense:', e);
      }
    }
  }, [enableAdsense, pubId, slotId]);

  if (enableAdsense && pubId && slotId) {
    return (
      <div className="w-full max-w-4xl mx-auto my-8 flex items-center justify-center min-h-[100px] overflow-hidden">
        <ins
          className="adsbygoogle w-full"
          style={{ display: 'block' }}
          data-ad-client={pubId}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Detectar stores (en español por defecto prioriza Mercado Libre Uruguay)
  const stores = getStores(locale);
  const primaryStore = stores[0];

  if (!primaryStore) {
    return null;
  }

  const isMeli = primaryStore.id.startsWith('meli');

  const deals = isMeli
    ? [
        { label: '💸 Hasta $500', query: 'regalos hasta 500 pesos' },
        { label: '🎁 Hasta $1000', query: 'regalos hasta 1000 pesos' },
        { label: '🎧 Tecnología & Auriculares', query: 'tecnologia gadgets regalo' },
        { label: '🎲 Juegos de mesa', query: 'juegos de mesa' },
        { label: '🧉 Mates & Termos', query: 'mates termos originales' },
      ]
    : locale === 'en'
      ? [
          { label: '💸 Under $15', query: 'gifts under 15 dollars' },
          { label: '🎧 Tech & Gadgets', query: 'tech gifts cool gadgets' },
          { label: '🎲 Board Games', query: 'fun board games party games' },
        ]
      : locale === 'pt'
        ? [
            { label: '💸 Menos de R$50', query: 'presentes baratos criativos' },
            { label: '🎧 Tecnologia', query: 'gadgets tecnologia presente' },
            { label: '🎲 Jogos de Tabuleiro', query: 'jogos de tabuleiro divertidos' },
          ]
        : [
            { label: '💸 Menos de 15€', query: 'regalos baratos originales menos de 15 euros' },
            { label: '🎧 Tecnología & Gadgets', query: 'gadgets tecnologia originales regalo' },
            { label: '🎲 Juegos de mesa', query: 'juegos de mesa divertidos para regalo' },
          ];

  return (
    <aside
      aria-label="Recomendaciones de regalos"
      className="w-full max-w-4xl mx-auto my-8 px-4"
    >
      <Card className="border border-primary/20 bg-gradient-to-r from-primary/10 via-background to-secondary/10 shadow-sm overflow-hidden">
        <CardBody className="p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="text-center md:text-left flex-1">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1.5">
              <span className="text-2xl" role="img" aria-label="regalo">🎁</span>
              <h3 className="font-bold text-base sm:text-lg text-foreground">
                {locale === 'pt'
                  ? 'Ideias de presentes para o Amigo Secreto'
                  : locale === 'en'
                    ? 'Secret Santa gift ideas'
                    : '¿Buscando qué regalar en el Amigo Invisible?'}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-default-500 mb-3 max-w-xl">
              {isMeli
                ? 'Encontrá opciones populares, detalles originales y regalos con entrega rápida en Mercado Libre.'
                : locale === 'pt'
                  ? 'Descubra os presentes mais populares, itens criativos e ofertas com envio rápido.'
                  : locale === 'en'
                    ? 'Explore trending gift ideas, popular picks and top rated deals with fast delivery.'
                    : 'Descubre los regalos más populares, detalles originales y ofertas con entrega rápida.'}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              {deals.map((deal) => (
                <a
                  key={deal.label}
                  href={buildSearchUrl(primaryStore, deal.query)}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                >
                  <Chip
                    size="sm"
                    variant="flat"
                    color="primary"
                    className="cursor-pointer hover:opacity-80 transition-opacity text-xs"
                  >
                    {deal.label}
                  </Chip>
                </a>
              ))}
            </div>
          </div>
          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <Button
              as="a"
              href={buildSearchUrl(
                primaryStore,
                isMeli
                  ? 'regalos amigo invisible'
                  : locale === 'pt'
                    ? 'presentes amigo secreto'
                    : locale === 'en'
                      ? 'secret santa gifts'
                      : 'ideas regalos amigo invisible'
              )}
              target="_blank"
              rel="noopener noreferrer sponsored"
              color="primary"
              variant="shadow"
              size="md"
              className="font-semibold text-sm px-5"
            >
              {`Ver en ${primaryStore.name}`}
            </Button>
            <span className="text-[10px] text-default-400">
              {isMeli ? 'Búsqueda directa' : locale === 'en' ? 'Sponsored link' : 'Enlace patrocinado'}
            </span>
          </div>
        </CardBody>
      </Card>
    </aside>
  );
}
