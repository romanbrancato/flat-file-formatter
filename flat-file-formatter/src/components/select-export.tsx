import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectExport({
  selectedExport,
  onExportSelect,
}: {
  selectedExport: "csv" | "txt";
  onExportSelect: (exportType: "csv" | "txt") => void;
}) {
  return (
    <Select
      value={selectedExport}
      onValueChange={(value: "csv" | "txt") => onExportSelect(value)}
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
