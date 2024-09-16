import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectFlag({
  label,
  selectedFlag,
  onFlagSelect,
}: {
  label: string;
  selectedFlag: string;
  onFlagSelect: (flag: string) => void;
}) {
  return (
    <Select
      value={selectedFlag}
      onValueChange={(flag: string) => {
        onFlagSelect(flag);
      }}
    >
      <SelectTrigger>
        <span className="font-normal text-xs text-muted-foreground">
          {label}:
        </span>
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
