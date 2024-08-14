import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectImportFormat({
  value,
  onFormatSelect,
}: {
  value: "delimited" | "fixed";
  onFormatSelect: (format: "delimited" | "fixed") => void;
}) {
  return (
    <Select
      value={value}
      onValueChange={(field: "delimited" | "fixed") => {
        onFormatSelect(field);
      }}
    >
      <SelectTrigger>
        <span className="text-xs font-normal text-muted-foreground">
          Import Format:
        </span>
        <SelectValue placeholder="Select format..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key="delimited" value="delimited">
          Delimited
        </SelectItem>
        <SelectItem key="fixed" value="fixed">
          Fixed
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
