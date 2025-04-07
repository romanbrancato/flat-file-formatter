"use client"
import { usePGlite } from "@electric-sql/pglite-react";
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
import { PresetContext } from "@/context/preset";
import { useContext, useEffect, useState } from "react";

export function QueryTable() {
  const pg = usePGlite();
  const { tables, focusedTable } = useTables();
  const { preset } = useContext(PresetContext);
  const [items, setItems] = useState<{fields: string[], rows: unknown[]}>({fields: [], rows: []});

  useEffect(() => {
    if (!pg || !focusedTable) {
      setItems({ fields: [], rows: [] });
      return
    }
    const getTableContents = async () => {
      const res = await pg.query(`SELECT * FROM "${focusedTable}"`);
      setItems({fields: res.fields.map((field: any) => field.name), rows: res.rows});
    }
    getTableContents();
  }, [pg, tables, focusedTable, preset.queries.length]);

  if(!items) return null;

  return (
    <ScrollArea className="h-full">
      <Table key={preset.queries.length}>
        <TableHeader className="bg-background sticky top-0">
          <TableRow>
            {items.fields.map((field, index) => (
              <TableHead key={index}>
                <div className="whitespace-nowrap">{field}</div>
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
                    {(row as Record<string, any>)[field]?.toString() ?? ""}
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
