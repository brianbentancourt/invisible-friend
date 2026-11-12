'use client';
import { useState, useRef } from 'react';
import { Button, Input, Textarea } from "@nextui-org/react";
import { useLanguage } from '@/components/LanguageProvider';
import { toast } from 'react-toastify';
import { track, EVENTS } from '@/lib/analytics';

export default function ParticipantForm({ onAddParticipant, isDisabled }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [telegram, setTelegram] = useState('');
    const [wishlist, setWishlist] = useState('');
    const nameInputRef = useRef(null);
    const { t } = useLanguage();

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        const trimmedPhone = phone.trim();
        const trimmedTelegram = telegram.trim().replace(/^@/, '');

        if (!trimmedName) {
            toast.error(t('participant_form.error_no_name'));
            return;
        }
        if (!trimmedEmail && !trimmedPhone && !trimmedTelegram) {
            toast.error(t('participant_form.error_no_contact'));
            return;
        }
        onAddParticipant({
            name: trimmedName,
            email: trimmedEmail,
            phone: trimmedPhone,
            telegram: trimmedTelegram,
            wishlist: wishlist.trim(),
        });
        setName('');
        setEmail('');
        setPhone('');
        setTelegram('');
        setWishlist('');
        track(EVENTS.PARTICIPANT_ADDED, {
            has_wishlist: Boolean(wishlist.trim()),
            has_telegram: Boolean(trimmedTelegram),
        });
        toast.success(t('participant_form.success'));

        // Mantener el foco en el campo de nombre para cargar el siguiente rápidamente
        setTimeout(() => {
            nameInputRef.current?.focus();
        }, 50);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
                ref={nameInputRef}
                label={t('participant_form.name')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                isDisabled={isDisabled}
                required
                autoComplete="name"
            />
            <Input
                label={t('participant_form.email')}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isDisabled={isDisabled}
                autoComplete="email"
            />
            <Input
                label={t('participant_form.phone')}
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                isDisabled={isDisabled}
                autoComplete="tel"
            />
            <Input
                label={t('participant_form.telegram')}
                placeholder={t('participant_form.telegram_ph')}
                startContent={<span className="text-default-400 text-sm">@</span>}
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                isDisabled={isDisabled}
                autoComplete="off"
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
            <Button type="submit" color="primary" isDisabled={isDisabled} className="font-semibold">
                {t('participant_form.add')}
            </Button>
        </form>
    );
}
