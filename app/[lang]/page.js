import LandingContent from '@/components/LandingContent';
import JsonLd from '@/components/JsonLd';
import { getDictionary } from '@/lib/i18n';
import { faqSchema } from '@/lib/schema';
import { localeFromParam } from '@/config/site';

export default async function LandingPage({ params }) {
  const { lang } = await params;
  const locale = localeFromParam(lang);
  const dict = getDictionary(locale);

  return (
    <>
      {/* Las FAQ de la home se envían como datos estructurados: es lo que
          habilita el acordeón de preguntas en los resultados de Google. */}
      <JsonLd data={faqSchema(dict.faq_home)} />
      <LandingContent />
    </>
  );
}
