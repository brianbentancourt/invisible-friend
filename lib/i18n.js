import en from '@/messages/en.json';
import es from '@/messages/es.json';
import pt from '@/messages/pt.json';
import { DEFAULT_LOCALE, LOCALES } from '@/config/site';

const dictionaries = { en, es, pt };

/** Diccionario completo para componentes de servidor. */
export function getDictionary(lang) {
    const locale = LOCALES.includes(lang) ? lang : DEFAULT_LOCALE;
    return dictionaries[locale];
}

/** Equivalente en servidor a `t()` del LanguageProvider. */
export function getTranslator(lang) {
    const dict = getDictionary(lang);

    return (path, vars) => {
        const keys = path.split('.');
        let result = dict;

        for (const key of keys) {
            if (result?.[key] === undefined) return path;
            result = result[key];
        }

        if (typeof result === 'string' && vars) {
            return Object.entries(vars).reduce(
                (text, [key, value]) => text.replaceAll(`{${key}}`, value),
                result
            );
        }

        return result;
    };
}
