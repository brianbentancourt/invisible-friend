'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import en from '@/messages/en.json';
import es from '@/messages/es.json';

const dictionaries = { en, es };

const LanguageContext = createContext({
  locale: 'es',
  t: (key) => key,
  changeLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

export function LanguageProvider({ children, initialLocale = 'es' }) {
  const [locale, setLocale] = useState(initialLocale);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Cuando cambie la ruta por navegación en cliente, asegúrate de sincronizar
    // el estado si la URL cambió a otro idioma.
    const pathLocale = pathname.split('/')[1];
    if (pathLocale === 'en' || pathLocale === 'es') {
      setLocale(pathLocale);
    }
  }, [pathname]);

  const changeLanguage = (newLocale) => {
    if (newLocale === locale) return;
    
    // Guardar preferencia en cookie para middleware
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;
    
    // Redirigir a la nueva ruta
    const pathSegments = pathname.split('/');
    if (pathSegments[1] === 'es' || pathSegments[1] === 'en') {
      pathSegments[1] = newLocale;
    } else {
      pathSegments.splice(1, 0, newLocale); // Insertar si no existía
    }
    
    router.push(pathSegments.join('/'));
  };

  const t = (path) => {
    const keys = path.split('.');
    let result = dictionaries[locale] || dictionaries['es'];
    
    for (const key of keys) {
      if (result[key] === undefined) {
        console.warn(`Translation key not found: ${path}`);
        return path;
      }
      result = result[key];
    }
    return result;
  };

  return (
    <LanguageContext.Provider value={{ locale, t, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
