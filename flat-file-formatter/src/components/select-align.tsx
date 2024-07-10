import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContext } from "react";
import { PresetContext } from "@/context/preset-context";
import { ParserContext } from "@/context/parser-context";

export function SelectAlign() {
  const { preset, setPreset } = useContext(PresetContext);
  const { isReady } = useContext(ParserContext);
  return (
    <Select
      value={preset.align}
      onValueChange={(value: "left" | "right") =>
        setPreset({ ...preset, align: value })
      }
      disabled={!isReady}
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
