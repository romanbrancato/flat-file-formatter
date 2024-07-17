import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

export function SelectComparison({
  defaultValue,
  onComparisonSelect,
}: {
  defaultValue: "<" | "===" | ">";
  onComparisonSelect: (comparison: "<" | "===" | ">") => void;
}) {
  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={(comparison: "<" | "===" | ">") => {
        onComparisonSelect(comparison);
      }}
    >
      <SelectTrigger className="text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key="<" value="<" className="text-xs">
          {`<`}
        </SelectItem>
        <SelectItem key="===" value="===" className="text-xs">
          =
        </SelectItem>
        <SelectItem key=">" value=">" className="text-xs">
          {`>`}
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
