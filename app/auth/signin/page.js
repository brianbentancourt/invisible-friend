'use client';
import { Button } from "@nextui-org/react";
import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { useRouter } from 'next/navigation';

export default function SignIn() {
    const router = useRouter();

    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            router.push('/dashboard');
        } catch (error) {
            console.error('Error al iniciar sesión con Google:', error);
        }
    };

    const signInWithFacebook = async () => {
        try {
            const provider = new FacebookAuthProvider();
            await signInWithPopup(auth, provider);
            router.push('/dashboard');
        } catch (error) {
            console.error('Error al iniciar sesión con Facebook:', error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <div className="max-w-md w-full space-y-8">
                <h2 className="mt-6 text-center text-3xl font-extrabold">
                    Iniciar sesión
                </h2>
                <div className="mt-8 space-y-4">
                    <Button
                        color="primary"
                        variant="flat"
                        onClick={signInWithGoogle}
                        fullWidth
                    >
                        Iniciar sesión con Google
                    </Button>
                    {/* <Button
                        color="primary"
                        variant="flat"
                        onClick={signInWithFacebook}
                        fullWidth
                    >
                        Iniciar sesión con Facebook
                    </Button> */}
                </div>
            </div>
        </div>
    );
}