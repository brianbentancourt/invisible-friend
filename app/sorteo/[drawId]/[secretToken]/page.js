import { adminDb } from '@/config/firebase-admin';
import RevealCard from '@/components/RevealCard';

export default async function SorteoRevealPage({ params }) {
  const { drawId, secretToken } = params;

  try {
    const drawDoc = await adminDb.collection('draws').doc(drawId).get();

    if (!drawDoc.exists) {
      return (
        <div className="min-h-screen flex items-center justify-center text-center p-4">
          <div>
            <h1 className="text-3xl font-bold text-danger mb-4">Sorteo no encontrado</h1>
            <p className="text-default-500">El enlace parece ser inválido o el sorteo fue eliminado.</p>
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
            <h1 className="text-3xl font-bold text-danger mb-4">Enlace Inválido</h1>
            <p className="text-default-500">Este enlace mágico es incorrecto o ha caducado.</p>
          </div>
        </div>
      );
    }

    const { giver, receiver } = assignment;

    return (
      <div className="min-h-screen bg-background pt-20 px-4">
        <RevealCard giverName={giver.name} receiverName={receiver.name} />
      </div>
    );

  } catch (error) {
    console.error('Error fetching draw:', error);
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-4">
        <div>
          <h1 className="text-3xl font-bold text-danger mb-4">Error del servidor</h1>
          <p className="text-default-500">Hubo un problema al cargar el sorteo. Inténtalo más tarde.</p>
        </div>
      </div>
    );
  }
}
