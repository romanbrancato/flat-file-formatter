"use client";
import { createContext, ReactNode, useEffect, useState } from "react";
import { Delimited, Fixed, Preset } from "@common/types/preset";

const DEFAULTS = {
  delimited: { format: "delimited" as const, delimiter: "," },
  fixed: {
    format: "fixed" as const,
    pad: " ",
    align: "left" as const,
    widths: {}
  }
};

const DEFAULT_PRESET: Preset = {
  name: "",
  load: {tablename: "", skipRows: undefined, format: "delimited"},
  queries: [],
  format: DEFAULTS.delimited,
  export: ""
};

export const PresetContext = createContext<{
  preset: Preset;
  setPreset: React.Dispatch<React.SetStateAction<Preset>>;
  delimited: Delimited;
  setDelimited: React.Dispatch<React.SetStateAction<Delimited>>;
  fixed: Fixed;
  setFixed: React.Dispatch<React.SetStateAction<Fixed>>;
}>({
  preset: {} as Preset,
  setPreset: () => {
  },
  delimited: DEFAULTS.delimited,
  setDelimited: () => {
  },
  fixed: DEFAULTS.fixed,
  setFixed: () => {
  }
});

export const PresetProvider = ({ children }: { children: ReactNode }) => {
  const [preset, setPreset] = useState<Preset>(DEFAULT_PRESET);
  const [delimited, setDelimited] = useState<Delimited>(DEFAULTS.delimited);
  const [fixed, setFixed] = useState<Fixed>(DEFAULTS.fixed);

  // Sync format states when preset changes
  useEffect(() => {
    if (preset.format.format === "delimited") {
      setDelimited(preset.format);
    } else {
      setFixed(preset.format);
    }
  }, [preset.format]);

  useEffect(() => {
    setPreset((prev) => {
      if (prev.format.format === "delimited") {
        return { ...prev, format: delimited };
      } else {
        return { ...prev, format: fixed };
      }
    });
  }, [delimited, fixed]);

  return (
    <PresetContext.Provider value={{
      preset,
      setPreset,
      delimited,
      setDelimited,
      fixed,
      setFixed
    }}>
      {children}
    </PresetContext.Provider>
  );
};