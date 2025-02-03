"use client";
import { createContext, ReactNode, useState } from "react";
import { Preset } from "@common/types/schemas";

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
    changes: [],
    format: {
      format: "fixed",
      pad: " ",
      align: "left",
      widths: {},
    },
    output: {
      groups: [],
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
