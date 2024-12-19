import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import twilio from 'twilio';
import fs from 'fs/promises';
import path from 'path';

// Configurar SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Configurar Twilio
const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

async function logAssignments(assignments) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const logFileName = `sorteo-${timestamp}.log`;
    const logPath = path.join(process.cwd(), 'logs', logFileName);

    // Crear el directorio logs si no existe
    await fs.mkdir(path.join(process.cwd(), 'logs'), { recursive: true });

    // Generar el contenido del log
    const logContent = assignments.map(({ giver, receiver }) =>
        `${giver.name} (${giver.email}) -> ${receiver.name} (${receiver.email})`
    ).join('\n');

    const fullLog = `Sorteo Amigo Invisible - ${new Date().toLocaleString()}\n` +
        '================================================\n' +
        logContent + '\n\n' +
        `Total participantes: ${assignments.length}\n` +
        '================================================\n';

    // Escribir el archivo
    await fs.writeFile(logPath, fullLog, 'utf8');
    return logPath;
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
            let validReceivers = availableReceivers.filter(r => r !== giver);

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
            let current = 0;
            let visited = new Set();

            while (!visited.has(current)) {
                visited.add(current);
                current = assignments[current];
            }

            if (visited.size === n) {
                return assignments.map((receiverIndex, giverIndex) => ({
                    giver: participants[giverIndex],
                    receiver: participants[receiverIndex]
                }));
            }
        }
    }

    throw new Error('No se pudo generar una asignación válida después de varios intentos');
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
    try {
        await twilioClient.messages.create({
            body: message,
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:${to}`
        });
        return true;
    } catch (error) {
        console.error('Error sending WhatsApp:', error);
        return false;
    }
}

async function sendSMS(to, message) {
    try {
        await twilioClient.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to
        });
        return true;
    } catch (error) {
        console.error('Error sending SMS:', error);
        return false;
    }
}

export async function POST(request) {
    try {
        const { participants } = await request.json();

        if (!Array.isArray(participants) || participants.length < 2) {
            return NextResponse.json(
                { error: 'Se necesitan al menos 2 participantes' },
                { status: 400 }
            );
        }

        // Realizar el sorteo
        const assignments = generateValidAssignments(participants);

        if (!assignments) {
            return NextResponse.json(
                { error: 'No se pudo generar una asignación válida' },
                { status: 500 }
            );
        }

        // Guardar el log
        const logPath = await logAssignments(assignments);

        // Enviar notificaciones
        const notificationPromises = assignments.map(async ({ giver, receiver }) => {
            const message = `Hola ${giver.name}! En el sorteo del amigo invisible te ha tocado regalar a: ${receiver.name}`;

            return Promise.all([
                sendEmail(giver.email, 'Tu Amigo Invisible', message),
                sendWhatsApp(giver.phone, message),
                sendSMS(giver.phone, message)
            ]);
        });

        await Promise.all(notificationPromises);

        return NextResponse.json({
            success: true,
            message: 'Sorteo realizado y notificaciones enviadas con éxito',
            logFile: logPath
        });

    } catch (error) {
        console.error('Error en el sorteo:', error);
        return NextResponse.json(
            { error: 'Error al realizar el sorteo' },
            { status: 500 }
        );
    }
}