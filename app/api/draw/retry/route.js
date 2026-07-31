import { NextResponse } from 'next/server';
import { adminDb } from '@/config/firebase-admin';
import { getDictionary } from '@/lib/i18n';
import { localeFromParam } from '@/config/site';
import {
    sendEmail,
    sendWhatsApp,
    sendSMS,
    buildRevealUrl,
    buildEmailHtml,
} from '@/lib/notifications';

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
        const locale = localeFromParam(drawData.locale);
        const dict = getDictionary(locale);

        const participantEntryIndex = drawData.results.findIndex(
            (r) => r.giver.email === participantEmail
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

        // Sólo reintentamos los canales que fallaron, para no duplicar avisos.
        if (!currentStatus.email) {
            const html = buildEmailHtml({ text: message, url, ctaLabel: dict.reveal.reveal_btn });
            newStatus.email = await sendEmail(giver.email, dict.api.email_subject, message, html);
        }

        if (!currentStatus.whatsapp) {
            newStatus.whatsapp = await sendWhatsApp(giver.phone, message);
        }

        if (!currentStatus.sms) {
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
