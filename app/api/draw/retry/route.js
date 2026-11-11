import { NextResponse } from 'next/server';
import { adminDb } from '@/config/firebase-admin';
import { getDictionary } from '@/lib/i18n';
import { localeFromParam } from '@/config/site';
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

export async function POST(request) {
    try {
        const session = await getSession(request);
        if (!session?.email) {
            return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
        }

        const { drawId, participantId, participantEmail } = await request.json();

        if (!drawId || (!participantId && !participantEmail)) {
            return NextResponse.json({ error: 'Missing drawId or participant identifier' }, { status: 400 });
        }

        const drawRef = adminDb.collection('draws').doc(drawId);
        const doc = await drawRef.get();

        if (!doc.exists) {
            return NextResponse.json({ error: 'Draw not found' }, { status: 404 });
        }

        const drawData = doc.data();

        // Verificar que el usuario sea el organizador o admin
        const isOrganizer = drawData.organizerEmail?.toLowerCase() === session.email.toLowerCase();
        const isAdmin = ADMIN_EMAILS.includes(session.email.toLowerCase());
        if (!isOrganizer && !isAdmin) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
        }

        const locale = localeFromParam(drawData.locale);
        const dict = getDictionary(locale);

        // Buscar por id primero, luego por email
        const participantEntryIndex = drawData.results.findIndex(
            (r) => (participantId && r.giver.id === participantId) || (participantEmail && r.giver.email === participantEmail)
        );

        if (participantEntryIndex === -1) {
            return NextResponse.json({ error: 'Participant not found in this draw' }, { status: 404 });
        }

        const entry = drawData.results[participantEntryIndex];
        const { giver, secretToken } = entry;

        const url = buildRevealUrl({ locale, drawId, secretToken });
        const message = dict.api.email_link_message
            .replace('{giver}', giver.name)
            .replace('{url}', url);

        const currentStatus = entry.status;
        const newStatus = { ...currentStatus };

        // Sólo reintentamos los canales que fallaron y donde haya contacto
        if (!currentStatus.email && giver.email) {
            const html = buildEmailHtml({ text: message, url, ctaLabel: dict.reveal.reveal_btn });
            newStatus.email = await sendEmail(giver.email, dict.api.email_subject, message, html);
        }

        if (!currentStatus.whatsapp && giver.phone) {
            newStatus.whatsapp = await sendWhatsApp(giver.phone, message);
        }

        if (!currentStatus.sms && giver.phone) {
            newStatus.sms = await sendSMS(giver.phone, message);
        }

        drawData.results[participantEntryIndex].status = newStatus;

        await drawRef.update({ results: drawData.results });

        return NextResponse.json({
            success: true,
            status: newStatus,
        });
    } catch (error) {
        console.error('Error retrying notification:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
