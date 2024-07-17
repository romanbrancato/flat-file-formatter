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

export function SelectExport() {
  const { isReady } = useContext(ParserContext);
  const { preset, setPreset } = useContext(PresetContext);

  return (
    <Select
      value={preset.export}
      onValueChange={(value: "csv" | "txt") =>
        setPreset({ ...preset, export: value })
      }
      disabled={!isReady}
    >
      <SelectTrigger>
        <span className="font-normal text-xs text-muted-foreground">
          Export As:
        </span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key="csv" value="csv">
          .csv
        </SelectItem>
        <SelectItem key="txt" value="txt">
          .txt
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
