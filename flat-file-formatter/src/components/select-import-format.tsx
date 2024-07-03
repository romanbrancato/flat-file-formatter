import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";

interface SelectImportFormatProps {
  defaultValue: "delimited" | "fixed";
  onFormatSelect: (format: "delimited" | "fixed") => void;
}

export function SelectImportFormat({
  defaultValue,
  onFormatSelect,
}: SelectImportFormatProps) {
  return (
    <Select
      value={defaultValue}
      onValueChange={(field: "delimited" | "fixed") => {
        onFormatSelect(field);
      }}
    >
      <SelectTrigger className="font-medium">
        <span className="text-xs font-normal text-muted-foreground">
          Import Format:
        </span>
        <SelectValue placeholder="Select format..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key="delimited" value="delimited">
          Delimited
        </SelectItem>
        <SelectItem key="fixed" value="fixed">
          Fixed
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
