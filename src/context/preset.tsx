"use client";
import { createContext, ReactNode, useState, useMemo, useEffect } from "react";
import { Preset, Delimited, Fixed } from "@common/types/schemas";

const DEFAULTS = {
  parser: { name: "", format: "delimited" as const, delimiter: "", skipRows:"" },
  delimited: { format: "delimited" as const, delimiter: "," },
  fixed: {
    format: "fixed" as const,
    pad: " ",
    align: "left" as const,
    widths: {},
  },
};

const DEFAULT_PRESET: Preset = {
  name: null,
  parser: DEFAULTS.parser,
  changes: [],
  format: DEFAULTS.delimited,
  output: { groups: [] },
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
  setPreset: () => {},
  delimited: DEFAULTS.delimited,
  setDelimited: () => {},
  fixed: DEFAULTS.fixed,
  setFixed: () => {},
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

  const contextValue = useMemo(() => ({
    preset,
    setPreset,
    delimited,
    setDelimited,
    fixed,
    setFixed,
  }), [preset, delimited, fixed]);

  return (
    <PresetContext.Provider value={contextValue}>
      {children}
    </PresetContext.Provider>
  );
};