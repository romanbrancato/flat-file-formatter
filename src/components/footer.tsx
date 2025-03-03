"use client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { useTables } from "@/context/tables";
import { useLiveQuery } from "@electric-sql/pglite-react";
import { identifier } from "@electric-sql/pglite/template";
import { PlusCircledIcon } from "@radix-ui/react-icons";

export function Footer() {
  const { tables, focusedTable, setFocusedTable } = useTables();

  const numRows = useLiveQuery.sql`
    SELECT COUNT(*) FROM ${identifier`${focusedTable}`}
  `;

  return (
    <footer className="sticky bottom-0 flex items-center h-10">
        <ToggleGroup type="single" value={focusedTable as string} onValueChange={(table) => {if(table) setFocusedTable(table)}} className="gap-x-0">
        {Array.from(tables).map((table) => (
           <ToggleGroupItem value={table} className="rounded-none"> {table} </ToggleGroupItem>
        ))}
        </ToggleGroup>
        <PlusCircledIcon className="ml-2 cursor-pointer" />
      <span className="text-muted-foreground text-xs ml-auto">
        {(numRows?.rows[0].count as number) || 0} row(s)
      </span>
    </footer>
  );
}
