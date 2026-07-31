import { ImageResponse } from 'next/og';
import { getDictionary } from '@/lib/i18n';
import { localeFromParam } from '@/config/site';

// El runtime edge evita el bug de resolución de rutas de @vercel/og al
// prerenderizar en Windows y además genera la imagen más rápido.
export const runtime = 'edge';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Amigo Invisible - Sorteo online gratis';

/**
 * Imagen que se ve al compartir el enlace en WhatsApp, Facebook o X.
 * Se genera en tiempo de build: antes apuntábamos a un /og-image.png que no existía.
 */
export default async function OpengraphImage({ params }) {
    const { lang } = await params;
    const locale = localeFromParam(lang);
    const dict = getDictionary(locale);

    const title = dict.landing.title2;
    // La descripción completa desbordaba la tarjeta: recortamos a una línea corta.
    const subtitle = dict.landing.description.split('.')[0] + '.';
    const badge = dict.landing.no_signup;

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    padding: '80px',
                    background: 'linear-gradient(135deg, #0b0b12 0%, #17102b 55%, #2a1240 100%)',
                    color: 'white',
                    fontFamily: 'sans-serif',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
                    <div style={{ fontSize: 72 }}>🎁</div>
                    <div style={{ fontSize: 34, color: '#c4b5fd', letterSpacing: -0.5 }}>
                        amigoinvisible.brianbentancourt.com
                    </div>
                </div>

                <div
                    style={{
                        fontSize: 84,
                        fontWeight: 800,
                        lineHeight: 1.05,
                        letterSpacing: -2,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <span>{title}</span>
                    <span style={{ color: '#a78bfa' }}>{dict.landing.title3}</span>
                </div>

                <div
                    style={{
                        fontSize: 30,
                        color: '#b6b6c8',
                        marginTop: 28,
                        maxWidth: 940,
                        lineHeight: 1.35,
                        display: 'flex',
                    }}
                >
                    {subtitle}
                </div>

                <div
                    style={{
                        marginTop: 36,
                        fontSize: 26,
                        color: '#e9d5ff',
                        background: 'rgba(167,139,250,0.16)',
                        border: '1px solid rgba(167,139,250,0.35)',
                        padding: '16px 28px',
                        borderRadius: 999,
                        display: 'flex',
                        alignSelf: 'flex-start',
                    }}
                >
                    {badge}
                </div>
            </div>
        ),
        size
    );
}
