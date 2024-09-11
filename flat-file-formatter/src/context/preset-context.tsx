"use client";
import { createContext, ReactNode, useContext, useState } from "react";
import { Preset } from "@/types/schemas";

export const PresetContext = createContext<{
  preset: Preset;
  setPreset: React.Dispatch<React.SetStateAction<Preset>>;
}>({
  preset: {} as Preset,
  setPreset: () => {},
});

export const PresetProvider = ({ children }: { children: ReactNode }) => {
  const [preset, setPreset] = useState<Preset>({
    name: null,
    parser: {
      format: "delimited",
    },
    formatSpec: {
      format: "fixed",
      pad: " ",
      align: "left",
      widths: {
        header: {},
        detail: {},
        trailer: {},
      },
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

  return (
    <PresetContext.Provider
      value={{
        preset,
        setPreset,
      }}
    >
      {children}
    </PresetContext.Provider>
  );
};
