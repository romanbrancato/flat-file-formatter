import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface CSVTableProps {
    data: Record<string, any>[];
}

export function CSVTable({ data }: CSVTableProps) {
    const initialColumnNames = data.length > 0 ? Object.keys(data[0]) : [];
    const [columnOrder, setColumnOrder] = useState(initialColumnNames);

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {columnOrder.map((columnName, index) => (
                        <TableHead key={index}>{columnName}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.slice(0, 10).map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                        {columnOrder.map((columnName, cellIndex) => (
                            <TableCell key={cellIndex}>{row[columnName]}</TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}