"use client";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTables } from "@/context/tables";
import { useTerminal } from "@/context/terminal";
import { PlusCircledIcon } from "@radix-ui/react-icons";

export function Footer() {
  const { tables, focusedTable, setFocusedTable } = useTables();
  const { setValue } = useTerminal();

  return (
    <footer className="sticky bottom-0 flex h-10 items-center border-t">
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
            `CREATE TABLE tablename (id SERIAL PRIMARY KEY)`,
          )
        }
      />
    </footer>
  );
}