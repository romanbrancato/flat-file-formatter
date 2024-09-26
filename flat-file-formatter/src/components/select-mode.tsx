import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContext } from "react";
import { ModeContext } from "@/context/mode-context";

export function SelectMode() {
  const { mode, setMode } = useContext(ModeContext);
  return (
    <Select
      defaultValue={mode}
      onValueChange={(value: "single" | "batch") => setMode(value)}
    >
      <SelectTrigger className="ml-auto h-7 w-[145px] text-xs">
        <span className="font-normal text-muted-foreground">Mode: </span>
        <SelectValue placeholder="Select mode" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key="single" value="single" className="text-xs">
          Single
        </SelectItem>
        <SelectItem key="batch" value="batch" className="text-xs">
          Batch
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
