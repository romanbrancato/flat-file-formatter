import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectFlag({
  label,
  defaultValue,
  onFlagSelect,
}: {
  label: string;
  defaultValue: "header" | "detail" | "trailer";
  onFlagSelect: (flag: "header" | "detail" | "trailer") => void;
}) {
  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={(flag: "header" | "detail" | "trailer") => {
        onFlagSelect(flag);
      }}
    >
      <SelectTrigger>
        <span className="text-xs text-muted-foreground">{label}:</span>
        <SelectValue placeholder="Select Flag" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key="header" value="header">
          Header
        </SelectItem>
        <SelectItem key="detail" value="detail">
          Detail
        </SelectItem>
        <SelectItem key="trailer" value="trailer">
          Trailer
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
