import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContext } from "react";
import { DataContext } from "@/context/data-context";
import { PresetContext } from "@/context/preset-context";

export function SelectAlign() {
  const { preset, setAlign } = useContext(PresetContext);
  const { data } = useContext(DataContext);
  return (
    <Select
      value={preset.align}
      onValueChange={(value: "left" | "right") => setAlign(value)}
      disabled={data.length === 0}
    >
      <SelectTrigger>
        <span className="text-xs text-muted-foreground">Align: </span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key="left" value="left">
          Left
        </SelectItem>
        <SelectItem key="right" value="right">
          Right
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
