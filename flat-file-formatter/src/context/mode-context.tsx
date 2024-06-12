"use client";
import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface ModeContextProps {
  mode: "single" | "batch";
  setMode: Dispatch<SetStateAction<"single" | "batch">>;
}

export const ModeContext = createContext<ModeContextProps>({
  mode: "single",
  setMode: () => {},
});

interface ModeProviderProps {
  children: ReactNode;
}

export const ModeProvider = ({ children }: ModeProviderProps) => {
  const [mode, setMode] = useState<"single" | "batch">("single");

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
};
