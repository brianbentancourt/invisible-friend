'use client';

import { sendGAEvent } from '@next/third-parties/google';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Envía un evento a GA4. Si no hay medición configurada no hace nada,
 * así que se puede llamar sin condicionales en los componentes.
 */
export function track(event, params = {}) {
    if (!GA_ID || typeof window === 'undefined') return;

    try {
        sendGAEvent('event', event, params);
    } catch (error) {
        // La analítica nunca debe romper un flujo de negocio.
        console.debug('No se pudo enviar el evento de analítica:', error);
    }
}

/** Eventos del embudo, centralizados para que no se dupliquen nombres. */
export const EVENTS = {
    CTA_CLICK: 'cta_click',
    SIGNUP_START: 'signup_start',
    PARTICIPANT_ADDED: 'participant_added',
    DRAW_COMPLETED: 'draw_completed',
    UPGRADE_CLICK: 'upgrade_click',
    CHECKOUT_STARTED: 'checkout_started',
    REVEAL_OPENED: 'reveal_opened',
    REVEAL_REVEALED: 'reveal_revealed',
    GIFT_IDEA_CLICK: 'gift_idea_click',
    VIRAL_CTA_CLICK: 'viral_cta_click',
    SHARE_CLICK: 'share_click',
    DONATION_CLICK: 'donation_click',
};
