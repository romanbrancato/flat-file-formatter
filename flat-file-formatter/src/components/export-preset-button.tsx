import React, { useContext } from "react";
import { PresetContext } from "@/context/preset-context";

interface ExportPresetButtonProps {
  trigger: React.ReactNode;
}

export function ExportPresetButton({ trigger }: ExportPresetButtonProps) {
  const { preset } = useContext(PresetContext);

  const exportPreset = () => {
    const dataStr = JSON.stringify(preset, null, 2);
    let dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    let link = document.createElement("a");
    link.setAttribute("href", dataUri);
    link.setAttribute("download", `${preset.name}.json`);
    link.click();
  };

  return React.cloneElement(
    React.Children.only(trigger as React.ReactElement),
    { onClick: exportPreset },
  );
}
