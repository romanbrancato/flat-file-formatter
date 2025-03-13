"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { usePGlite } from "@electric-sql/pglite-react";
import { toast } from "sonner";

interface TablesContextType {
  tables: Record<string, string[]>;
  focusedTable: string | null;
  setFocusedTable: React.Dispatch<React.SetStateAction<string | null>>;
  updateTables: () => void;
}

const TablesContext = createContext<TablesContextType>({
  tables: {},
  focusedTable: null,
  setFocusedTable: () => {},
  updateTables: () => {}
});

export const useTables = () => useContext(TablesContext);

export const TablesProvider = ({ children }: { children: ReactNode }) => {
  const pg = usePGlite();
  const [tables, setTables] = useState<Record<string, string[]>>({});
  const [focusedTable, setFocusedTable] = useState<string | null>(null);

  useEffect(() => {
    const tableNames = Object.keys(tables);
    if (!focusedTable && tableNames.length > 0) {
      setFocusedTable(tableNames[0]);
    }
  }, [tables, focusedTable, setFocusedTable]);

  const updateTables = async () => {
    try {
      // Fetch all table names
      const tablesRes = await pg.query(`
        SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public';
      `);
      const tableNames = tablesRes.rows.map((row: any) => row.tablename);
      // Fetch columns for each table
      const tablesData: Record<string, string[]> = {};
      
      for (const tableName of tableNames) {
        try {
          const columnsRes = await pg.query(`
            SELECT
              attname AS column_name
            FROM
              pg_catalog.pg_attribute
            WHERE
              attrelid = 'public."${tableName}"'::regclass
              AND attnum > 0
              AND NOT attisdropped
            ORDER BY
              attnum;
          `);

          tablesData[tableName] = columnsRes.rows.map((row: any) => row.column_name);
        } catch (error) {
          toast.error(`Error fetching columns for table ${tableName}`, {
            description: error instanceof Error ? error.message : String(error),
          });
          console.error(`Error fetching columns for table ${tableName}:`, error);
          tablesData[tableName] = [];
        }
      }
      
      setTables(tablesData);
    } catch (error) {
      toast.error("Error fetching tables", {
        description: error instanceof Error ? error.message : String(error),
      });
      console.error("Error fetching tables:", error);
      setTables({});
    }
  };

  return (
    <TablesContext.Provider value={{ tables, focusedTable, setFocusedTable, updateTables }}>
      {children}
    </TablesContext.Provider>
  );
};