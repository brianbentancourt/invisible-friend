import sgMail from '@sendgrid/mail';
import twilio from 'twilio';
import { SITE_URL } from '@/config/site';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const twilioSid = process.env.TWILIO_ACCOUNT_SID;
const twilioToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilioSid && twilioToken ? twilio(twilioSid, twilioToken) : null;

if (!twilioSid || !twilioToken) {
    console.warn('Twilio credentials are not set. SMS and WhatsApp notifications will not work.');
}

export function formatPhoneNumber(phone) {
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

/** URL secreta e individual desde la que cada participante ve su asignación. */
export function buildRevealUrl({ locale, drawId, secretToken }) {
    return `${SITE_URL}/${locale}/sorteo/${drawId}/${secretToken}`;
}

export async function sendEmail(to, subject, text, html) {
    if (!to) return false;

    try {
        await sgMail.send({
            to,
            from: process.env.SENDGRID_FROM_EMAIL,
            subject,
            text,
            ...(html && { html }),
        });
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
}

export async function sendWhatsApp(to, message) {
    if (!twilioClient || !to) return false;

    const twilioWhatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER;
    if (!twilioWhatsappNumber) {
        console.warn('TWILIO_WHATSAPP_NUMBER not set. Skipping WhatsApp.');
        return false;
    }

    const formattedPhone = formatPhoneNumber(to);
    const fromNumber = twilioWhatsappNumber.replace('whatsapp:', '');

    try {
        await twilioClient.messages.create({
            body: message,
            from: `whatsapp:${fromNumber}`,
            to: `whatsapp:${formattedPhone}`,
        });
        return true;
    } catch (error) {
        console.error('Error sending WhatsApp:', error);
        return false;
    }
}

export async function sendSMS(to, message) {
    if (!twilioClient || !to) return false;

    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
    if (!twilioPhoneNumber) {
        console.warn('TWILIO_PHONE_NUMBER not set. Skipping SMS.');
        return false;
    }

    const formattedPhone = formatPhoneNumber(to);

    try {
        await twilioClient.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: formattedPhone,
        });
        return true;
    } catch (error) {
        console.error('Error sending SMS:', error);
        return false;
    }
}

/** Versión HTML del aviso, con el enlace como botón. */
export function buildEmailHtml({ text, url, ctaLabel }) {
    const safeText = text.replace(url, '').trim().replace(/\n/g, '<br/>');

    return `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;background:#0b0b12;padding:40px 20px;color:#e8e8f0">
      <div style="max-width:520px;margin:0 auto;background:#14141f;border-radius:20px;padding:40px 32px;text-align:center">
        <div style="font-size:48px;margin-bottom:16px">🎁</div>
        <p style="font-size:16px;line-height:1.6;color:#c9c9d9;margin:0 0 32px">${safeText}</p>
        <a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#7c3aed,#db2777);color:#fff;text-decoration:none;padding:16px 32px;border-radius:999px;font-weight:700;font-size:16px">${ctaLabel}</a>
        <p style="font-size:12px;color:#6b6b80;margin-top:32px;line-height:1.5">
          ${url}
        </p>
      </div>
    </div>`;
}
