"use client";

import { createContext, useState, useContext, ReactNode, useEffect } from "react";

interface TablesContextType {
    tables: Set<string>;
    setTables: React.Dispatch<React.SetStateAction<Set<string>>>;
    focusedTable: string | null;
    setFocusedTable: React.Dispatch<React.SetStateAction<string | null>>;
  }
  
  const TablesContext = createContext<TablesContextType>({
    tables: new Set<string>(),
    setTables: () => {},
    focusedTable: null,
    setFocusedTable: () => {},
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
  
    return (
      <TablesContext.Provider value={{ tables, setTables, focusedTable, setFocusedTable }}>
        {children}
      </TablesContext.Provider>
    );
  };