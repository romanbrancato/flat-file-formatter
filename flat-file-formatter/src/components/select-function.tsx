import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

interface SelectFunctionProps {
  onFunctionSelect: (func: string) => void;
}

export function SelectFunction({ onFunctionSelect }: SelectFunctionProps) {
  const [selectedFunc, setSelectedFunc] = useState<string>("");
  return (
    <Select
      value={selectedFunc}
      onValueChange={(value) => {
        setSelectedFunc(value);
        onFunctionSelect(value);
      }}
    >
      <SelectTrigger className="font-medium">
        <span className="text-xs font-normal text-muted-foreground">
          Function:
        </span>
        <SelectValue placeholder="Select function..." />
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
