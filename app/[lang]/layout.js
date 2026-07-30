import { Inter } from 'next/font/google';
import { Providers } from '@/app/providers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@/app/globals.css';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/components/LanguageProvider';
import Script from 'next/script';

import en from '@/messages/en.json';
import es from '@/messages/es.json';

const inter = Inter({ subsets: ['latin'] });

export async function generateMetadata({ params }) {
  const { lang } = params;
  const dict = lang === 'en' ? en : es;

  return {
    title: dict.seo.title,
    description: dict.seo.description,
    keywords: dict.seo.keywords,
    openGraph: {
      title: dict.seo.title,
      description: dict.seo.description,
      type: 'website',
      url: 'https://amigoinvisible.brianbentancourt.com',
      siteName: 'Amigo Invisible',
      images: [
        {
          url: 'https://amigoinvisible.brianbentancourt.com/og-image.png', // Añadiremos una imagen genérica después o el usuario
          width: 1200,
          height: 630,
          alt: dict.seo.title,
        }
      ],
      locale: lang === 'en' ? 'en_US' : 'es_ES',
      alternateLocales: ['es_ES', 'en_US'],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.seo.title,
      description: dict.seo.description,
      images: ['https://amigoinvisible.brianbentancourt.com/og-image.png'],
    },
    alternates: {
      canonical: `https://amigoinvisible.brianbentancourt.com/${lang}`,
      languages: {
        'es': 'https://amigoinvisible.brianbentancourt.com/es',
        'en': 'https://amigoinvisible.brianbentancourt.com/en',
      },
    },
    ...(process.env.NEXT_PUBLIC_ADSENSE_PUB_ID && {
      other: {
        'google-adsense-account': process.env.NEXT_PUBLIC_ADSENSE_PUB_ID,
      }
    })
  };
}

export default function RootLayout({ children, params }) {
  const locale = params.lang || 'es';

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="dark text-foreground bg-background">
        <Providers>
          <LanguageProvider initialLocale={locale}>
            <Navbar />
            {children}
            <ToastContainer />
            <Footer />
          </LanguageProvider>
        </Providers>
      </body>
      {process.env.NEXT_PUBLIC_ADSENSE_PUB_ID && (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUB_ID}`}
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      )}
    </html>
  );
}