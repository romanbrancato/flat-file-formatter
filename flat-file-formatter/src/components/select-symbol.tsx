import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContext } from "react";
import { PresetContext } from "@/context/preset-context";
import { ParserContext } from "@/context/parser-context";

export function SelectSymbol({ label }: { label: string }) {
  const { preset, setPreset } = useContext(PresetContext);
  const { isReady } = useContext(ParserContext);

  return (
    <Select
      value={preset.symbol}
      onValueChange={(value) => setPreset({ ...preset, symbol: value })}
      disabled={!isReady}
    >
      <SelectTrigger>
        <span className="font-normal text-xs text-muted-foreground">
          {label}:{" "}
        </span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem key="," value=",">
          ,
        </SelectItem>
        <SelectItem key=";" value=";">
          ;
        </SelectItem>
        <SelectItem key=":" value=":">
          :
        </SelectItem>
        <SelectItem key="|" value="|">
          |
        </SelectItem>
        <SelectItem key="tab" value="\t">
          Tab
        </SelectItem>
        <SelectItem key="space" value=" ">
          Space
        </SelectItem>
        <SelectItem key="=" value="=">
          =
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
