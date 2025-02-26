"use client"
import { useLiveQuery, usePGlite } from "@electric-sql/pglite-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTables } from "@/context/tables";
import { identifier } from '@electric-sql/pglite/template'

export function QueryTable() {
  const pg = usePGlite();
  const { focusedTable } = useTables();

  const items = useLiveQuery.sql`
    SELECT *
    FROM ${identifier`${focusedTable}`}
  `;

  if(!focusedTable || !pg || !items) return null;

  return (
    <ScrollArea className="h-full">
      <Table>
        <TableHeader className="bg-background sticky top-0">
          <TableRow>
            {items.fields.map((field, index) => (
              <TableHead key={index}>
                <div className="whitespace-nowrap">{field.name}</div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {items.fields.map((field, cellIndex) => (
                <TableCell key={cellIndex}>
                  <div className="whitespace-nowrap">
                    {row[field.name]?.toString() ?? ""}
                  </div>
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