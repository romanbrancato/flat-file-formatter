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
