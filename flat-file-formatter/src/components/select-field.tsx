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
import { DataContext } from "@/context/data-context";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";

interface SelectFieldProps {
  onFieldSelect: (field: string) => void;
}

export function SelectField({ onFieldSelect }: SelectFieldProps) {
  const { data } = useContext(DataContext);
  const [open, setOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string>();

  const fields = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-label="Select a field..."
          aria-expanded={open}
          className="w-full justify-between min-w-[100px] sm:min-w-[300px]"
        >
          <span className="text-xs text-muted-foreground">Field: </span>
          {selectedField ? selectedField : "Select a field..."}
          <CaretSortIcon className="ml-2 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" side="bottom" className="p-0">
        <Command>
          <CommandInput
            placeholder="Search fields..."
            className="sticky top-0"
          />
          <CommandGroup heading="Fields">
            <ScrollArea>
              <ScrollAreaViewport className="max-h-[300px]">
                {fields.map((field) => (
                  <CommandItem
                    key={field}
                    onSelect={() => {
                      setSelectedField(field);
                      setOpen(false);
                      onFieldSelect(field);
                    }}
                  >
                    {field}
                    <CheckIcon
                      className={cn(
                        "ml-auto",
                        selectedField === field ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </ScrollAreaViewport>
            </ScrollArea>
          </CommandGroup>
          <CommandEmpty>No fields found.</CommandEmpty>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
