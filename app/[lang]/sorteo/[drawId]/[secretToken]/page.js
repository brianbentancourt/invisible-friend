import { adminDb } from '@/config/firebase-admin';
import RevealCard from '@/components/RevealCard';
import DonationButton from '@/components/DonationButton';
import AdBanner from '@/components/AdBanner';
import en from '@/messages/en.json';
import es from '@/messages/es.json';

export default async function SorteoRevealPage({ params }) {
  const { drawId, secretToken, lang } = params;
  const dict = lang === 'en' ? en : es;

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
      <div className="min-h-screen bg-background pt-10 px-4 flex flex-col items-center">
        <AdBanner />
        
        <div className="flex-1 w-full flex items-center justify-center">
          <RevealCard giverName={giver.name} receiverName={receiver.name} />
        </div>

        <div className="mb-10 text-center">
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
