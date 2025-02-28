"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { PGliteWithLive } from "@electric-sql/pglite/live";

interface TablesContextType {
  tables: Set<string>;
  setTables: React.Dispatch<React.SetStateAction<Set<string>>>;
  focusedTable: string | null;
  setFocusedTable: React.Dispatch<React.SetStateAction<string | null>>;
  getColumns: (pg: PGliteWithLive, table: string) => Promise<string[]>;
}

const TablesContext = createContext<TablesContextType>({
  tables: new Set<string>(),
  setTables: () => {
  },
  focusedTable: null,
  setFocusedTable: () => {
  },
  getColumns: async () => [],
});

export const useTables = () => useContext(TablesContext);

export const TablesProvider = ({ children }: { children: ReactNode }) => {

  const [tables, setTables] = useState<Set<string>>(new Set());
  const [focusedTable, setFocusedTable] = useState<string | null>(null);

  useEffect(() => {
    if (!focusedTable && tables.size > 0) {
      setFocusedTable(Array.from(tables)[0]);
    }
  }, [tables, focusedTable, setFocusedTable]);


  const getColumns = async (pg: PGliteWithLive, table: string): Promise<string[]> => {
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
    return res.rows.map((row: any) => row.column_name);
  };

  return (
    <TablesContext.Provider value={{ tables, setTables, focusedTable, setFocusedTable, getColumns}}>
      {children}
    </TablesContext.Provider>
  );
};