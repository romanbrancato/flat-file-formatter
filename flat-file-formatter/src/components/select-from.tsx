import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectFrom({
  selectedFrom,
  onFromSelect,
}: {
  selectedFrom: string;
  onFromSelect: (from: string) => void;
}) {
  return (
    <Select
      value={selectedFrom}
      onValueChange={(value) => {
        onFromSelect(value);
      }}
    >
      <SelectTrigger>
        <span className="text-xs font-normal text-muted-foreground">From:</span>
        <SelectValue placeholder="Select From..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key="scientific" value="scientific">
          Scientific
        </SelectItem>
        <SelectItem key="overpunch" value="overpunch">
          Overpunch
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
