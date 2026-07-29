'use client';
import { useState } from 'react';
import { Button } from "@nextui-org/react";
import ParticipantForm from '@/components/ParticipantForm';
import ParticipantList from '@/components/ParticipantList';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'react-toastify';

export default function Dashboard() {
    const [participants, setParticipants] = useState([]);
    const [drawResults, setDrawResults] = useState(null);
    const [drawLog, setDrawLog] = useState(null);
    const [drawId, setDrawId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

    const handleAddParticipant = (participant) => {
        setParticipants([...participants, { ...participant, id: crypto.randomUUID(), exclusions: [] }]);
    };

    const handleUpdateParticipant = (id, updates) => {
        setParticipants(participants.map(p => 
            p.id === id ? { ...p, ...updates } : p
        ));
    };

    const handleDraw = async () => {
        if (participants.length < 2) {
            toast.error('Se necesitan al menos 2 participantes');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('/api/draw', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ participants }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al realizar el sorteo');
            }

            setDrawId(data.drawId);
            setDrawResults(data.results);
            setDrawLog(data.logContent);
            toast.success('¡Sorteo realizado con éxito! Las notificaciones han sido enviadas.');
            // No limpiar participantes para poder ver el estado
            // setParticipants([]); 

        } catch (error) {
            toast.error(error.message || 'Error al realizar el sorteo');
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
        <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
            <h1 className="text-2xl font-bold mb-6">
                Bienvenido al Amigo Invisible
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-semibold mb-4">
                        Agregar Participante
                    </h2>
                    <ParticipantForm onAddParticipant={handleAddParticipant} />
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-4 flex justify-between items-center">
                        Participantes
                        <span className="text-lg text-default-500">{participants.length} personas</span>
                    </h2>
                    <ParticipantList 
                        participants={participants} 
                        drawResults={drawResults}
                        onRetry={handleRetry}
                        onUpdateParticipant={handleUpdateParticipant}
                    />
                    {participants.length >= 2 && !drawResults && (
                        <Button
                            color="success"
                            onClick={handleDraw}
                            isLoading={isLoading}
                            className="mt-4"
                        >
                            {isLoading ? 'Realizando sorteo...' : 'Realizar Sorteo'}
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
                                    setParticipants([]);
                                }}
                            >
                                Nuevo Sorteo
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}