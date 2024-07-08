"use client";
import {
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
} from "react";
import { PresetContext } from "@/context/preset-context";

export const ModeContext = createContext<{
  mode: "single" | "batch";
  setMode: Dispatch<SetStateAction<"single" | "batch">>;
}>({
  mode: "single",
  setMode: () => {},
});

export const ModeProvider = ({ children }: { children: ReactNode }) => {
  const { resetPreset } = useContext(PresetContext);
  const [mode, setMode] = useState<"single" | "batch">("single");

  useEffect(() => {
    resetPreset();
  }, [mode]);

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
};
