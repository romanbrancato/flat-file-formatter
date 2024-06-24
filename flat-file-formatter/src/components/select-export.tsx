import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContext } from "react";
import { PresetContext } from "@/context/preset-context";
import { DataContext } from "@/context/data-context";

export function SelectExport() {
  const { data } = useContext(DataContext);
  const { preset, setExport } = useContext(PresetContext);

  return (
    <Select
      value={preset.export}
      onValueChange={(value: "csv" | "txt") => setExport(value)}
      disabled={data.length === 0}
    >
      <SelectTrigger className="w-full">
        <span className="text-xs text-muted-foreground">Export As:</span>
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
