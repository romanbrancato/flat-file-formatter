import React, { useContext, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DataProcessorContext } from "@/context/data-processor";

export function DataTable() {
  const {isReady, data, focus} = useContext(DataProcessorContext);
  const [columns, setColumns] = useState<string[]>([]);

  useEffect(() => {
    if (!isReady || !Object.keys(data).includes(focus) || !data[focus].fields.length) return;
    setColumns(data[focus].fields);
  }, [isReady, data, focus]);

  if(!isReady || !Object.keys(data).includes(focus)) {
    return null
  }

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
          {data[focus].rows.map((row, rowIndex) => (
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
