import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';
import Navbar from '@/components/NavBar';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Amigo Invisible',
  description: 'Sistema de sorteo para amigo invisible',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="dark text-foreground bg-background">
        <Providers>
          <Navbar />
          {children}
          <ToastContainer />
          <Footer />
        </Providers>
      </body>
    </html>
  );
}