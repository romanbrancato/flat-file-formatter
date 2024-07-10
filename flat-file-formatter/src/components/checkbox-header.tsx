import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useContext } from "react";
import { PresetContext } from "@/context/preset-context";
import { ParserContext } from "@/context/parser-context";

export function CheckboxHeader() {
  const { isReady } = useContext(ParserContext);
  const { preset, setPreset } = useContext(PresetContext);
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="header"
        onCheckedChange={(checked: boolean) =>
          setPreset({ ...preset, header: checked })
        }
        checked={preset.header}
        disabled={!isReady}
      />
      <Label className="text-sm font-medium">Include Header</Label>
    </div>
  );
}
