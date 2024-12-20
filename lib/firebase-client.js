'use client';

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

let firebaseApp;
let auth;

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

export function initializeFirebase() {
    if (typeof window !== 'undefined') {
        if (!firebaseApp) {
            firebaseApp = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
            auth = getAuth(firebaseApp);
        }
        return { app: firebaseApp, auth };
    }
    return { app: undefined, auth: undefined };
}

export async function getIdToken() {
    const { auth } = initializeFirebase();
    const user = auth?.currentUser;
    if (user) {
        return user.getIdToken();
    }
    return null;
}