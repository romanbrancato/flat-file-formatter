"use client"
import { createContext, useContext, useState, ReactNode } from "react";

interface TerminalContextType {
  value: string;
  setValue: (value: string) => void;
}

const TerminalContext = createContext<TerminalContextType | undefined>(undefined);

export const TerminalProvider = ({ children }: { children: ReactNode }) => {
  const [value, setValue] = useState("");

  return (
    <TerminalContext.Provider value={{ value, setValue }}>
      {children}
    </TerminalContext.Provider>
  );
};

export const useTerminal = () => {
  const context = useContext(TerminalContext);
  if (!context) {
    throw new Error("useTerminal must be used within a TerminalProvider");
  }
  return context;
};