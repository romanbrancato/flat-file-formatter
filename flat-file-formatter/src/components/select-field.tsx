import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
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
  selectedField,
  label,
  filter,
  onFieldSelect,
}: {
  selectedField: Field | null;
  label?: string;
  filter?: "header" | "detail" | "trailer";
  onFieldSelect: (field: Field) => void;
}) {
  const { data } = useContext(ParserContext);
  const [open, setOpen] = useState(false);

  const renderFields = (flag: "header" | "detail" | "trailer") => {
    if (!data[flag].some((rec) => Object.keys(rec).length > 0)) return null;

    return (
      <CommandGroup heading={<span className="capitalize">{flag} Fields</span>}>
        {Object.keys(data[flag][0]).map((field) => (
          <CommandItem
            key={`${flag}${field}`}
            onSelect={() => {
              setOpen(false);
              onFieldSelect({ name: field, flag });
            }}
          >
            {field}
            <CheckIcon
              className={cn(
                "ml-auto",
                selectedField?.name === field ? "opacity-100" : "opacity-0",
              )}
            />
          </CommandItem>
        ))}
      </CommandGroup>
    );
  };

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
          <span className="text-xs text-muted-foreground">
            {label ? label : "Field"}:
          </span>
          {selectedField?.name ? selectedField.name : "Select a field..."}
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
              {filter ? (
                renderFields(filter)
              ) : (
                <>
                  {renderFields("header")}
                  {renderFields("detail")}
                  {renderFields("trailer")}
                </>
              )}
            </ScrollAreaViewport>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
