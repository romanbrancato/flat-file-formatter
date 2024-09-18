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
import { Field } from "@/types/schemas";

export function SelectField({
  selectedField,
  label,
  filter,
  onFieldSelect,
}: {
  selectedField: Field | null;
  label?: string;
  filter?: string[];
  onFieldSelect: (field: Field) => void;
}) {
  const { data } = useContext(ParserContext);
  const [open, setOpen] = useState(false);

  function CommandGroupComponent({
    flag,
    fields,
  }: {
    flag: string;
    fields: string[];
  }) {
    return (
      <CommandGroup heading={<span className="capitalize">{flag} Fields</span>}>
        {fields.map((field) => (
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
  }

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
          <span className="font-normal text-xs text-muted-foreground">
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
              {Object.entries(data.records)
                .filter(([tag, records]) => Object.keys(records[0]).length > 0)
                .map(([tag, records]) => (
                  <CommandGroupComponent
                    flag={tag}
                    fields={Object.keys(records[0])}
                    key={tag}
                  />
                ))}
            </ScrollAreaViewport>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
