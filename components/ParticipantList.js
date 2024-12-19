'use client';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";

export default function ParticipantList({ participants }) {
    return (
        <Table isStriped aria-label="Lista de participantes">
            <TableHeader>
                <TableColumn>NOMBRE</TableColumn>
                <TableColumn>TELÉFONO</TableColumn>
                <TableColumn>EMAIL</TableColumn>
            </TableHeader>
            <TableBody>
                {participants.map((participant, index) => (
                    <TableRow key={index}>
                        <TableCell>{participant.name}</TableCell>
                        <TableCell>{participant.phone}</TableCell>
                        <TableCell>{participant.email}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}