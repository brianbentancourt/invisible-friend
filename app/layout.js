import { Inter } from 'next/font/google';
import { Providers } from "./providers";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  return (
    <html lang="es" className='light'>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
        <ToastContainer />
      </body>
    </html>
  );
}