'use client';
import { useState } from 'react';
import { Input, Button } from "@nextui-org/react";
import { toast } from 'react-toastify';

export default function ParticipantForm({ onAddParticipant }) {
    const [participant, setParticipant] = useState({
        name: '',
        phone: '',
        email: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!participant.name || !participant.phone || !participant.email) {
            toast.error('Por favor completa todos los campos');
            return;
        }
        onAddParticipant(participant);
        setParticipant({ name: '', phone: '', email: '' });
        toast.success('Participante agregado correctamente');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Nombre"
                value={participant.name}
                onChange={(e) => setParticipant({ ...participant, name: e.target.value })}
            />
            <Input
                label="Teléfono"
                value={participant.phone}
                onChange={(e) => setParticipant({ ...participant, phone: e.target.value })}
            />
            <Input
                label="Email"
                type="email"
                value={participant.email}
                onChange={(e) => setParticipant({ ...participant, email: e.target.value })}
            />
            <Button color="primary" type="submit">
                Agregar Participante
            </Button>
        </form>
    );
}