'use client';
import { Button } from "@nextui-org/react";
import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { initializeFirebase, getIdToken } from '@/lib/firebase-client';

export default function SignIn() {
    const router = useRouter();
    const { auth } = initializeFirebase();

    const createSession = async (token) => {
        try {
            await fetch('/api/auth/session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token }),
            });
        } catch (error) {
            console.error('Error creating session:', error);
        }
    };

    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            const token = await getIdToken();
            if (token) {
                await createSession(token);
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Error al iniciar sesión con Google:', error);
        }
    };

    const signInWithFacebook = async () => {
        try {
            const provider = new FacebookAuthProvider();
            await signInWithPopup(auth, provider);
            const token = await getIdToken();
            if (token) {
                await createSession(token);
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Error al iniciar sesión con Facebook:', error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="max-w-md w-full space-y-8 p-6">
                <h2 className="text-3xl font-extrabold text-center">
                    Iniciar sesión
                </h2>
                <div className="space-y-4">
                    <Button
                        color="primary"
                        variant="flat"
                        onPress={signInWithGoogle}
                        className="w-full"
                    >
                        Iniciar sesión con Google
                    </Button>
                    <Button
                        color="primary"
                        variant="flat"
                        onPress={signInWithFacebook}
                        className="w-full"
                    >
                        Iniciar sesión con Facebook
                    </Button>
                </div>
            </div>
        </div>
    );
}