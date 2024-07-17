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
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import { ParserContext } from "@/context/parser-context";
import { Field } from "@/context/preset-context";

export function SelectField({
  onFieldSelect,
}: {
  onFieldSelect: (field: Field) => void;
}) {
  const { data } = useContext(ParserContext);
  const [open, setOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<string>();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-label="Select a field..."
          aria-expanded={open}
          className="w-full justify-between px-3 min-w-[100px] sm:min-w-[300px]"
        >
          <span className="text-xs text-muted-foreground">Field:</span>
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
          <ScrollArea>
            <ScrollAreaViewport className="max-h-[300px]">
              {data.header.some((rec) => Object.keys(rec).length > 0) && (
                <CommandGroup heading="Header Fields" className="flex-1">
                  {Object.keys(data.header[0]).map((field) => (
                    <CommandItem
                      key={`header${field}`}
                      onSelect={() => {
                        setSelectedField(field);
                        setOpen(false);
                        onFieldSelect({ name: field, flag: "header" });
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
                </CommandGroup>
              )}
              <CommandGroup heading="Detail Fields" className="flex-1">
                {Object.keys(data.detail[0]).map((field) => (
                  <CommandItem
                    key={`detail${field}`}
                    onSelect={() => {
                      setSelectedField(field);
                      setOpen(false);
                      onFieldSelect({ name: field, flag: "detail" });
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
              </CommandGroup>
              {data.trailer.some((rec) => Object.keys(rec).length > 0) && (
                <CommandGroup heading="Trailer Fields" className="flex-1">
                  {Object.keys(data.trailer[0]).map((field) => (
                    <CommandItem
                      key={`trailer${field}`}
                      onSelect={() => {
                        setSelectedField(field);
                        setOpen(false);
                        onFieldSelect({ name: field, flag: "trailer" });
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
                </CommandGroup>
              )}
            </ScrollAreaViewport>
          </ScrollArea>
          <CommandEmpty>No fields found.</CommandEmpty>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
