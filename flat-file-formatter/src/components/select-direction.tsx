import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectDirection({
  selectedDirection,
  onDirectionSelect,
}: {
  selectedDirection: "row" | "column";
  onDirectionSelect: (direction: "row" | "column") => void;
}) {
  return (
    <Select
      value={selectedDirection}
      onValueChange={(direction: "row" | "column") => {
        onDirectionSelect(direction);
      }}
    >
      <SelectTrigger className="text-xs">
        <span className="font-normal text-xs text-muted-foreground">
          Direction:
        </span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key="row" value="row" className="text-xs">
          ROW
        </SelectItem>
        <SelectItem key="column" value="column" className="text-xs">
          COLUMN
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
