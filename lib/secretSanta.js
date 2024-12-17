import { sendEmail, sendWhatsApp, sendSMS } from './notifications';

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export async function performDraw(participants) {
    const shuffled = shuffle([...participants]);
    const assignments = [];

    for (let i = 0; i < participants.length; i++) {
        assignments.push({
            giver: participants[i],
            receiver: shuffled[i === participants.length - 1 ? 0 : i + 1]
        });
    }

    for (const { giver, receiver } of assignments) {
        const message = `Hola ${giver.name}! En el sorteo del amigo invisible te ha tocado regalar a: ${receiver.name}`;

        // Enviar notificaciones en paralelo
        await Promise.all([
            sendEmail(
                giver.email,
                'Tu Amigo Invisible',
                message
            ),
            sendWhatsApp(giver.phone, message),
            sendSMS(giver.phone, message)
        ]);
    }

    return assignments;
}