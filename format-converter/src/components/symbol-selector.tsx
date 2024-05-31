import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useContext, useState } from "react";
import { symbols } from "@/data/symbols";
import { DataContext } from "@/context/data-context";

export function SymbolSelector() {
  const { data, preset, setSymbol } = useContext(DataContext);
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
          {preset && preset.symbol ? preset.symbol : "Select a symbol..."}
          <CaretSortIcon className="ml-2 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search symbols..." />
          <CommandGroup heading="Symbols">
            {symbols.map((symbol) => (
              <CommandItem
                key={symbol}
                onSelect={() => {
                  setSymbol(symbol);
                  setOpen(false);
                }}
              >
                {symbol}
                <CheckIcon
                  className={cn(
                    "ml-auto",
                    preset.symbol === symbol ? "opacity-100" : "opacity-0",
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
