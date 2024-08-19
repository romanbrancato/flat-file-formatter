"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { ModeContext } from "@/context/mode-context";
import { Preset } from "@/types/schemas";

export const PresetContext = createContext<{
  preset: Preset;
  setPreset: React.Dispatch<React.SetStateAction<Preset>>;
  resetPreset: () => void;
}>({
  preset: {} as Preset,
  setPreset: () => {},
  resetPreset: () => {},
});

export const PresetProvider = ({ children }: { children: ReactNode }) => {
  const { mode } = useContext(ModeContext);
  const [preset, setPreset] = useState<Preset>({} as Preset);

  useEffect(() => {
    console.log(preset);
  }, [preset]);

  function resetPreset() {
    setPreset({
      name: null,
      parser: {
        format: "delimited",
      },
      formatSpec: {
        format: "delimited",
        delimiter: ",",
      },
      changes: {
        pattern: "",
        order: {
          header: [],
          detail: [],
          trailer: [],
        },
        history: [],
      },
    });
  }

  useEffect(() => {
    resetPreset();
  }, [mode]);

  return (
    <PresetContext.Provider
      value={{
        preset,
        setPreset,
        resetPreset,
      }}
    >
      {children}
    </PresetContext.Provider>
  );
};
