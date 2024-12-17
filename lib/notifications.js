import sgMail from '@sendgrid/mail';
import twilio from 'twilio';

// Configurar SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Configurar Twilio
const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

export async function sendEmail(to, subject, text) {
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

export async function sendWhatsApp(to, message) {
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

export async function sendSMS(to, message) {
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