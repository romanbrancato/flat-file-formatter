import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectOperation({
  selectedOperation,
  onOperationSelect,
}: {
  selectedOperation: string;
  onOperationSelect: (operation: string) => void;
}) {
  return (
    <Select
      value={selectedOperation}
      onValueChange={(value) => {
        onOperationSelect(value);
      }}
    >
      <SelectTrigger>
        <span className="text-xs font-normal text-muted-foreground">
          Operation:
        </span>
        <SelectValue placeholder="Select operation..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key="conditional" value="conditional">
          Conditional
        </SelectItem>
        <SelectItem key="equation" value="equation">
          Equation
        </SelectItem>
        <SelectItem key="total" value="total">
          Total
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
