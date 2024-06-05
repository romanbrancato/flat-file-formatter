import { Share2Icon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { PresetContext } from "@/context/preset-context";

export function ExportPresetButton() {
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

  return (
    <Button
      variant="secondary"
      size="icon"
      onClick={exportPreset}
      className="hidden sm:flex"
      disabled={!preset.name}
    >
      <Share2Icon />
    </Button>
  );
}
