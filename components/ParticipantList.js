'use client';
import { useState } from 'react';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Tooltip,
    Button,
    getKeyValue,
    Select,
    SelectItem,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    Textarea,
    Chip,
    Card,
    CardBody,
} from "@nextui-org/react";
import { toast } from 'react-toastify';
import { useLanguage } from '@/components/LanguageProvider';
import { track, EVENTS } from '@/lib/analytics';

export default function ParticipantList({
    participants,
    drawResults,
    drawId,
    onRetry,
    onUpdateParticipant,
    onRemoveParticipant,
}) {
    const { t, locale } = useLanguage();
    const [editingParticipant, setEditingParticipant] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', wishlist: '' });

    const columns = [
        { key: "name", label: t('participant_list.col_name') },
        { key: "phone", label: t('participant_list.col_phone') },
        { key: "email", label: t('participant_list.col_email') },
        { key: "wishlist", label: t('participant_list.col_wishlist') },
        { key: "exclusions", label: t('participant_list.col_exclusions') },
    ];

    if (drawResults) {
        columns.push({ key: "notifications", label: t('participant_list.col_notifications') });
    }
    columns.push({ key: "actions", label: t('participant_list.col_actions') });

    const getStatusIcon = (success) => (
        success ? <span className="text-green-500">✅</span> : <span className="text-red-500">❌</span>
    );

    const buildShareUrl = (secretToken) => {
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
        return `${baseUrl}/${locale}/sorteo/${drawId}/${secretToken}`;
    };

    const sortedParticipants = [...participants].sort((a, b) => a.name.localeCompare(b.name));

    const openEditModal = (participant) => {
        setEditingParticipant(participant);
        setEditForm({
            name: participant.name || '',
            email: participant.email || '',
            phone: participant.phone || '',
            wishlist: participant.wishlist || '',
        });
    };

    const handleSaveEdit = () => {
        if (!editingParticipant) return;
        const trimmedName = editForm.name.trim();
        const trimmedEmail = editForm.email.trim();
        const trimmedPhone = editForm.phone.trim();

        if (!trimmedName) {
            toast.error(t('participant_form.error_no_name'));
            return;
        }
        if (!trimmedEmail && !trimmedPhone) {
            toast.error(t('participant_form.error_no_contact'));
            return;
        }

        onUpdateParticipant(editingParticipant.id, {
            name: trimmedName,
            email: trimmedEmail,
            phone: trimmedPhone,
            wishlist: editForm.wishlist.trim(),
        });

        toast.success(t('participant_list.updated'));
        setEditingParticipant(null);
    };

    const getParticipantResult = (participant) => {
        return drawResults?.find((r) =>
            r.participant?.id && participant.id
                ? r.participant.id === participant.id
                : (participant.email && r.participant?.email === participant.email)
        );
    };

    const renderShareButtons = (participant, result) => {
        if (!result?.secretToken || !drawId) return null;

        const shareUrl = buildShareUrl(result.secretToken);
        const waTextTemplate = t('participant_list.whatsapp_message');
        const waText = encodeURIComponent(waTextTemplate.replace('{url}', shareUrl));

        // Si tiene teléfono, abre el chat directo con esa persona
        const cleanPhone = participant.phone ? participant.phone.replace(/[^0-9]/g, '') : '';
        const waLink = cleanPhone ? `https://wa.me/${cleanPhone}?text=${waText}` : `https://wa.me/?text=${waText}`;

        const copyLink = async () => {
            try {
                await navigator.clipboard.writeText(shareUrl);
                toast.success(t('participant_list.copied'));
                track(EVENTS.SHARE_CLICK, { channel: 'copy' });
            } catch (error) {
                console.error('No se pudo copiar el enlace:', error);
            }
        };

        return (
            <div className="flex gap-2 items-center flex-wrap">
                <Button
                    size="sm"
                    color="success"
                    variant="flat"
                    as="a"
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onPress={() => track(EVENTS.SHARE_CLICK, { channel: 'whatsapp' })}
                >
                    {t('participant_list.share_whatsapp')}
                </Button>
                <Button size="sm" variant="flat" onPress={copyLink}>
                    {t('participant_list.copy_link')}
                </Button>
            </div>
        );
    };

    const renderCell = (participant, columnKey) => {
        const result = getParticipantResult(participant);
        const status = result?.status;

        switch (columnKey) {
            case "name":
                return <span className="font-medium text-foreground">{participant.name}</span>;
            case "phone":
                return participant.phone || <span className="text-default-300">—</span>;
            case "email":
                return participant.email || <span className="text-default-300">—</span>;
            case "wishlist":
                if (!participant.wishlist) return <span className="text-default-300">—</span>;
                return (
                    <Tooltip content={participant.wishlist}>
                        <span className="text-default-500 text-sm line-clamp-1 max-w-[160px] block cursor-help">
                            {participant.wishlist}
                        </span>
                    </Tooltip>
                );
            case "exclusions":
                if (drawResults) return <span className="text-default-400">-</span>;

                const otherParticipants = participants.filter((p) => p.id !== participant.id);
                return (
                    <Select
                        selectionMode="multiple"
                        placeholder={t('participant_list.select')}
                        size="sm"
                        aria-label={`${t('participant_list.col_exclusions')} para ${participant.name}`}
                        className="max-w-xs min-w-[140px]"
                        selectedKeys={new Set(participant.exclusions || [])}
                        onSelectionChange={(keys) => {
                            const selectedIds = Array.from(keys);
                            onUpdateParticipant(participant.id, { exclusions: selectedIds });
                        }}
                    >
                        {otherParticipants.map((p) => (
                            <SelectItem key={p.id} textValue={p.name}>
                                {p.name}
                            </SelectItem>
                        ))}
                    </Select>
                );
            case "notifications":
                if (!status) return <span className="text-default-400">{t('participant_list.pending')}</span>;
                return (
                    <div className="flex gap-2">
                        <Tooltip content={`Email: ${status.email ? t('participant_list.sent') : t('participant_list.failed')}`}>
                            <span>📧 {getStatusIcon(status.email)}</span>
                        </Tooltip>
                        <Tooltip content={`WhatsApp: ${status.whatsapp ? t('participant_list.sent') : t('participant_list.failed')}`}>
                            <span>📱 {getStatusIcon(status.whatsapp)}</span>
                        </Tooltip>
                        <Tooltip content={`SMS: ${status.sms ? t('participant_list.sent') : t('participant_list.failed')}`}>
                            <span>💬 {getStatusIcon(status.sms)}</span>
                        </Tooltip>
                    </div>
                );
            case "actions":
                if (!drawResults) {
                    return (
                        <div className="flex items-center gap-1">
                            <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                aria-label={t('participant_list.edit')}
                                onPress={() => openEditModal(participant)}
                            >
                                ✏️
                            </Button>
                            <Button
                                isIconOnly
                                size="sm"
                                color="danger"
                                variant="light"
                                aria-label={t('participant_list.delete')}
                                onPress={() => onRemoveParticipant?.(participant.id)}
                            >
                                🗑️
                            </Button>
                        </div>
                    );
                }

                const hasError = status && (!status.email || !status.whatsapp);

                return (
                    <div className="flex gap-2 items-center flex-wrap">
                        {hasError && (
                            <Button
                                size="sm"
                                color="warning"
                                onPress={() => onRetry(participant.id, participant.email)}
                            >
                                {t('participant_list.retry')}
                            </Button>
                        )}
                        {renderShareButtons(participant, result)}
                    </div>
                );
            default:
                return getKeyValue(participant, columnKey);
        }
    };

    return (
        <div className="w-full">
            {/* Modal de edición */}
            <Modal
                isOpen={Boolean(editingParticipant)}
                onOpenChange={(open) => !open && setEditingParticipant(null)}
                placement="center"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                {t('participant_list.edit_title')}
                            </ModalHeader>
                            <ModalBody className="flex flex-col gap-4">
                                <Input
                                    label={t('participant_form.name')}
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    required
                                />
                                <Input
                                    label={t('participant_form.email')}
                                    type="email"
                                    value={editForm.email}
                                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                />
                                <Input
                                    label={t('participant_form.phone')}
                                    type="tel"
                                    value={editForm.phone}
                                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                                />
                                <Textarea
                                    label={t('participant_form.wishlist')}
                                    placeholder={t('participant_form.wishlist_ph')}
                                    value={editForm.wishlist}
                                    onChange={(e) => setEditForm({ ...editForm, wishlist: e.target.value })}
                                    minRows={2}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <Button variant="flat" onPress={onClose}>
                                    {t('participant_list.cancel')}
                                </Button>
                                <Button color="primary" onPress={handleSaveEdit}>
                                    {t('participant_list.save')}
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            {/* Vista Mobile: Stack de Tarjetas adaptativas (< md) */}
            <div className="block md:hidden space-y-3">
                {sortedParticipants.length === 0 ? (
                    <div className="text-center py-12 text-default-400">
                        {t('participant_list.empty')}
                    </div>
                ) : (
                    sortedParticipants.map((p, idx) => {
                        const result = getParticipantResult(p);
                        const status = result?.status;
                        const hasError = status && (!status.email || !status.whatsapp);
                        const otherParticipants = participants.filter((other) => other.id !== p.id);

                        return (
                            <Card key={p.id || idx} className="border border-default-200 bg-background/60 shadow-sm">
                                <CardBody className="p-4 flex flex-col gap-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                                                    {idx + 1}
                                                </span>
                                                <h3 className="font-bold text-base">{p.name}</h3>
                                            </div>
                                            <div className="flex flex-wrap gap-2 text-xs text-default-500 mt-1.5">
                                                {p.phone && <span>📱 {p.phone}</span>}
                                                {p.email && <span>📧 {p.email}</span>}
                                            </div>
                                        </div>

                                        {!drawResults && (
                                            <div className="flex gap-1 shrink-0">
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="flat"
                                                    aria-label={t('participant_list.edit')}
                                                    onPress={() => openEditModal(p)}
                                                >
                                                    ✏️
                                                </Button>
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    color="danger"
                                                    variant="flat"
                                                    aria-label={t('participant_list.delete')}
                                                    onPress={() => onRemoveParticipant?.(p.id)}
                                                >
                                                    🗑️
                                                </Button>
                                            </div>
                                        )}
                                    </div>

                                    {p.wishlist && (
                                        <div className="text-xs bg-default-100 rounded-lg p-2.5 text-default-600">
                                            <span className="font-semibold text-default-700">🎁 {t('participant_list.col_wishlist')}: </span>
                                            {p.wishlist}
                                        </div>
                                    )}

                                    {!drawResults && (
                                        <div>
                                            <label className="text-xs font-semibold text-default-500 mb-1 block">
                                                {t('participant_list.col_exclusions')}
                                            </label>
                                            <Select
                                                selectionMode="multiple"
                                                placeholder={t('participant_list.select')}
                                                size="sm"
                                                className="w-full"
                                                selectedKeys={new Set(p.exclusions || [])}
                                                onSelectionChange={(keys) => {
                                                    const selectedIds = Array.from(keys);
                                                    onUpdateParticipant(p.id, { exclusions: selectedIds });
                                                }}
                                            >
                                                {otherParticipants.map((other) => (
                                                    <SelectItem key={other.id} textValue={other.name}>
                                                        {other.name}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                        </div>
                                    )}

                                    {drawResults && (
                                        <div className="border-t border-default-100 pt-3 flex flex-col gap-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="font-semibold text-default-500">
                                                    {t('participant_list.col_notifications')}:
                                                </span>
                                                {status ? (
                                                    <div className="flex gap-2">
                                                        <span>📧 {getStatusIcon(status.email)}</span>
                                                        <span>📱 {getStatusIcon(status.whatsapp)}</span>
                                                        <span>💬 {getStatusIcon(status.sms)}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-default-400">{t('participant_list.pending')}</span>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap gap-2 pt-1 items-center">
                                                {hasError && (
                                                    <Button
                                                        size="sm"
                                                        color="warning"
                                                        onPress={() => onRetry(p.id, p.email)}
                                                    >
                                                        {t('participant_list.retry')}
                                                    </Button>
                                                )}
                                                {renderShareButtons(p, result)}
                                            </div>
                                        </div>
                                    )}
                                </CardBody>
                            </Card>
                        );
                    })
                )}
            </div>

            {/* Vista Desktop: Tabla tradicional (>= md) */}
            <div className="hidden md:block">
                <Table aria-label="Lista de participantes" isStriped>
                    <TableHeader columns={columns}>
                        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                    </TableHeader>
                    <TableBody items={sortedParticipants} emptyContent={t('participant_list.empty')}>
                        {(item) => (
                            <TableRow key={item.id || item.email}>
                                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
