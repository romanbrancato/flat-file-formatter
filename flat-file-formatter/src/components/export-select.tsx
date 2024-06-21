import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContext } from "react";
import { PresetContext } from "@/context/preset-context";

export function ExportSelect() {
  const { preset, setExport } = useContext(PresetContext);

  return (
    <Select
      value={preset.export}
      onValueChange={(value: "csv" | "txt") => setExport(value)}
    >
      <SelectTrigger className="text-xs w-auto gap-x-1">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key="csv" value="csv" className="text-xs">
          .csv
        </SelectItem>
        <SelectItem key="txt" value="txt" className="text-xs">
          .txt
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
