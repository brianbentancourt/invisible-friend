'use client';

import { useEffect } from 'react';

export default function AdBanner() {
  const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;
  const slotId = process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID;

  // Si existe el ID de publicador y el de bloque, intentamos inyectar el bloque de anuncios nativo
  useEffect(() => {
    if (pubId && slotId && typeof window !== 'undefined') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('Error cargando anuncio de AdSense:', e);
      }
    }
  }, [pubId, slotId]);

  // Si el usuario configuró ambos, mostramos el anuncio manual
  if (pubId && slotId) {
    return (
      <div className="w-full max-w-4xl mx-auto my-8 flex items-center justify-center min-h-[100px] overflow-hidden">
        <ins
          className="adsbygoogle w-full"
          style={{ display: 'block' }}
          data-ad-client={pubId}
          data-ad-slot={slotId}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Si solo configuró el PUB_ID, significa que está usando Anuncios Automáticos. 
  // No renderizamos el recuadro manual roto, dejamos que Google auto-ubique los anuncios.
  if (pubId && !slotId) {
    return null;
  }

  // Placeholder para desarrollo o si no hay pubId
  return (
    <div className="w-full max-w-4xl mx-auto my-8 p-4 bg-default-100/50 border border-default-200 border-dashed rounded-xl flex items-center justify-center min-h-[100px] text-default-400">
      <span className="text-sm tracking-widest uppercase">Espacio Publicitario</span>
    </div>
  );
}
