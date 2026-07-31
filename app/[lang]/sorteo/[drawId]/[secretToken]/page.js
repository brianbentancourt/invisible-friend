import { headers } from 'next/headers';
import { adminDb } from '@/config/firebase-admin';
import RevealCard from '@/components/RevealCard';
import DonationButton from '@/components/DonationButton';
import { getDictionary } from '@/lib/i18n';
import { localeFromParam } from '@/config/site';

// Página privada: nunca debe aparecer en buscadores.
export const metadata = {
  robots: { index: false, follow: false },
};

export default async function SorteoRevealPage({ params }) {
  const { drawId, secretToken, lang } = await params;
  const locale = localeFromParam(lang);
  const dict = getDictionary(locale);

  // Vercel expone el país del visitante; con eso elegimos tiendas donde
  // realmente pueda comprar, en vez de deducirlo del idioma.
  const country = (await headers()).get('x-vercel-ip-country') || '';

  try {
    const drawDoc = await adminDb.collection('draws').doc(drawId).get();

    if (!drawDoc.exists) {
      return (
        <div className="min-h-screen flex items-center justify-center text-center p-4">
          <div>
            <h1 className="text-3xl font-bold text-danger mb-4">{dict.reveal.not_found_title}</h1>
            <p className="text-default-500">{dict.reveal.not_found_desc}</p>
          </div>
        </div>
      );
    }

    const drawData = drawDoc.data();
    const results = drawData.results || [];

    // Buscar el resultado que coincida con el secretToken
    const assignment = results.find(r => r.secretToken === secretToken);

    if (!assignment) {
      return (
        <div className="min-h-screen flex items-center justify-center text-center p-4">
          <div>
            <h1 className="text-3xl font-bold text-danger mb-4">{dict.reveal.invalid_link}</h1>
            <p className="text-default-500">{dict.reveal.invalid_desc}</p>
          </div>
        </div>
      );
    }

    const { giver, receiver } = assignment;

    return (
      <div className="min-h-screen bg-background pt-12 px-4 flex flex-col items-center">
        <div className="flex-1 w-full flex items-start justify-center">
          <RevealCard
            giverName={giver.name}
            receiverName={receiver.name}
            wishlist={receiver.wishlist || ''}
            event={drawData.event || null}
            country={country}
          />
        </div>

        <div className="mb-16 text-center">
          <p className="text-default-500 mb-4 text-sm">{dict.reveal.donation_prompt}</p>
          <DonationButton />
        </div>
      </div>
    );

  } catch (error) {
    console.error('Error fetching draw:', error);
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-4">
        <div>
          <h1 className="text-3xl font-bold text-danger mb-4">{dict.reveal.server_error}</h1>
          <p className="text-default-500">{dict.reveal.server_error_desc}</p>
        </div>
      </div>
    );
  }
}
