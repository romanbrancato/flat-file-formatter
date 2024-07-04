import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContext } from "react";
import { PresetContext } from "@/context/preset-context";
import { symbols } from "@/data/symbols";
import { ParserContext } from "@/context/parser-context";

interface SymbolSelectProps {
  label: string;
}

export function SelectSymbol({ label }: SymbolSelectProps) {
  const { preset, setPreset } = useContext(PresetContext);
  const { isReady } = useContext(ParserContext);

  return (
    <Select
      value={preset.symbol}
      onValueChange={(value) => setPreset({ ...preset, symbol: value })}
      disabled={!isReady}
    >
      <SelectTrigger>
        <span className="text-xs text-muted-foreground">{label}: </span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Array.from(symbols.entries()).map(([symbol, value]) => (
          <SelectItem key={symbol} value={value}>
            {symbol}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
