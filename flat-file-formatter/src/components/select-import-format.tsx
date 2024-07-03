import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";

interface SelectImportFormatProps {
  onFormatSelect: (format: "delimited" | "fixed") => void;
}

export function SelectImportFormat({
  onFormatSelect,
}: SelectImportFormatProps) {
  const [selectedFormat, setSelectedFormat] = useState<"delimited" | "fixed">("delimited");
  return (
    <Select
      value={selectedFormat}
      onValueChange={(field: "delimited" | "fixed") => {
        setSelectedFormat(field);
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
