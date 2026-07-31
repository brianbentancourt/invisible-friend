'use client';
import { Suspense } from 'react';
import { Button, Card, CardBody } from '@nextui-org/react';
import { signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import NextLink from 'next/link';
import { initializeFirebase, getIdToken } from '@/lib/firebase-client';
import { useLanguage } from '@/components/LanguageProvider';
import { getNavLinks } from '@/lib/content';
import { track, EVENTS } from '@/lib/analytics';

export default function SignInPage() {
    return (
        <Suspense fallback={<div className="min-h-screen" />}>
            <SignIn />
        </Suspense>
    );
}

function SignIn() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t, locale } = useLanguage();
    const { auth } = initializeFirebase();
    const links = getNavLinks(locale);

    const createSession = async (token) => {
        try {
            await fetch('/api/auth/session', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token }),
            });
        } catch (error) {
            console.error('Error creating session:', error);
        }
    };

    const redirectAfterLogin = () => {
        // Volvemos a donde el usuario quería ir; por defecto, a su sorteo.
        const next = searchParams.get('next');
        if (next === 'pricing' && links.pricing) {
            router.push(`/${locale}/${links.pricing.slug}`);
            return;
        }
        router.push(`/${locale}/dashboard`);
    };

    const signIn = async (provider, providerName) => {
        try {
            await signInWithPopup(auth, provider);
            const token = await getIdToken();
            if (token) {
                await createSession(token);
                track(EVENTS.SIGNUP_START, { provider: providerName });
                redirectAfterLogin();
            }
        } catch (error) {
            console.error(`Error al iniciar sesión con ${providerName}:`, error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
            <Card className="max-w-md w-full border border-default-100 bg-default-50/50">
                <CardBody className="p-8 space-y-6">
                    <div className="text-center">
                        <div className="text-4xl mb-3">🎁</div>
                        <h1 className="text-2xl font-extrabold">{t('nav.login')}</h1>
                        <p className="text-default-500 text-sm mt-2">
                            {t('dashboard.login_required')}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Button
                            color="primary"
                            variant="flat"
                            onPress={() => signIn(new GoogleAuthProvider(), 'google')}
                            className="w-full font-semibold"
                        >
                            Google
                        </Button>
                        <Button
                            color="primary"
                            variant="flat"
                            onPress={() => signIn(new FacebookAuthProvider(), 'facebook')}
                            className="w-full font-semibold"
                        >
                            Facebook
                        </Button>
                    </div>

                    {links.privacy && links.terms && (
                        <p className="text-center text-xs text-default-400 leading-relaxed">
                            <NextLink
                                href={`/${locale}/${links.privacy.slug}`}
                                className="hover:text-primary transition-colors underline"
                            >
                                {links.privacy.h1}
                            </NextLink>
                            {' · '}
                            <NextLink
                                href={`/${locale}/${links.terms.slug}`}
                                className="hover:text-primary transition-colors underline"
                            >
                                {links.terms.h1}
                            </NextLink>
                        </p>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}
