import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminDb } from '@/config/firebase-admin';
import { getDictionary } from '@/lib/i18n';
import { localeFromParam, FREE_PARTICIPANT_LIMIT } from '@/config/site';
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
    const logContent = assignments
        .map(({ giver, receiver }) => `${giver.name} (${giver.email}) -> ${receiver.name} (${receiver.email})`)
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

    let attempts = 0;
    const maxAttempts = 100; // Evitar bucle infinito

    while (attempts < maxAttempts) {
        attempts++;

        let availableReceivers = Array.from({ length: n }, (_, i) => i);
        let assignments = new Array(n).fill(-1);
        let success = true;

        for (let giver = 0; giver < n; giver++) {
            const giverParticipant = participants[giver];
            const giverExclusions = giverParticipant.exclusions || [];

            let validReceivers = availableReceivers.filter((r) => {
                const receiverParticipant = participants[r];
                const isSelf = r === giver;
                const isExcluded = giverExclusions.includes(receiverParticipant.id);
                return !isSelf && !isExcluded;
            });

            if (validReceivers.length === 0) {
                success = false;
                break;
            }

            const randomIndex = Math.floor(Math.random() * validReceivers.length);
            const receiver = validReceivers[randomIndex];

            assignments[giver] = receiver;
            availableReceivers = availableReceivers.filter((r) => r !== receiver);
        }

        if (success) {
            // No forzamos un ciclo único: con muchas exclusiones puede ser imposible.
            // Con success === true ya está garantizado que todos regalan y reciben.
            return assignments.map((receiverIndex, giverIndex) => ({
                giver: participants[giverIndex],
                receiver: participants[receiverIndex],
            }));
        }
    }

    throw new Error('No se pudo generar una asignación válida después de varios intentos');
}

export async function POST(request) {
    try {
        const { participants, userEmail, lang, event } = await request.json();
        const locale = localeFromParam(lang);
        const dict = getDictionary(locale);

        if (!Array.isArray(participants) || participants.length < 2) {
            return NextResponse.json({ error: dict.dashboard.errors.min_participants }, { status: 400 });
        }

        // El sorteo requiere sesión: es lo que nos permite enviar las
        // notificaciones y asociar el resultado a una cuenta.
        if (!userEmail) {
            return NextResponse.json({ error: dict.dashboard.login_required }, { status: 401 });
        }

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
                    sendEmail(giver.email, subject, message, html),
                    sendWhatsApp(giver.phone, message),
                    isPremium ? sendSMS(giver.phone, message) : Promise.resolve(false),
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
            // El sorteo ya se envió; no lo abortamos, pero sin persistencia
            // los enlaces no funcionarían, así que lo reportamos.
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
        return NextResponse.json({ error: 'Error al realizar el sorteo' }, { status: 500 });
    }
}
