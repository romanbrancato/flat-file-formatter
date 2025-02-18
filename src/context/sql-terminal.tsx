"use client";

import React, { createContext, useContext } from "react";

interface SqlTerminalContextType {
  insertSQL: (sql: string) => void;
}

const SqlTerminalContext = createContext<SqlTerminalContextType>({
    insertSQL: () => {},
});

export const useSqlTerminal = () => useContext(SqlTerminalContext);

export function SqlTerminalProvider({ children }: { children: React.ReactNode }) {

  const insertSQL = (sql: string) => {
    const textArea = document.querySelector('.cm-content[contenteditable="true"]') as HTMLElement;
    if (textArea) {
      textArea.innerHTML = sql;
    }
  };

  return (
    <SqlTerminalContext.Provider value={{ insertSQL }}>
      {children}
    </SqlTerminalContext.Provider>
  );
}