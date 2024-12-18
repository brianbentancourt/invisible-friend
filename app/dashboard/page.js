'use client';
import { useState } from 'react';
import { Button } from "@nextui-org/react";
import ParticipantForm from '@/components/ParticipantForm';
import ParticipantList from '@/components/ParticipantList';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'react-toastify';

export default function Dashboard() {
    const [participants, setParticipants] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

    const handleAddParticipant = (participant) => {
        setParticipants([...participants, participant]);
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

            toast.success('¡Sorteo realizado con éxito! Las notificaciones han sido enviadas.');
            // Opcional: limpiar la lista después del sorteo exitoso
            setParticipants([]);

        } catch (error) {
            toast.error(error.message || 'Error al realizar el sorteo');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
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
                    <h2 className="text-xl font-semibold mb-4">
                        Participantes
                    </h2>
                    <ParticipantList participants={participants} />
                    {participants.length >= 2 && (
                        <Button
                            color="success"
                            onClick={handleDraw}
                            isLoading={isLoading}
                            className="mt-4"
                        >
                            {isLoading ? 'Realizando sorteo...' : 'Realizar Sorteo'}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}