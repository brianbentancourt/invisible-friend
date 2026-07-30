'use client';
import { useState } from 'react';
import { Button, Input } from "@nextui-org/react";
import { useLanguage } from '@/components/LanguageProvider';
import { toast } from 'react-toastify';

export default function ParticipantForm({ onAddParticipant }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const { t } = useLanguage();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name) {
            toast.error(t('participant_form.error_no_name') || 'El nombre es obligatorio');
            return;
        }
        if (!email && !phone) {
            toast.error(t('participant_form.error_no_contact') || 'Debes proveer al menos un Email o Teléfono');
            return;
        }
        onAddParticipant({ name, email, phone });
        setName('');
        setEmail('');
        setPhone('');
        toast.success(t('participant_form.success'));
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
                label={t('participant_form.name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <Input
                label={t('participant_form.email')}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Input
                label={t('participant_form.phone')}
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <Button type="submit" color="primary">
                {t('participant_form.add')}
            </Button>
        </form>
    );
}