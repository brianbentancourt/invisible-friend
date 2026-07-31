import { Inter } from 'next/font/google';
import { Providers } from '@/app/providers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@/app/globals.css';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/components/LanguageProvider';
import JsonLd from '@/components/JsonLd';
import Script from 'next/script';
import { GoogleAnalytics } from '@next/third-parties/google';
import { getDictionary } from '@/lib/i18n';
import { organizationSchema, softwareApplicationSchema } from '@/lib/schema';
import {
  SITE_URL,
  SITE_NAME,
  LOCALES,
  HREFLANG,
  OG_LOCALES,
  localeFromParam,
} from '@/config/site';

const inter = Inter({ subsets: ['latin'] });

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const locale = localeFromParam(lang);
  const dict = getDictionary(locale);

  const languages = LOCALES.reduce((acc, loc) => {
    acc[HREFLANG[loc]] = `${SITE_URL}/${loc}`;
    return acc;
  }, {});

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: dict.seo.title,
      template: `%s | ${SITE_NAME}`,
    },
    description: dict.seo.description,
    keywords: dict.seo.keywords,
    applicationName: SITE_NAME,
    authors: [{ name: 'Brian Bentancourt', url: 'https://brianbentancourt.com' }],
    creator: 'Brian Bentancourt',
    // La imagen de compartido la genera app/[lang]/opengraph-image.js:
    // antes se apuntaba a un /og-image.png inexistente y salía un 404.
    openGraph: {
      title: dict.seo.title,
      description: dict.seo.description,
      type: 'website',
      url: `${SITE_URL}/${locale}`,
      siteName: SITE_NAME,
      locale: OG_LOCALES[locale],
      alternateLocale: LOCALES.filter((loc) => loc !== locale).map((loc) => OG_LOCALES[loc]),
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.seo.title,
      description: dict.seo.description,
    },
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        ...languages,
        'x-default': `${SITE_URL}/es`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && {
      verification: {
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      },
    }),
    ...(process.env.NEXT_PUBLIC_ADSENSE_PUB_ID && {
      other: {
        'google-adsense-account': process.env.NEXT_PUBLIC_ADSENSE_PUB_ID,
      },
    }),
  };
}

export const viewport = {
  themeColor: '#7c3aed',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children, params }) {
  const { lang } = await params;
  const locale = localeFromParam(lang);
  const dict = getDictionary(locale);
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang={HREFLANG[locale]} suppressHydrationWarning>
      <body className={`${inter.className} dark text-foreground bg-background`}>
        <JsonLd data={organizationSchema()} />
        <JsonLd
          data={softwareApplicationSchema({
            locale,
            name: dict.seo.title,
            description: dict.seo.description,
          })}
        />
        <Providers>
          <LanguageProvider initialLocale={locale}>
            <Navbar />
            {children}
            <ToastContainer theme="dark" />
            <Footer />
          </LanguageProvider>
        </Providers>
      </body>
      {gaId && <GoogleAnalytics gaId={gaId} />}
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
