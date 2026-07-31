'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import en from '@/messages/en.json';
import es from '@/messages/es.json';
import pt from '@/messages/pt.json';
import { LOCALES, DEFAULT_LOCALE } from '@/config/site';

const dictionaries = { en, es, pt };

const LanguageContext = createContext({
  locale: DEFAULT_LOCALE,
  t: (key) => key,
  changeLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

/**
 * Lee una clave con notación de puntos del diccionario y reemplaza
 * los placeholders del tipo {nombre} con los valores de `vars`.
 */
export function translate(locale, path, vars) {
  const keys = path.split('.');
  let result = dictionaries[locale] || dictionaries[DEFAULT_LOCALE];

  for (const key of keys) {
    if (result?.[key] === undefined) {
      return path;
    }
    result = result[key];
  }

  if (typeof result === 'string' && vars) {
    return Object.entries(vars).reduce(
      (text, [key, value]) => text.replaceAll(`{${key}}`, value),
      result
    );
  }

  return result;
}

export function LanguageProvider({ children, initialLocale = DEFAULT_LOCALE }) {
  const [locale, setLocale] = useState(initialLocale);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Cuando cambie la ruta por navegación en cliente, asegúrate de sincronizar
    // el estado si la URL cambió a otro idioma.
    const pathLocale = pathname.split('/')[1];
    if (LOCALES.includes(pathLocale)) {
      setLocale(pathLocale);
    }
  }, [pathname]);

  const changeLanguage = (newLocale) => {
    if (newLocale === locale || !LOCALES.includes(newLocale)) return;

    // Guardar preferencia en cookie para middleware
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`;

    // Al cambiar de idioma volvemos a la home de ese idioma salvo que estemos
    // en una ruta de app: los slugs de contenido son distintos en cada idioma,
    // así que mantener el path produciría un 404.
    const segments = pathname.split('/').filter(Boolean);
    const appRoutes = ['dashboard', 'auth', 'sorteo'];
    const isAppRoute = appRoutes.includes(segments[1]);

    if (isAppRoute) {
      segments[0] = newLocale;
      router.push(`/${segments.join('/')}`);
    } else {
      router.push(`/${newLocale}`);
    }
  };

  const value = useMemo(
    () => ({
      locale,
      t: (path, vars) => translate(locale, path, vars),
      changeLanguage,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale, pathname]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
