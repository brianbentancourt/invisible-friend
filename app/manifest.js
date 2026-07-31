import { SITE_NAME } from '@/config/site';

/**
 * Manifest PWA: permite "añadir a pantalla de inicio" y es una señal más
 * de sitio bien construido para las auditorías de Lighthouse.
 */
export default function manifest() {
    return {
        name: `${SITE_NAME} - Sorteo online gratis`,
        short_name: SITE_NAME,
        description:
            'Organiza tu sorteo de Amigo Invisible online: participantes, exclusiones y notificaciones automáticas por email y WhatsApp.',
        start_url: '/es',
        display: 'standalone',
        background_color: '#0b0b12',
        theme_color: '#7c3aed',
        orientation: 'portrait',
        categories: ['lifestyle', 'utilities', 'social'],
        icons: [
            {
                src: '/icon.svg',
                sizes: 'any',
                type: 'image/svg+xml',
                purpose: 'any',
            },
            {
                src: '/favicon.ico',
                sizes: '48x48',
                type: 'image/x-icon',
            },
        ],
    };
}
