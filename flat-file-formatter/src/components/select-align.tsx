import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectAlign({
  selectedAlign,
  onAlignSelect,
}: {
  selectedAlign: "left" | "right";
  onAlignSelect: (align: "left" | "right") => void;
}) {
  return (
    <Select
      value={selectedAlign}
      onValueChange={(value: "left" | "right") => onAlignSelect(value)}
    >
      <SelectTrigger>
        <span className="font-normal text-xs text-muted-foreground">
          Align:{" "}
        </span>
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
