'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Card, CardBody } from '@nextui-org/react';
import { useLanguage } from '@/components/LanguageProvider';
import GiftIdeas from '@/components/GiftIdeas';
import AdBanner from '@/components/AdBanner';
import ViralCta from '@/components/ViralCta';
import { track, EVENTS } from '@/lib/analytics';

export default function RevealCard({ giverName, receiverName, wishlist, event, country }) {
  const [revealed, setRevealed] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    track(EVENTS.REVEAL_OPENED);
  }, []);

  const handleReveal = () => {
    setRevealed(true);
    track(EVENTS.REVEAL_REVEALED);
  };

  const hasEventDetails = event && (event.date || event.budget || event.message);

  return (
    <div className="flex flex-col items-center justify-center text-center px-4 w-full">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {t('reveal.hello')} <span className="text-primary">{giverName}</span>!
        </h1>
        <p className="text-lg text-default-500 mb-10 max-w-lg mx-auto">
          {t('reveal.subtitle')}
        </p>
      </motion.div>

      <div className="relative w-full max-w-md mx-auto aspect-video">
        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.div
              key="hidden"
              initial={{ opacity: 0, rotateY: -90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: 90 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex items-center justify-center bg-default-100 rounded-2xl shadow-lg border border-default-200"
            >
              <Button
                color="primary"
                size="lg"
                className="text-xl px-12 py-8 rounded-full font-bold shadow-xl hover:scale-105 transform transition-all"
                onPress={handleReveal}
              >
                {t('reveal.reveal_btn')}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="revealed"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5, duration: 0.8 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl shadow-2xl border border-primary/30 p-6"
            >
              <span className="text-sm font-semibold uppercase tracking-widest text-default-500 mb-2">
                {t('reveal.gift_to')}
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                {receiverName}
              </h2>
              <div className="absolute -top-4 -right-4 text-4xl animate-bounce">🎉</div>
              <div className="absolute -bottom-4 -left-4 text-4xl animate-bounce delay-100">✨</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {revealed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full"
        >
          <p className="text-default-400 text-xs mt-8 max-w-md mx-auto">
            {t('reveal.secret_warning')}
          </p>

          {/* Lista de deseos: es lo que convierte el regalo en algo que se usa */}
          <Card className="mt-10 w-full max-w-2xl mx-auto border border-default-100 bg-default-50/40">
            <CardBody className="p-6 text-left">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <span>⭐</span> {t('reveal.wishlist_title')}
              </h3>
              {wishlist ? (
                <p className="text-default-600 leading-relaxed whitespace-pre-line">{wishlist}</p>
              ) : (
                <p className="text-default-400 text-sm">{t('reveal.wishlist_empty')}</p>
              )}
            </CardBody>
          </Card>

          {hasEventDetails && (
            <Card className="mt-4 w-full max-w-2xl mx-auto border border-default-100 bg-default-50/40">
              <CardBody className="p-6 text-left flex flex-col gap-3">
                <h3 className="font-bold flex items-center gap-2">
                  <span>📅</span> {t('reveal.event_title')}
                </h3>
                {event.date && (
                  <p className="text-sm text-default-600">
                    <span className="text-default-400">{t('reveal.event_date')}: </span>
                    {event.date}
                  </p>
                )}
                {event.budget && (
                  <p className="text-sm text-default-600">
                    <span className="text-default-400">{t('reveal.event_budget')}: </span>
                    {event.budget}
                  </p>
                )}
                {event.message && (
                  <p className="text-sm text-default-600 whitespace-pre-line">
                    <span className="text-default-400">{t('reveal.event_message')}: </span>
                    {event.message}
                  </p>
                )}
              </CardBody>
            </Card>
          )}

          <GiftIdeas receiverName={receiverName} wishlist={wishlist} country={country} />

          <div className="mt-16">
            <AdBanner />
          </div>

          <ViralCta />
        </motion.div>
      )}
    </div>
  );
}
