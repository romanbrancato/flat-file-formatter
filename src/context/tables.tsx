"use client";

import { createContext, useState, useContext, ReactNode, useEffect } from "react";

interface TablesContextType {
    tables: Set<string>;
    setTables: React.Dispatch<React.SetStateAction<Set<string>>>;
    activeTable: string | null;
    setActiveTable: React.Dispatch<React.SetStateAction<string | null>>;
  }
  
  const TablesContext = createContext<TablesContextType>({
    tables: new Set<string>(),
    setTables: () => {},
    activeTable: null,
    setActiveTable: () => {},
  });
  
  export const useTables = () => useContext(TablesContext);

  export const TablesProvider = ({ children }: { children: ReactNode }) => {
    
    const [tables, setTables] = useState<Set<string>>(new Set());
    const [activeTable, setActiveTable] = useState<string | null>(null);

    useEffect(() => {
        if (!activeTable && tables.size > 0) {
            setActiveTable(Array.from(tables)[0]);
          }
    }, [tables, activeTable, setActiveTable]);
  
    return (
      <TablesContext.Provider value={{ tables, setTables, activeTable, setActiveTable }}>
        {children}
      </TablesContext.Provider>
    );
  };