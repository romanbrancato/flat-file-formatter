import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface CSVTableProps {
    data: string[];
}


export function CSVTable({ data }: CSVTableProps) {
    // Get the column names from the first row of data
    const columnNames = data.length > 0 ? Object.keys(data[0]) : [];

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {columnNames.map((columnName, index) => (
                        <TableHead key={index}>{columnName}</TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.slice(0, 10).map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                        {columnNames.map((columnName, cellIndex) => (
                            <TableCell key={cellIndex}>{row[columnName]}</TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
