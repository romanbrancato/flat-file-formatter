import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectOperator({
  selectedOperator,
  onOperatorSelect,
}: {
  selectedOperator: "+" | "-";
  onOperatorSelect: (operator: "+" | "-") => void;
}) {
  return (
    <Select
      value={selectedOperator}
      onValueChange={(operator: "+" | "-") => {
        onOperatorSelect(operator);
      }}
    >
      <SelectTrigger className="text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key="+" value="+" className="text-xs">
          +
        </SelectItem>
        <SelectItem key="-" value="-" className="text-xs">
          -
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
