"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { usePGlite } from "@electric-sql/pglite-react";

interface TablesContextType {
  tables: string[];
  focusedTable: string | null;
  setFocusedTable: React.Dispatch<React.SetStateAction<string | null>>;
  columns: { table: string; name: string }[];
  updateTables: () => void;
}

const TablesContext = createContext<TablesContextType>({
  tables: [],
  focusedTable: null,
  setFocusedTable: () => {},
  columns: [],
  updateTables: () => {}
});

export const useTables = () => useContext(TablesContext);

export const TablesProvider = ({ children }: { children: ReactNode }) => {
  const pg = usePGlite();
  const [tables, setTables] = useState<string[]>([]);
  const [focusedTable, setFocusedTable] = useState<string | null>(null);
  const [columns, setColumns] = useState<{ table: string; name: string }[]>([]);

  useEffect(() => {
    if (!focusedTable && tables.length > 0) {
      setFocusedTable(Array.from(tables)[0]);
    }
  }, [tables, focusedTable, setFocusedTable]);

  useEffect(() => {
    const fetchColumns = async () => {
      const allColumns: { table: string; name: string }[] = [];

      for (const table of tables) {
        try {
          const res = await pg.query(`
            SELECT
              attname AS column_name
            FROM
              pg_catalog.pg_attribute
            WHERE
              attrelid = 'public.${table}'::regclass
              AND attnum > 0
              AND NOT attisdropped
            ORDER BY
              attnum;
          `);

          // Map each column to include its table name
          const tableColumns = res.rows.map((row: any) => ({
            table,
            name: row.column_name
          }));

          allColumns.push(...tableColumns);
        } catch (error) {
          console.error(`Error fetching columns for table ${table}:`, error);
        }
      }

      setColumns(allColumns);
    };

    if (tables.length > 0) {
      fetchColumns();
    } else {
      setColumns([]);
    }
  }, [tables, pg]);


  const updateTables = async () => {
    const res = await pg.query(`
          SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public';
        `);
    setTables(res.rows.map((row: any) => row.tablename));
  };

  return (
    <TablesContext.Provider value={{ tables, columns, focusedTable, setFocusedTable, updateTables}}>
      {children}
    </TablesContext.Provider>
  );
};