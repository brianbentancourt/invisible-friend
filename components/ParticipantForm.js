'use client';
import { useState } from 'react';
import { Button, Input, Textarea } from "@nextui-org/react";
import { useLanguage } from '@/components/LanguageProvider';
import { toast } from 'react-toastify';
import { track, EVENTS } from '@/lib/analytics';

export default function ParticipantForm({ onAddParticipant, isDisabled }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [wishlist, setWishlist] = useState('');
    const { t } = useLanguage();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name) {
            toast.error(t('participant_form.error_no_name'));
            return;
        }
        if (!email && !phone) {
            toast.error(t('participant_form.error_no_contact'));
            return;
        }
        onAddParticipant({ name, email, phone, wishlist });
        setName('');
        setEmail('');
        setPhone('');
        setWishlist('');
        track(EVENTS.PARTICIPANT_ADDED, { has_wishlist: Boolean(wishlist) });
        toast.success(t('participant_form.success'));
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
                label={t('participant_form.name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                isDisabled={isDisabled}
                required
            />
            <Input
                label={t('participant_form.email')}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isDisabled={isDisabled}
            />
            <Input
                label={t('participant_form.phone')}
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                isDisabled={isDisabled}
            />
            {/* La lista de deseos viaja con el enlace secreto: es lo que hace que
                el regalo se acierte y lo que alimenta las ideas de regalo. */}
            <Textarea
                label={t('participant_form.wishlist')}
                placeholder={t('participant_form.wishlist_ph')}
                value={wishlist}
                onChange={(e) => setWishlist(e.target.value)}
                minRows={2}
                isDisabled={isDisabled}
            />
            <Button type="submit" color="primary" isDisabled={isDisabled}>
                {t('participant_form.add')}
            </Button>
        </form>
    );
}
