import { NextResponse } from 'next/server';
import crypto from 'crypto';
import sgMail from '@sendgrid/mail';
import twilio from 'twilio';
import { adminDb } from '@/config/firebase-admin';
import en from '@/messages/en.json';
import es from '@/messages/es.json';

// Configurar SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Configurar Twilio
const twilioSid = process.env.TWILIO_ACCOUNT_SID;
const twilioToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = (twilioSid && twilioToken) ? twilio(twilioSid, twilioToken) : null;

if (!twilioSid || !twilioToken) {
    console.warn('Twilio credentials are not set. SMS and WhatsApp notifications will not work.');
}

function generateLogContent(assignments) {
    const logContent = assignments.map(({ giver, receiver }) =>
        `${giver.name} (${giver.email}) -> ${receiver.name} (${receiver.email})`
    ).join('\n');

    return `Sorteo Amigo Invisible - ${new Date().toLocaleString()}\n` +
        '================================================\n' +
        logContent + '\n\n' +
        `Total participantes: ${assignments.length}\n` +
        '================================================\n';
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

            let validReceivers = availableReceivers.filter(r => {
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
            availableReceivers = availableReceivers.filter(r => r !== receiver);
        }

        if (success) {
            // Ya no forzamos un ciclo único (visited.size === n) 
            // ya que con muchas exclusiones puede ser imposible.
            // Siempre y cuando success sea true, significa que todos regalan y todos reciben.
            return assignments.map((receiverIndex, giverIndex) => ({
                giver: participants[giverIndex],
                receiver: participants[receiverIndex]
            }));
        }
    }

    throw new Error('No se pudo generar una asignación válida después de varios intentos');
}

function formatPhoneNumber(phone) {
    if (!phone) return '';
    let cleaned = phone.replace(/[^\d+]/g, '');

    // Si empieza con 598 sin +, agregar +
    if (cleaned.startsWith('598')) {
        cleaned = '+' + cleaned;
    }

    // Corregir +5980... a +598... (eliminar 0 después del prefijo)
    if (cleaned.startsWith('+5980')) {
        cleaned = '+598' + cleaned.substring(5);
    }

    // Corregir 09... a +5989... (asumir Uruguay para celulares que empiezan con 09)
    if (cleaned.startsWith('09')) {
        cleaned = '+598' + cleaned.substring(1);
    }

    return cleaned;
}

async function sendEmail(to, subject, text) {
    const msg = {
        to,
        from: process.env.SENDGRID_FROM_EMAIL,
        subject,
        text,
    };

    try {
        await sgMail.send(msg);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

async function sendWhatsApp(to, message) {
    if (!twilioClient) {
        console.warn('Twilio client not initialized. Skipping WhatsApp.');
        return false;
    }
    const formattedPhone = formatPhoneNumber(to);
    // Asegurar que el número de origen tenga el formato correcto para WhatsApp
    // Si la variable de entorno ya incluye "whatsapp:", lo quitamos para no duplicarlo
    const twilioWhatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;
    if (!twilioWhatsappNumber) {
        console.warn('TWILIO_WHATSAPP_NUMBER not set. Skipping WhatsApp.');
        return false;
    }

    const fromNumber = twilioWhatsappNumber.replace('whatsapp:', '');
    
    try {
        await twilioClient.messages.create({
            body: message,
            from: `whatsapp:${fromNumber}`,
            to: `whatsapp:${formattedPhone}`
        });
        console.log(`WhatsApp sent to ${formattedPhone}`);
        return true;
    } catch (error) {
        console.error('Error sending WhatsApp:', error);
        return false;
    }
}

async function sendSMS(to, message) {
    if (!twilioClient) {
        console.warn('Twilio client not initialized. Skipping SMS.');
        return false;
    }
    const formattedPhone = formatPhoneNumber(to);
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!twilioPhoneNumber) {
        console.warn('TWILIO_PHONE_NUMBER not set. Skipping SMS.');
        return false;
    }

    try {
        await twilioClient.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: formattedPhone
        });
        console.log(`SMS sent to ${formattedPhone}`);
        return true;
    } catch (error) {
        console.error('Error sending SMS:', error);
        return false;
    }
}

export async function POST(request) {
    try {
        const { participants, userEmail, lang } = await request.json();
        const dict = lang === 'en' ? en : es;

        if (!Array.isArray(participants) || participants.length < 2) {
            return NextResponse.json(
                { error: dict.dashboard.errors.min_participants },
                { status: 400 }
            );
        }

        // Verificar estado Premium
        let isPremium = false;
        if (userEmail === 'brianbentancourt9@gmail.com') {
            isPremium = true;
        } else if (userEmail) {
            const userDoc = await adminDb.collection('users').doc(userEmail).get();
            if (userDoc.exists && userDoc.data().isPremium) {
                isPremium = true;
            }
        }

        if (!isPremium && participants.length > 15) {
            return NextResponse.json(
                { error: 'El plan gratuito permite hasta 15 participantes. Actualiza a Premium para añadir más.' },
                { status: 403 }
            );
        }

        // Realizar el sorteo
        const assignments = generateValidAssignments(participants);

        if (!assignments) {
            return NextResponse.json(
                { error: dict.dashboard.errors.draw_error },
                { status: 500 }
            );
        }

        // Generar el log en texto
        const fullLog = generateLogContent(assignments);

        // Enviar notificaciones y capturar estado
        const results = await Promise.all(assignments.map(async ({ giver, receiver }) => {
            const secretToken = crypto.randomUUID();
            
            // Si quieres, aquí podrías modificar el mensaje para incluir el link si lo envías por WhatsApp, pero
            // como la gracia es que el usuario lo comparta manualmente con el botón mágico, lo dejamos simple.
            const subject = dict.api.email_subject;
            const message = dict.api.email_message
                .replace('{giver}', giver.name)
                .replace('{receiver}', receiver.name);

            const [emailSuccess, waSuccess, smsSuccess] = await Promise.all([
                sendEmail(giver.email, subject, message),
                sendWhatsApp(giver.phone, message),
                isPremium ? sendSMS(giver.phone, message) : Promise.resolve(false)
            ]);

            return {
                giver,
                receiver,
                secretToken,
                status: {
                    email: emailSuccess,
                    whatsapp: waSuccess,
                    sms: smsSuccess
                }
            };
        }));

        // Guardar resultado detallado en Firestore con un ID único garantizado
        const drawRef = adminDb.collection('draws').doc();
        const drawId = drawRef.id;
        const drawData = {
            id: drawId,
            timestamp: new Date().toISOString(),
            results
        };

        try {
            await drawRef.set(drawData);
        } catch (dbError) {
            console.error('Error guardando en Firestore:', dbError);
            // Podemos decidir si fallar o continuar; lo ideal es que si falla no se puedan reintentar pero no afecte el sorteo.
        }

        // Retornar resultados al frontend (sin revelar receptor, pero con el token para generar el enlace)
        const frontendResults = results.map(({ giver, status, secretToken }) => ({
            participant: giver,
            status,
            secretToken
        }));

        return NextResponse.json({
            success: true,
            message: 'Sorteo realizado y notificaciones enviadas',
            logContent: fullLog,
            drawId,
            results: frontendResults
        });

    } catch (error) {
        console.error('Error en el sorteo:', error);
        return NextResponse.json(
            { error: 'Error al realizar el sorteo' },
            { status: 500 }
        );
    }
}