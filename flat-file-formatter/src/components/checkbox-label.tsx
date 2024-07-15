import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useContext } from "react";
import { PresetContext } from "@/context/preset-context";
import { ParserContext } from "@/context/parser-context";

export function CheckboxLabel() {
  const { isReady } = useContext(ParserContext);
  const { preset, setPreset } = useContext(PresetContext);
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="header"
        onCheckedChange={(checked: boolean) =>
          setPreset({ ...preset, label: checked })
        }
        checked={preset.label}
        disabled={!isReady}
      />
      <Label className="text-sm font-medium">Include Field Labels</Label>
    </div>
  );
}
