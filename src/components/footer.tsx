"use client";

import { Button } from "@/components/ui/button";
import { useTables } from "@/context/tables";

export function Footer() {
  const { tables, activeTable, setActiveTable } = useTables();  

  if (tables.size <= 0)  return null;

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
    </footer>
  );
}

