import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandItem } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useState } from "react";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";

export function Selector({
  selected,
  label,
  options,
  onSelect,
  className,
}: {
  selected: string | undefined;
  label?: string;
  options: { label: string; value: any }[];
  onSelect: (value: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  const selectedOption = options.find((option) => option.value === selected);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={`w-full justify-between capitalize ${className}`}
        >
          <span className="text-xs font-normal text-muted-foreground">
            {label ? `${label}:` : ""}
          </span>
          {selectedOption
            ? selectedOption.label
            : `Select ${label ? label.toLowerCase() : "option"}...`}
          <CaretSortIcon className="ml-2 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" side="bottom" className="p-1">
        <Command>
          <ScrollArea>
            <ScrollAreaViewport className="max-h-[300px]">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    setOpen(false);
                    onSelect(option.value);
                  }}
                  className="capitalize"
                >
                  {option.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto",
                      selected === option.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </ScrollAreaViewport>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
