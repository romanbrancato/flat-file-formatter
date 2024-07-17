import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

export function SelectOperator({
  defaultValue,
  onOperatorSelect,
}: {
  defaultValue: "+" | "-";
  onOperatorSelect: (operator: "+" | "-") => void;
}) {
  return (
    <Select
      defaultValue={defaultValue}
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
