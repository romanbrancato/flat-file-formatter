import { Children, cloneElement, ReactElement, useContext } from "react";
import { PresetContext } from "@/context/preset-context";
import { download } from "@/lib/utils";

export function ButtonExportPreset({ trigger }: { trigger: React.ReactNode }) {
  const { preset } = useContext(PresetContext);
  const exportPreset = () => {
    const presetStr = JSON.stringify(preset, null, 2);
    download(presetStr, preset.name || "preset", "json");
  };

  return cloneElement(Children.only(trigger as ReactElement), {
    onClick: exportPreset,
  });
}
