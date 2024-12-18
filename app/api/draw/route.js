import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import twilio from 'twilio';

// Configurar SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Configurar Twilio
const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

function shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
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
        const shuffled = shuffle(participants);
        const assignments = [];

        for (let i = 0; i < participants.length; i++) {
            assignments.push({
                giver: participants[i],
                receiver: shuffled[i === participants.length - 1 ? 0 : i + 1]
            });
        }

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
            message: 'Sorteo realizado y notificaciones enviadas con éxito'
        });

    } catch (error) {
        console.error('Error en el sorteo:', error);
        return NextResponse.json(
            { error: 'Error al realizar el sorteo' },
            { status: 500 }
        );
    }
}