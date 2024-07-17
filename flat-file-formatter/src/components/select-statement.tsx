import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

export function SelectStatement({
  defaultValue,
  onStatementSelect,
}: {
  defaultValue: "if" | "if not";
  onStatementSelect: (statement: "if" | "if not") => void;
}) {
  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={(statement: "if" | "if not") => {
        onStatementSelect(statement);
      }}
    >
      <SelectTrigger className="text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key="if" value="if" className="text-xs">
          IF
        </SelectItem>
        <SelectItem key="if not" value="if not" className="text-xs">
          IF NOT
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
