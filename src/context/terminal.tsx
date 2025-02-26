"use client";

import React, { createContext, useContext } from "react";

interface TerminalContextType {
  insertSQL: (sql: string) => void;
}

const TerminalContext = createContext<TerminalContextType>({
  insertSQL: () => {},
});

export const useTerminal = () => useContext(TerminalContext);

export function TerminalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const insertSQL = (sql: string) => {
    const textArea = document.querySelector(
      '.cm-content[contenteditable="true"]',
    ) as HTMLElement;
    if (textArea) {
      textArea.innerHTML = sql;
    }
  };

  return (
    <TerminalContext.Provider value={{ insertSQL }}>
      {children}
    </TerminalContext.Provider>
  );
}
