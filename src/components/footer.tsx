"use client";

import { Button } from "@/components/ui/button";
import { useTables } from "@/context/tables";
import { useLiveQuery } from "@electric-sql/pglite-react";
import { identifier } from "@electric-sql/pglite/template";

export function Footer() {
  const { tables, focusedTable: activeTable, setFocusedTable: setActiveTable } = useTables();
  
  const numRows = useLiveQuery.sql`
    SELECT COUNT(*) FROM ${identifier`${activeTable}`}
  `
  if (tables.size <= 0 || !numRows)  return null;

  return (
    <footer className="sticky bottom-0 mt-auto flex items-center justify-between">
      <div className="flex">
        {Array.from(tables).map((table) => (
          <Button
            key={table}
            onClick={() => setActiveTable(table)}
            className={`hover:bg-foreground rounded-none px-3 py-1.5 shadow-none ${
              activeTable !== table && 
              "bg-background text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {table}
          </Button>
        ))}
      </div>
      <span className="text-xs text-muted-foreground">{numRows.rows[0].count || 0} row(s)</span>
      </footer>
  );
}

