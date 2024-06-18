import React, { useContext } from "react";
import { PresetContext } from "@/context/preset-context";
import { download } from "@/lib/utils";
import { DataContext } from "@/context/data-context";

interface ExportPresetButtonProps {
  trigger: React.ReactNode;
}

export function ExportPresetButton({ trigger }: ExportPresetButtonProps) {
  const { preset } = useContext(PresetContext);
  const { name } = useContext(DataContext);

  const exportPreset = () => {
    const dataStr = JSON.stringify(preset, null, 2);
    download(dataStr, name, "json");
  };

  return React.cloneElement(
    React.Children.only(trigger as React.ReactElement),
    { onClick: exportPreset },
  );
}
