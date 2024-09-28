"use client";
import { createContext, ReactNode, useEffect, useState } from "react";
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
    changes: {
      order: {},
      history: [],
    },
    output: {
      details: {
        format: "fixed",
        pad: " ",
        align: "left",
        widths: {},
      },
      groups: [],
    },
  });

  useEffect(() => {
    console.log("Preset:", preset);
  }, [preset]);

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
