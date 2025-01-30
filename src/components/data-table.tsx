import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function DataTable({
  fields,
  rows,
}: {
  fields: string[];
  rows: string[][];
}) {
  const [columns, setColumns] = useState<string[]>([]);

  useEffect(() => {
    if (fields.length) {
      setColumns(fields);
    }
  }, [fields]);

  return (
    <ScrollArea className="h-full">
      <Table>
        <TableHeader className="sticky top-0 bg-background">
          <TableRow>
            {columns.map((col, index) => (
              <TableHead key={index}>
                <div className="whitespace-nowrap">{col}</div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex}>
                  <div className="whitespace-nowrap">{cell}</div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ScrollBar orientation="vertical" />
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
