'use client';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, Button, getKeyValue, Select, SelectItem } from "@nextui-org/react";

export default function ParticipantList({ participants, drawResults, drawId, onRetry, onUpdateParticipant }) {
    const columns = [
        { key: "name", label: "NOMBRE" },
        { key: "phone", label: "TELÉFONO" },
        { key: "email", label: "EMAIL" },
        { key: "exclusions", label: "NO REGALAR A" },
    ];

    if (drawResults) {
        columns.push({ key: "notifications", label: "NOTIFICACIONES" });
        columns.push({ key: "actions", label: "ACCIONES" });
    }

    const getStatusIcon = (success) => (
        success ? <span className="text-green-500">✅</span> : <span className="text-red-500">❌</span>
    );

    const sortedParticipants = [...participants].sort((a, b) => a.name.localeCompare(b.name));

    const renderCell = (participant, columnKey) => {
        const result = drawResults?.find(r => r.participant.email === participant.email);
        const status = result?.status;

        switch (columnKey) {
            case "name":
                return participant.name;
            case "phone":
                return participant.phone;
            case "email":
                return participant.email;
            case "exclusions":
                // Si ya se hizo el sorteo, mostrar solo texto (o nada) para no editar
                if (drawResults) return <span className="text-gray-400">-</span>;

                const otherParticipants = participants.filter(p => p.id !== participant.id);
                return (
                    <Select
                        selectionMode="multiple"
                        placeholder="Seleccionar..."
                        size="sm"
                        className="max-w-xs"
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
                if (!status) return <span className="text-gray-400">Pendiente...</span>;
                return (
                    <div className="flex gap-2">
                        <Tooltip content={`Email: ${status.email ? 'Enviado' : 'Falló'}`}>
                            <span>📧 {getStatusIcon(status.email)}</span>
                        </Tooltip>
                        <Tooltip content={`WhatsApp: ${status.whatsapp ? 'Enviado' : 'Falló'}`}>
                            <span>📱 {getStatusIcon(status.whatsapp)}</span>
                        </Tooltip>
                        <Tooltip content={`SMS: ${status.sms ? 'Enviado' : 'Falló'}`}>
                            <span>💬 {getStatusIcon(status.sms)}</span>
                        </Tooltip>
                    </div>
                );
            case "actions":
                const hasError = status && (!status.email || !status.whatsapp || !status.sms);
                
                // Generar URL para compartir por WhatsApp manualmente si tenemos secretToken
                let shareButton = null;
                if (result?.secretToken && drawId) {
                    // Detectar host dinámicamente o hardcodear el dominio (idealmente dinámico)
                    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
                    const shareUrl = `${baseUrl}/sorteo/${drawId}/${result.secretToken}`;
                    const waText = encodeURIComponent(`¡Hola! Ya hice el sorteo del Amigo Invisible 🎁\n\nEntra a este enlace secreto para ver a quién te toca regalar:\n${shareUrl}\n\n¡No le digas a nadie! 🤫`);
                    const waLink = `https://wa.me/?text=${waText}`;

                    shareButton = (
                        <Button 
                            size="sm" 
                            color="success" 
                            variant="flat"
                            as="a"
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2"
                        >
                            Compartir WhatsApp
                        </Button>
                    );
                }

                return (
                    <div className="flex gap-2 items-center">
                        {hasError && (
                            <Button 
                                size="sm" 
                                color="warning" 
                                onClick={() => onRetry(participant.email)}
                            >
                                Reintentar
                            </Button>
                        )}
                        {shareButton}
                    </div>
                );
            default:
                return getKeyValue(participant, columnKey);
        }
    };

    return (
        <Table aria-label="Lista de participantes" isStriped>
            <TableHeader columns={columns}>
                {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
            </TableHeader>
            <TableBody items={sortedParticipants} emptyContent={"No hay participantes aún."}>
                {(item) => (
                    <TableRow key={item.id || item.email}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}