import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

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
          CONDITIONAL
        </SelectItem>
        <SelectItem key="equation" value="equation">
          EQUATION
        </SelectItem>
        <SelectItem key="total" value="total">
          TOTAL
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
