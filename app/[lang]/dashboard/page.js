'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import NextLink from 'next/link';
import { Button, Card, CardBody, Input, Textarea, Chip } from '@nextui-org/react';
import ParticipantForm from '@/components/ParticipantForm';
import ParticipantList from '@/components/ParticipantList';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'react-toastify';
import DonationButton from '@/components/DonationButton';
import AdBanner from '@/components/AdBanner';
import PaymentMethodSelector from '@/components/PaymentMethodSelector';
import { useLanguage } from '@/components/LanguageProvider';
import { FREE_PARTICIPANT_LIMIT, DEFAULT_PAYMENT_PROVIDER } from '@/config/site';
import { suggestedProvider } from '@/lib/payments';
import { getNavLinks } from '@/lib/content';
import { track, EVENTS } from '@/lib/analytics';

const STORAGE_KEY = 'invisible_draft_participants';
const EVENT_STORAGE_KEY = 'invisible_draft_event';
const EMPTY_EVENT = { name: '', date: '', budget: '', message: '' };

// useSearchParams necesita una frontera de Suspense para que Next pueda
// prerenderizar la ruta sin marcarla entera como dinámica.
export default function DashboardPage() {
    return (
        <Suspense fallback={<div className="min-h-screen" />}>
            <Dashboard />
        </Suspense>
    );
}

