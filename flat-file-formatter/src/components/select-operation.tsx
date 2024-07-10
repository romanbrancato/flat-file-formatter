import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export function SelectOperation({
  onOperationSelect,
}: {
  onOperationSelect: (operation: string) => void;
}) {
  const [operation, setOperation] = useState<string>("");
  return (
    <Select
      value={operation}
      onValueChange={(value) => {
        setOperation(value);
        onOperationSelect(value);
      }}
    >
      <SelectTrigger className="font-medium">
        <span className="text-xs font-normal text-muted-foreground">
          Operation:
        </span>
        <SelectValue placeholder="Select operation..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key="if" value="if">
          IF
        </SelectItem>
        <SelectItem key="if not" value="if not">
          IF NOT
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
