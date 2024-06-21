import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useContext, useEffect } from "react";
import { DataContext } from "@/context/data-context";
import { PresetContext } from "@/context/preset-context";
import { symbols } from "@/data/symbols";

interface SymbolSelectProps {
  label: string;
}

export function SymbolSelect({ label }: SymbolSelectProps) {
  const { preset, setSymbol } = useContext(PresetContext);
  const { data } = useContext(DataContext);

  return (
    <Select
      value={preset.symbol}
      onValueChange={(value) => setSymbol(value)}
      disabled={data.length === 0}
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
