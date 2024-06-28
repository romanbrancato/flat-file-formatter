import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useContext } from "react";
import { PresetContext } from "@/context/preset-context";
import { DataContext } from "@/context/data-context";

export function CheckboxHeader() {
  const { data } = useContext(DataContext);
  const { preset, setHeader } = useContext(PresetContext);
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id="header"
        onCheckedChange={setHeader}
        checked={preset.header}
        disabled={data.length === 0}
      />
      <Label className="text-sm font-medium">Include Header</Label>
    </div>
  );
}
