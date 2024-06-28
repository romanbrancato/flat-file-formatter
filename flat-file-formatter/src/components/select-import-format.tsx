import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React, { useState } from "react";

interface SelectImportFormatProps {
  setImportFormat: React.Dispatch<React.SetStateAction<string>>;
}

export function SelectImportFormat({
  setImportFormat: setImportFormat,
}: SelectImportFormatProps) {
  const [selectedFormat, setSelectedFormat] = useState<string>("delimited");
  return (
    <Select
      value={selectedFormat}
      onValueChange={(value) => {
        setSelectedFormat(value);
        setImportFormat(value);
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
