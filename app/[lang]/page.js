'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { Button, Card, CardBody } from '@nextui-org/react';
import { motion } from 'framer-motion';
import AdBanner from '@/components/AdBanner';
import { useLanguage } from '@/components/LanguageProvider';

export default function LandingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { t, locale } = useLanguage();

  const handleCTA = () => {
    if (user) {
      router.push(`/${locale}/dashboard`);
    } else {
      router.push(`/${locale}/auth/signin`);
    }
  };

  const features = [
    {
      title: t('landing.f1_title'),
      description: t('landing.f1_desc'),
      icon: "👥",
    },
    {
      title: t('landing.f2_title'),
      description: t('landing.f2_desc'),
      icon: "⚙️",
    },
    {
      title: t('landing.f3_title'),
      description: t('landing.f3_desc'),
      icon: "🎲",
    },
    {
      title: t('landing.f4_title'),
      description: t('landing.f4_desc'),
      icon: "📱",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden selection:bg-primary/30">
      {/* Elementos decorativos de fondo (Gradients) */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/20 blur-[120px] pointer-events-none" />

      <main className="container mx-auto px-6 relative z-10 pt-20 pb-32">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center text-center space-y-10 min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-block"
          >
            <span className="px-4 py-1.5 rounded-full bg-default-100 border border-default-200 text-sm font-medium tracking-wide text-default-600 mb-6 inline-block">
              {t('landing.tagline')}
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
              {t('landing.title1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{t('landing.title2')}</span><br />
              {t('landing.title3')}
            </h1>
            <p className="text-lg md:text-xl text-default-500 max-w-2xl mx-auto leading-relaxed">
              {t('landing.description')}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button
              size="lg"
              color="primary"
              variant="shadow"
              className="px-10 py-6 text-lg font-semibold"
              isLoading={loading}
              onPress={handleCTA}
            >
              {user ? t('landing.cta_dashboard') : t('landing.cta_start')}
            </Button>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="mt-32">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold">{t('landing.features_title')}</h2>
            <p className="text-default-500 mt-4 text-lg">{t('landing.features_subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border-none bg-default-50/50 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow h-full">
                  <CardBody className="p-8 text-center flex flex-col items-center">
                    <div className="text-5xl mb-6 bg-default-100 w-20 h-20 rounded-full flex items-center justify-center shadow-inner">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-default-500 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Ad Banner Section */}
        <div className="mt-20">
          <AdBanner />
        </div>
      </main>
    </div>
  );
}