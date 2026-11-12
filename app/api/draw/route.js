import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminDb } from '@/config/firebase-admin';
import { getDictionary } from '@/lib/i18n';
import { localeFromParam, FREE_PARTICIPANT_LIMIT } from '@/config/site';
import { getSession } from '@/lib/auth';
import {
    sendEmail,
    sendWhatsApp,
    sendSMS,
    buildRevealUrl,
    buildEmailHtml,
} from '@/lib/notifications';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'brianbentancourt9@gmail.com')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

function generateLogContent(assignments) {
    const contactInfo = (p) => p.email || p.phone || (p.telegram ? `@${p.telegram.replace(/^@/, '')}` : 'Sin contacto');
    const logContent = assignments
        .map(({ giver, receiver }) => `${giver.name} (${contactInfo(giver)}) -> ${receiver.name} (${contactInfo(receiver)})`)
        .join('\n');

    return (
        `Sorteo Amigo Invisible - ${new Date().toLocaleString()}\n` +
        '================================================\n' +
        logContent +
        '\n\n' +
        `Total participantes: ${assignments.length}\n` +
        '================================================\n'
    );
}

function generateValidAssignments(participants) {
    const n = participants.length;
    if (n < 2) return null;

    // Backtracking con heurística Most Constrained Variable (quien tiene más exclusiones va primero)
    // y barajado aleatorio para garantizar una distribución equiprobable y sin bloqueos.
    for (let attempt = 0; attempt < 30; attempt++) {
        const givers = participants.map((p, idx) => ({ ...p, originalIndex: idx }));
        
        // Ordenar por cantidad de exclusiones descendente + pequeño ruido aleatorio
        givers.sort((a, b) => ((b.exclusions?.length || 0) - (a.exclusions?.length || 0)) || (Math.random() - 0.5));

        const assignedReceivers = new Set();
        const assignments = new Array(n);

        function backtrack(idx) {
            if (idx === n) return true;

            const giver = givers[idx];
            const exclusions = new Set(giver.exclusions || []);

            let candidates = participants
                .map((p, i) => i)
                .filter((i) => {
                    const receiver = participants[i];
                    return receiver.id !== giver.id && !exclusions.has(receiver.id) && !assignedReceivers.has(i);
                });

            // Barajar candidatos aleatoriamente
            for (let i = candidates.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
            }

            for (const candIdx of candidates) {
                assignedReceivers.add(candIdx);
                assignments[giver.originalIndex] = participants[candIdx];

                if (backtrack(idx + 1)) return true;

                assignedReceivers.delete(candIdx);
            }

            return false;
        }

        if (backtrack(0)) {
            return participants.map((giver, idx) => ({
                giver,
                receiver: assignments[idx],
            }));
        }
    }

    throw new Error('No se pudo generar una asignación válida con las exclusiones actuales');
}

export async function POST(request) {
    try {
        const session = await getSession(request);
        const { participants, lang, event } = await request.json();
        const locale = localeFromParam(lang);
        const dict = getDictionary(locale);

        if (!Array.isArray(participants) || participants.length < 2) {
            return NextResponse.json({ error: dict.dashboard.errors.min_participants }, { status: 400 });
        }

        // El sorteo requiere sesión autenticada verificada por token
        if (!session?.email) {
            return NextResponse.json({ error: dict.dashboard.login_required }, { status: 401 });
        }

        const userEmail = session.email;

        // Verificar estado Premium
        let isPremium = ADMIN_EMAILS.includes(userEmail.toLowerCase());

        if (!isPremium) {
            const userDoc = await adminDb.collection('users').doc(userEmail).get();
            if (userDoc.exists && userDoc.data().isPremium) {
                isPremium = true;
            }
        }

        if (!isPremium && participants.length > FREE_PARTICIPANT_LIMIT) {
            return NextResponse.json(
                {
                    error: dict.dashboard.limit_reached.replace('{limit}', FREE_PARTICIPANT_LIMIT),
                    upgradeRequired: true,
                },
                { status: 403 }
            );
        }

        // Realizar el sorteo
        const assignments = generateValidAssignments(participants);

        if (!assignments) {
            return NextResponse.json({ error: dict.dashboard.errors.draw_error }, { status: 500 });
        }

        // Reservamos el id del sorteo antes de notificar: los mensajes llevan el
        // enlace secreto, así que necesitamos la URL definitiva desde el principio.
        const drawRef = adminDb.collection('draws').doc();
        const drawId = drawRef.id;

        // Generar el log en texto (sólo para el organizador que lo descarga)
        const fullLog = generateLogContent(assignments);

        const results = await Promise.all(
            assignments.map(async ({ giver, receiver }) => {
                const secretToken = crypto.randomUUID();
                const url = buildRevealUrl({ locale, drawId, secretToken });

                // El mensaje lleva el enlace en lugar del nombre del destinatario:
                // así la sorpresa se mantiene aunque alguien vea la notificación
                // por encima del hombro, y el participante pasa por la página de
                // revelación (con lista de deseos e ideas de regalo).
                const subject = dict.api.email_subject;
                const message = dict.api.email_link_message
                    .replace('{giver}', giver.name)
                    .replace('{url}', url);

                const html = buildEmailHtml({
                    text: message,
                    url,
                    ctaLabel: dict.reveal.reveal_btn,
                });

                const [emailSuccess, waSuccess, smsSuccess] = await Promise.all([
                    giver.email ? sendEmail(giver.email, subject, message, html) : Promise.resolve(null),
                    isPremium && giver.phone ? sendWhatsApp(giver.phone, message) : Promise.resolve(null),
                    isPremium && giver.phone ? sendSMS(giver.phone, message) : Promise.resolve(null),
                ]);

                return {
                    giver,
                    receiver,
                    secretToken,
                    status: {
                        email: emailSuccess,
                        whatsapp: waSuccess,
                        sms: smsSuccess,
                    },
                };
            })
        );

        const drawData = {
            id: drawId,
            timestamp: new Date().toISOString(),
            organizerEmail: userEmail,
            locale,
            // Los detalles del evento se muestran en la página de revelación.
            event: event
                ? {
                      name: event.name || '',
                      date: event.date || '',
                      budget: event.budget || '',
                      message: isPremium ? event.message || '' : '',
                  }
                : null,
            results,
        };

        try {
            await drawRef.set(drawData);
        } catch (dbError) {
            console.error('Error guardando en Firestore:', dbError);
            return NextResponse.json({ error: dict.dashboard.errors.draw_error }, { status: 500 });
        }

        // Retornar resultados al frontend (sin revelar receptor, pero con el token
        // para que el organizador pueda compartir el enlace manualmente)
        const frontendResults = results.map(({ giver, status, secretToken }) => ({
            participant: giver,
            status,
            secretToken,
        }));

        return NextResponse.json({
            success: true,
            message: 'Sorteo realizado y notificaciones enviadas',
            logContent: fullLog,
            drawId,
            results: frontendResults,
        });
    } catch (error) {
        console.error('Error en el sorteo:', error);
        return NextResponse.json({ error: error.message || 'Error al realizar el sorteo' }, { status: 500 });
    }
}
