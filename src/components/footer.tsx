"use client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { PresetContext } from "@/context/preset";
import { useTables } from "@/context/tables";
import { useTerminal } from "@/context/terminal";
import { usePGlite } from "@/context/pglite";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useContext, useEffect, useState } from "react";

export function Footer() {
  const pg = usePGlite();
  const { preset } = useContext(PresetContext);
  const { tables, focusedTable, setFocusedTable } = useTables();
  const { setValue } = useTerminal();
  const [numRows, setNumRows] = useState<number>(0);

  useEffect(() => {
      if (!pg || !focusedTable) return
      const getTableContents = async () => {
        const res = await pg.query(`SELECT COUNT(*) FROM ${focusedTable}`);
        setNumRows(Number(Object.values(res?.rows[0] || {})[0]) || 0);
      }
      getTableContents();
    }, [pg, focusedTable, preset.queries.length]);

  return (
    <footer className="sticky bottom-0 flex h-10 items-center">
      <ToggleGroup
        type="single"
        value={focusedTable as string}
        onValueChange={(table) => {
          if (table) setFocusedTable(table);
        }}
        className="gap-x-0"
      >
        {Object.keys(tables).map((table) => (
          <ToggleGroupItem value={table} className="rounded-none" key={table}>
            {" "}
            {table}{" "}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <PlusCircledIcon
        className="ml-2 cursor-pointer"
        onClick={() =>
          setValue(
            `CREATE TABLE tablename (id SERIAL PRIMARY KEY, field1 TEXT, ...)`,
          )
        }
      />
      <span className="text-muted-foreground ml-auto text-xs">
        {numRows} row(s)
      </span>
    </footer>
  );
}