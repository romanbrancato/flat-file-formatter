import { useState, useContext } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { DataContext } from "@/context/data-context";
import { PresetContext } from "@/context/preset-context";
import { symbols } from "@/data/symbols";
import { cn } from "@/lib/utils";

export function SymbolSelector() {
  const { data } = useContext(DataContext);
  const { preset, setSymbol } = useContext(PresetContext);
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-label="Select a symbol..."
          aria-expanded={open}
          className="flex-1 justify-between w-full"
          disabled={data.length === 0}
        >
          {preset && preset.symbol
            ? Array.from(symbols.entries()).find(
                ([key, value]) => value === preset.symbol,
              )?.[0] || preset.symbol
            : "Select a symbol..."}
          <CaretSortIcon className="ml-2 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search symbols..." />
          <CommandGroup heading="Symbols">
            {Array.from(symbols.entries()).map(([symbol, value]) => (
              <CommandItem
                key={symbol}
                onSelect={() => {
                  setSymbol(value);
                  setOpen(false);
                }}
              >
                {symbol}
                <CheckIcon
                  className={cn(
                    "ml-auto",
                    preset.symbol === value ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandEmpty>No symbols found.</CommandEmpty>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