function Dashboard() {
    const [participants, setParticipants] = useState([]);
    const [event, setEvent] = useState(EMPTY_EVENT);
    const [drawResults, setDrawResults] = useState(null);
    const [drawLog, setDrawLog] = useState(null);
    const [drawId, setDrawId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isPremium, setIsPremium] = useState(false);
    const [plan, setPlan] = useState('free');
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
    const [paymentProvider, setPaymentProvider] = useState(DEFAULT_PAYMENT_PROVIDER);
    const { user, loading: authLoading } = useAuth();
    const { t, locale } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();
    const links = getNavLinks(locale);

    const isGuest = !authLoading && !user;
    const limitReached = !isPremium && participants.length >= FREE_PARTICIPANT_LIMIT;

    // Avisar del resultado del pago cuando MercadoPago devuelve al usuario.
    useEffect(() => {
        const payment = searchParams.get('payment');
        if (!payment) return;

        const messages = {
            success: () => toast.success(t('dashboard.errors.payment_success')),
            pending: () => toast.info(t('dashboard.errors.payment_pending')),
            failure: () => toast.error(t('dashboard.errors.payment_failure')),
        };

        messages[payment]?.();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    // La sugerencia depende de la zona horaria del navegador: se resuelve
    // después del montaje para no romper la hidratación.
    useEffect(() => {
        setPaymentProvider(suggestedProvider());
    }, []);

    useEffect(() => {
        // La lista local es la fuente de arranque en ambos casos: así el modo
        // invitado funciona y quien inicia sesión no pierde lo que ya cargó.
        const localData = localStorage.getItem(STORAGE_KEY);
        if (localData) {
            try {
                setParticipants(JSON.parse(localData));
            } catch (e) {
                console.error('Error parsing local participants');
            }
        }

        const localEvent = localStorage.getItem(EVENT_STORAGE_KEY);
        if (localEvent) {
            try {
                setEvent({ ...EMPTY_EVENT, ...JSON.parse(localEvent) });
            } catch (e) {
                console.error('Error parsing local event');
            }
        }
    }, []);

    useEffect(() => {
        if (!user?.email) return;

        fetch('/api/user/status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userEmail: user.email }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.isPremium) setIsPremium(true);
                if (data.plan) setPlan(data.plan);
            })
            .catch(console.error);

        fetch(`/api/user/participants?email=${encodeURIComponent(user.email)}`)
            .then((res) => res.json())
            .then((data) => {
                // Sólo pisamos la lista local si la nube tiene datos: si el
                // usuario acaba de cargar gente como invitado, se conserva.
                if (data.participants?.length > 0) {
                    const localData = localStorage.getItem(STORAGE_KEY);
                    const local = localData ? JSON.parse(localData) : [];
                    if (local.length === 0) setParticipants(data.participants);
                }
            })
            .catch(console.error);
    }, [user]);

    const saveParticipants = useCallback(
        async (newParticipants) => {
            setParticipants(newParticipants);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newParticipants));

            if (user?.email) {
                try {
                    await fetch('/api/user/participants', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userEmail: user.email,
                            participants: newParticipants,
                        }),
                    });
                } catch (error) {
                    console.error('Error al sincronizar participantes:', error);
                }
            }
        },
        [user]
    );

    const updateEvent = (field, value) => {
        const next = { ...event, [field]: value };
        setEvent(next);
        localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(next));
    };

    const handleUpgrade = async (selectedPlan = 'premium') => {
        track(EVENTS.UPGRADE_CLICK, {
            plan: selectedPlan,
            source: 'dashboard',
            provider: paymentProvider,
        });

        if (!user?.email) {
            router.push(`/${locale}/auth/signin`);
            return;
        }

        setIsCheckoutLoading(true);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userEmail: user.email,
                    plan: selectedPlan,
                    lang: locale,
                    provider: paymentProvider,
                }),
            });
            const data = await response.json();
            if (data.url) {
                track(EVENTS.CHECKOUT_STARTED, { plan: selectedPlan, provider: paymentProvider });
                window.location.href = data.url;
            } else {
                toast.error(t('dashboard.errors.payment_init_error'));
            }
        } catch (error) {
            toast.error(t('dashboard.errors.payment_conn_error'));
        } finally {
            setIsCheckoutLoading(false);
        }
    };

    const handleAddParticipant = (participant) => {
        saveParticipants([
            ...participants,
            { ...participant, id: crypto.randomUUID(), exclusions: [] },
        ]);
    };

    const handleUpdateParticipant = (id, updates) => {
        saveParticipants(participants.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    };

    const handleRemoveParticipant = (id) => {
        saveParticipants(participants.filter((p) => p.id !== id));
    };

    const handleDraw = async () => {
        if (participants.length < 2) {
            toast.error(t('dashboard.errors.min_participants'));
            return;
        }

        // El login se pide acá y no antes: el usuario ya invirtió tiempo
        // cargando su lista, así que la fricción se paga sola.
        if (!user?.email) {
            toast.info(t('dashboard.login_required'));
            track(EVENTS.SIGNUP_START, { source: 'draw_gate' });
            router.push(`/${locale}/auth/signin`);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/draw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ participants, userEmail: user.email, lang: locale, event }),
            });

            const data = await response.json();

            if (data.success) {
                setDrawLog(data.logContent);
                setDrawId(data.drawId);
                setDrawResults(data.results);
                track(EVENTS.DRAW_COMPLETED, { participants: participants.length, plan });
                toast.success(t('dashboard.errors.draw_success'));
            } else {
                toast.error(data.error || t('dashboard.errors.draw_error'));
            }
        } catch (error) {
            toast.error(t('dashboard.errors.draw_error'));
        } finally {
            setIsLoading(false);
        }
    };

    const handleRetry = async (participantEmail) => {
        if (!drawId) return;

        const toastId = toast.loading(t('dashboard.errors.retrying'));
        try {
            const response = await fetch('/api/draw/retry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ drawId, participantEmail }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error');
            }

            setDrawResults((prevResults) =>
                prevResults.map((r) =>
                    r.participant.email === participantEmail ? { ...r, status: data.status } : r
                )
            );

            toast.update(toastId, {
                render: t('dashboard.errors.retry_success'),
                type: 'success',
                isLoading: false,
                autoClose: 3000,
            });
        } catch (error) {
            console.error(error);
            toast.update(toastId, {
                render: t('dashboard.errors.retry_error'),
                type: 'error',
                isLoading: false,
                autoClose: 3000,
            });
        }
    };

    const downloadFile = (content, extension, mime) => {
        const blob = new Blob([content], { type: mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sorteo-${new Date().toISOString().replace(/[:.]/g, '-')}.${extension}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleDownloadLog = () => {
        if (drawLog) downloadFile(drawLog, 'log', 'text/plain');
    };

    const handleExportCsv = () => {
        const header = 'nombre,email,telefono,deseos\n';
        const rows = participants
            .map((p) =>
                [p.name, p.email || '', p.phone || '', (p.wishlist || '').replace(/\n/g, ' ')]
                    .map((value) => `"${String(value).replace(/"/g, '""')}"`)
                    .join(',')
            )
            .join('\n');

        downloadFile(header + rows, 'csv', 'text/csv;charset=utf-8');
    };

    const planLabel = isPremium
        ? plan === 'business'
            ? t('dashboard.business')
            : t('dashboard.premium')
        : t('dashboard.free_plan');

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold">{t('dashboard.title')}</h1>
                    <span className={`text-sm ${isPremium ? 'font-semibold text-warning' : 'text-default-500'}`}>
                        {planLabel}
                    </span>
                </div>
                <div className="flex gap-3 items-center flex-wrap">
                    {!isPremium && (
                        <>
                            <PaymentMethodSelector
                                value={paymentProvider}
                                onChange={setPaymentProvider}
                                compact
                            />
                            <Button
                                color="secondary"
                                variant="flat"
                                className="font-bold"
                                isLoading={isCheckoutLoading}
                                onPress={() => handleUpgrade('premium')}
                            >
                                {t('dashboard.upgrade')}
                            </Button>
                        </>
                    )}
                    <DonationButton />
                </div>
            </div>

            {/* Modo invitado: se puede cargar todo sin cuenta y el login se pide al sortear */}
            {isGuest && (
                <Card className="mb-6 border border-primary/30 bg-primary/5">
                    <CardBody className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                        <div>
                            <h2 className="font-bold mb-1">{t('dashboard.guest_title')}</h2>
                            <p className="text-sm text-default-500">{t('dashboard.guest_desc')}</p>
                        </div>
                        <Button
                            as={NextLink}
                            href={`/${locale}/auth/signin`}
                            color="primary"
                            variant="flat"
                            className="shrink-0 font-semibold"
                            onPress={() => track(EVENTS.SIGNUP_START, { source: 'guest_banner' })}
                        >
                            {t('dashboard.guest_login')}
                        </Button>
                    </CardBody>
                </Card>
            )}

            {limitReached && (
                <Card className="mb-6 border border-warning/40 bg-warning/5">
                    <CardBody className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
                        <p className="text-sm">
                            {t('dashboard.limit_reached', { limit: FREE_PARTICIPANT_LIMIT })}
                        </p>
                        <Button
                            color="warning"
                            variant="flat"
                            className="shrink-0 font-semibold"
                            isLoading={isCheckoutLoading}
                            onPress={() => handleUpgrade('premium')}
                        >
                            {t('dashboard.limit_cta')}
                        </Button>
                    </CardBody>
                </Card>
            )}

            {!isPremium && <AdBanner />}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
                {/* Panel Izquierdo: Formulario y detalles del evento */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="bg-default-50 rounded-2xl p-6 shadow-sm border border-default-100">
                        <h2 className="text-xl font-bold mb-4">{t('dashboard.add_participant')}</h2>
                        <ParticipantForm onAddParticipant={handleAddParticipant} isDisabled={limitReached} />
                    </div>

                    <div className="bg-default-50 rounded-2xl p-6 shadow-sm border border-default-100">
                        <h2 className="text-xl font-bold mb-4">{t('dashboard.event_title')}</h2>
                        <div className="flex flex-col gap-4">
                            <Input
                                label={t('dashboard.event_name')}
                                placeholder={t('dashboard.event_name_ph')}
                                value={event.name}
                                onChange={(e) => updateEvent('name', e.target.value)}
                            />
                            <Input
                                label={t('dashboard.event_date')}
                                type="date"
                                value={event.date}
                                onChange={(e) => updateEvent('date', e.target.value)}
                            />
                            <Input
                                label={t('dashboard.event_budget')}
                                placeholder={t('dashboard.event_budget_ph')}
                                value={event.budget}
                                onChange={(e) => updateEvent('budget', e.target.value)}
                            />
                            <div>
                                <Textarea
                                    label={t('dashboard.event_message')}
                                    placeholder={t('dashboard.event_message_ph')}
                                    value={event.message}
                                    onChange={(e) => updateEvent('message', e.target.value)}
                                    minRows={2}
                                    isDisabled={!isPremium}
                                />
                                {!isPremium && (
                                    <div className="flex items-center gap-2 mt-2">
                                        <Chip size="sm" color="secondary" variant="flat">
                                            Premium
                                        </Chip>
                                        <span className="text-xs text-default-400">
                                            {t('dashboard.event_premium_hint')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Panel Derecho: Lista */}
                <div className="lg:col-span-2">
                    <div className="bg-default-50 rounded-2xl p-6 shadow-sm border border-default-100 min-h-[400px] flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{t('dashboard.participants')}</h2>
                            <span className="text-sm text-default-500 bg-default-100 px-3 py-1 rounded-full">
                                {participants.length}
                                {!isPremium && ` / ${FREE_PARTICIPANT_LIMIT}`} {t('dashboard.people')}
                            </span>
                        </div>

                        <ParticipantList
                            participants={participants}
                            drawResults={drawResults}
                            drawId={drawId}
                            onRetry={handleRetry}
                            onUpdateParticipant={handleUpdateParticipant}
                            onRemoveParticipant={handleRemoveParticipant}
                        />

                        {participants.length >= 2 && !drawResults && (
                            <Button
                                color="primary"
                                size="lg"
                                className="w-full sm:w-auto font-bold mt-4"
                                onPress={handleDraw}
                                isLoading={isLoading}
                            >
                                {isLoading ? t('dashboard.drawing') : `🎲 ${t('dashboard.draw_button')}`}
                            </Button>
                        )}

                        {drawResults && (
                            <div className="mt-6">
                                <h3 className="font-bold mb-1">{t('dashboard.results_title')}</h3>
                                <p className="text-sm text-default-500 mb-4">{t('dashboard.results_desc')}</p>
                                <div className="flex gap-3 flex-wrap">
                                    <Button color="primary" variant="flat" onPress={handleDownloadLog}>
                                        {t('dashboard.download_log')}
                                    </Button>
                                    {isPremium && (
                                        <Button variant="flat" onPress={handleExportCsv}>
                                            {t('dashboard.export_csv')}
                                        </Button>
                                    )}
                                    <Button
                                        color="warning"
                                        variant="flat"
                                        onPress={() => {
                                            setDrawResults(null);
                                            setDrawId(null);
                                            setDrawLog(null);
                                            // Conservamos los participantes para reutilizarlos
                                        }}
                                    >
                                        {t('dashboard.new_draw')}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {!isPremium && links.pricing && (
                        <p className="text-center text-sm text-default-400 mt-6">
                            <NextLink
                                href={`/${locale}/${links.pricing.slug}`}
                                className="hover:text-primary transition-colors"
                            >
                                {t('nav.pricing')} →
                            </NextLink>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
