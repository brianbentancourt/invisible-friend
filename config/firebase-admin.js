import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

let app;

if (getApps().length === 0) {
    if (projectId && clientEmail && privateKey) {
        const credential = cert({
            projectId,
            clientEmail,
            privateKey
        });
        app = initializeApp({ credential });
    } else {
        console.warn('⚠️ Variables de entorno de Firebase Admin faltantes. Inicializando app vacía para el build.');
        // App dummy para que no falle la compilación de Vercel (Next.js evalúa el archivo)
        app = initializeApp({ projectId: 'dummy-project' });
    }
} else {
    app = getApps()[0];
}

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
