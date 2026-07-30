import { Inter } from 'next/font/google';
import { Providers } from '@/app/providers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@/app/globals.css';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/components/LanguageProvider';
import { GoogleAdSense } from '@next/third-parties/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Amigo Invisible',
  description: 'Sistema de sorteo para amigo invisible',
};

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
        <GoogleAdSense publisherId={process.env.NEXT_PUBLIC_ADSENSE_PUB_ID} />
      )}
    </html>
  );
}