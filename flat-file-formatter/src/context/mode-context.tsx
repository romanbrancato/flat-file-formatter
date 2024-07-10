"use client";
import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

export const ModeContext = createContext<{
  mode: "single" | "batch";
  setMode: Dispatch<SetStateAction<"single" | "batch">>;
}>({
  mode: "single",
  setMode: () => {},
});

export const ModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<"single" | "batch">("single");

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
};
