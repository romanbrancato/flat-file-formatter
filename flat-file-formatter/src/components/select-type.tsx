import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectType({
  selectedType,
  onTypeSelect,
}: {
  selectedType: string;
  onTypeSelect: (type: string) => void;
}) {
  return (
    <Select
      value={selectedType}
      onValueChange={(value) => {
        onTypeSelect(value);
      }}
    >
      <SelectTrigger>
        <span className="text-xs font-normal text-muted-foreground">Type:</span>
        <SelectValue placeholder="Select type..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key="date" value="date">
          Date
        </SelectItem>
        <SelectItem key="number" value="number">
          Number
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
