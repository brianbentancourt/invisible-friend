import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import twilio from 'twilio';
import { adminDb } from '@/config/firebase-admin';

// Configurar SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Configurar Twilio
const twilioSid = process.env.TWILIO_ACCOUNT_SID;
const twilioToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = (twilioSid && twilioToken) ? twilio(twilioSid, twilioToken) : null;

function formatPhoneNumber(phone) {
    if (!phone) return '';
    let cleaned = phone.replace(/[^\d+]/g, '');

    // Si empieza con 598 sin +, agregar +
    if (cleaned.startsWith('598')) {
        cleaned = '+' + cleaned;
    }

    // Corregir +5980... a +598...
    if (cleaned.startsWith('+5980')) {
        cleaned = '+598' + cleaned.substring(5);
    }

    // Corregir 09... a +5989...
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
    if (!twilioClient) return false;
    const formattedPhone = formatPhoneNumber(to);
    const twilioWhatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;
    if (!twilioWhatsappNumber) return false;

    const fromNumber = twilioWhatsappNumber.replace('whatsapp:', '');
    
    try {
        await twilioClient.messages.create({
            body: message,
            from: `whatsapp:${fromNumber}`,
            to: `whatsapp:${formattedPhone}`
        });
        return true;
    } catch (error) {
        console.error('Error sending WhatsApp:', error);
        return false;
    }
}

async function sendSMS(to, message) {
    if (!twilioClient) return false;
    const formattedPhone = formatPhoneNumber(to);
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    if (!twilioPhoneNumber) return false;

    try {
        await twilioClient.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: formattedPhone
        });
        return true;
    } catch (error) {
        console.error('Error sending SMS:', error);
        return false;
    }
}

export async function POST(request) {
    try {
        const { drawId, participantEmail } = await request.json();

        if (!drawId || !participantEmail) {
            return NextResponse.json({ error: 'Missing drawId or participantEmail' }, { status: 400 });
        }

        const drawRef = adminDb.collection('draws').doc(drawId);
        const doc = await drawRef.get();
        
        if (!doc.exists) {
            return NextResponse.json({ error: 'Draw not found' }, { status: 404 });
        }

        const drawData = doc.data();

        const participantEntryIndex = drawData.results.findIndex(r => r.giver.email === participantEmail);

        if (participantEntryIndex === -1) {
            return NextResponse.json({ error: 'Participant not found in this draw' }, { status: 404 });
        }

        const entry = drawData.results[participantEntryIndex];
        const { giver, receiver } = entry;
        const message = `Hola ${giver.name}! En el sorteo del amigo invisible te ha tocado regalar a: ${receiver.name}`;

        // Retry all notifications that failed OR force retry all? 
        // The user asked "reintentar enviarle la notificacion". 
        // Usually implies trying again. Let's try all channels again for robustness, 
        // or just the ones that are false?
        // If I retry all, I might spam. Let's retry only if status is false.
        
        const currentStatus = entry.status;
        
        const newStatus = { ...currentStatus };

        // Retry Email if failed
        if (!currentStatus.email) {
            newStatus.email = await sendEmail(giver.email, 'Tu Amigo Invisible', message);
        }

        // Retry WhatsApp if failed
        if (!currentStatus.whatsapp) {
            newStatus.whatsapp = await sendWhatsApp(giver.phone, message);
        }

        // Retry SMS if failed
        if (!currentStatus.sms) {
            newStatus.sms = await sendSMS(giver.phone, message);
        }

        // Update the entry
        drawData.results[participantEntryIndex].status = newStatus;

        // Save back to Firestore
        await drawRef.update({ results: drawData.results });

        return NextResponse.json({
            success: true,
            status: newStatus
        });

    } catch (error) {
        console.error('Error retrying notification:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
