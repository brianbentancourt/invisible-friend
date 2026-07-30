'use client';

import { useEffect } from 'react';

export default function AdBanner() {
  const pubId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;

  // Si existe el ID de publicador, intentamos inyectar el bloque de anuncios nativo
  useEffect(() => {
    if (pubId && typeof window !== 'undefined') {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('Error cargando anuncio de AdSense:', e);
      }
    }
  }, [pubId]);

  if (pubId) {
    return (
      <div className="w-full max-w-4xl mx-auto my-8 flex items-center justify-center min-h-[100px] overflow-hidden">
        <ins
          className="adsbygoogle w-full"
          style={{ display: 'block' }}
          data-ad-client={pubId}
          data-ad-slot="TU_ID_DE_BLOQUE_AQUI" // El usuario debe reemplazar esto luego
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Placeholder para desarrollo o si no hay pubId
  return (
    <div className="w-full max-w-4xl mx-auto my-8 p-4 bg-default-100/50 border border-default-200 border-dashed rounded-xl flex items-center justify-center min-h-[100px] text-default-400">
      <span className="text-sm tracking-widest uppercase">Espacio Publicitario</span>
    </div>
  );
}
