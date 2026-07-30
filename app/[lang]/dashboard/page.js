'use client';
import { useState, useEffect } from 'react';
import { Button } from "@nextui-org/react";
import ParticipantForm from '@/components/ParticipantForm';
import ParticipantList from '@/components/ParticipantList';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'react-toastify';
import DonationButton from '@/components/DonationButton';
import AdBanner from '@/components/AdBanner';
import { useLanguage } from '@/components/LanguageProvider';

export default function Dashboard() {
    const [participants, setParticipants] = useState([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [drawResults, setDrawResults] = useState(null);
    const [drawLog, setDrawLog] = useState(null);
    const [drawId, setDrawId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isPremium, setIsPremium] = useState(false);
    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
    const { user } = useAuth();
    const { t, locale } = useLanguage();

    useEffect(() => {
        if (user?.email) {
            // Verificar estado premium
            fetch('/api/user/status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail: user.email })
            })
            .then(res => res.json())
            .then(data => {
                if (data.isPremium) setIsPremium(true);
            })
            .catch(console.error);

            // Cargar participantes guardados desde Firestore
            fetch(`/api/user/participants?email=${encodeURIComponent(user.email)}`)
            .then(res => res.json())
            .then(data => {
                if (data.participants && data.participants.length > 0) {
                    setParticipants(data.participants);
                } else {
                    // Si no tiene en la nube, revisamos si dejó algo en localStorage localmente
                    const localData = localStorage.getItem('invisible_draft_participants');
                    if (localData) setParticipants(JSON.parse(localData));
                }
                setIsInitialLoad(false);
            })
            .catch(err => {
                console.error(err);
                setIsInitialLoad(false);
            });
        } else if (user === null) {
            // Usuario no logueado (Guest mode)
            const localData = localStorage.getItem('invisible_draft_participants');
            if (localData) {
                try {
                    setParticipants(JSON.parse(localData));
                } catch (e) {
                    console.error("Error parsing local participants");
                }
            }
            setIsInitialLoad(false);
        }
    }, [user]);

    // Función para guardar participantes (debounce opcional)
    const saveParticipants = async (newParticipants) => {
        setParticipants(newParticipants);

        // Siempre guardar en localStorage como backup
        localStorage.setItem('invisible_draft_participants', JSON.stringify(newParticipants));

        // Si hay usuario, sincronizar con Firestore
        if (user?.email) {
            try {
                await fetch('/api/user/participants', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userEmail: user.email,
                        participants: newParticipants
                    })
                });
            } catch (error) {
                console.error('Error al sincronizar participantes:', error);
            }
        }
    };

    const handleUpgrade = async () => {
        if (!user?.email) return;
        setIsCheckoutLoading(true);
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail: user.email })
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                toast.error('Error al iniciar el pago');
            }
        } catch (error) {
            toast.error('Error al conectar con MercadoPago');
        } finally {
            setIsCheckoutLoading(false);
        }
    };

    const handleAddParticipant = (participant) => {
        saveParticipants([...participants, { ...participant, id: crypto.randomUUID(), exclusions: [] }]);
    };

    const handleUpdateParticipant = (id, updates) => {
        saveParticipants(participants.map(p => 
            p.id === id ? { ...p, ...updates } : p
        ));
    };

    const handleRemoveParticipant = (id) => {
        saveParticipants(participants.filter(p => p.id !== id));
    };

    const handleDraw = async () => {
        if (participants.length < 2) {
            toast.error(t('dashboard.errors.min_participants'));
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/draw', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ participants, userEmail: user?.email, lang: locale }),
            });

            const data = await response.json();

            if (data.success) {
                setDrawLog(data.logContent);
                setDrawId(data.drawId);
                setDrawResults(data.results);
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

        const toastId = toast.loading("Reintentando envío...");
        try {
            const response = await fetch('/api/draw/retry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ drawId, participantEmail }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al reintentar');
            }

            // Actualizar el estado local con los nuevos resultados
            setDrawResults(prevResults => prevResults.map(r => {
                if (r.participant.email === participantEmail) {
                    return { ...r, status: data.status };
                }
                return r;
            }));

            toast.update(toastId, { render: "Notificación reintentada", type: "success", isLoading: false, autoClose: 3000 });

        } catch (error) {
            console.error(error);
            toast.update(toastId, { render: "Error al reintentar", type: "error", isLoading: false, autoClose: 3000 });
        }
    };

    const handleDownloadLog = () => {
        if (!drawLog) return;
        const blob = new Blob([drawLog], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `sorteo-${new Date().toISOString().replace(/[:.]/g, '-')}.log`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold">{t('dashboard.title')}</h1>
                    {isPremium ? (
                        <span className="text-sm font-semibold text-warning">{t('dashboard.premium')}</span>
                    ) : (
                        <span className="text-sm text-default-500">{t('dashboard.free_plan')}</span>
                    )}
                </div>
                <div className="flex gap-4 items-center">
                    {!isPremium && (
                        <Button 
                            color="secondary" 
                            variant="flat" 
                            className="font-bold"
                            isLoading={isCheckoutLoading}
                            onPress={handleUpgrade}
                        >
                            {t('dashboard.upgrade')}
                        </Button>
                    )}
                    <DonationButton />
                </div>
            </div>
            
            <AdBanner />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
                {/* Panel Izquierdo: Formulario */}
                <div className="lg:col-span-1">
                    <div className="bg-default-50 rounded-2xl p-6 shadow-sm border border-default-100">
                        <h2 className="text-xl font-bold mb-4">{t('dashboard.add_participant')}</h2>
                        <ParticipantForm onAddParticipant={handleAddParticipant} />
                    </div>
                </div>

                {/* Panel Derecho: Lista */}
                <div className="lg:col-span-2">
                    <div className="bg-default-50 rounded-2xl p-6 shadow-sm border border-default-100 min-h-[400px] flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{t('dashboard.participants')}</h2>
                            <span className="text-sm text-default-500 bg-default-100 px-3 py-1 rounded-full">
                                {participants.length} {t('dashboard.people')}
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
                                isDisabled={participants.length < 2}
                            >
                                {isLoading ? t('dashboard.drawing') : `🎲 ${t('dashboard.draw_button')}`}
                            </Button>
                        )}
                        {drawResults && (
                            <div className="flex gap-4 mt-4">
                                <Button
                                    color="primary"
                                    onClick={handleDownloadLog}
                                >
                                    Descargar Log
                                </Button>
                                <Button
                                    color="warning"
                                    onClick={() => {
                                        setDrawResults(null);
                                        setDrawId(null);
                                        setDrawLog(null);
                                        // No borramos los participantes para permitir reutilizarlos
                                    }}
                                >
                                    Nuevo Sorteo
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}