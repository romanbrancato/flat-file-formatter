import * as React from "react";
import { useState } from "react";
import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Column } from "./dialog-drop-column"
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";

export function SelectColumns({
  label,
  options,
  defaultValues,
  onValueChange,
}: {
  label?: string;
  options: Column[];
  defaultValues: Column[];
  onValueChange: (fields: Column[]) => void;
}) {
  const [selectedValues, setSelectedValues] = useState<Column[]>(defaultValues);

  const groupedOptions = options.reduce(
    (acc, option) => {
      acc[option.table] = [...(acc[option.table] || []), option];
      return acc;
    },
    {} as Record<string, Column[]>,
  );

  const toggleOption = (option: Column) => {
    const isSelected = selectedValues.some(
      (selected) =>
        selected.table === option.table && selected.name === option.name,
    );

    const newSelectedValues = isSelected
      ? selectedValues.filter(
          (value) => !(value.table === option.table && value.name === option.name),
        )
      : [...selectedValues, option];

    setSelectedValues(newSelectedValues);
    onValueChange(newSelectedValues);
  };

  const toggleGroup = (table: string) => {
    const groupOptions = groupedOptions[table] || [];
    const isAllSelected = groupOptions.every((option) =>
      selectedValues.some(
        (selected) =>
          selected.table === option.table && selected.name === option.name,
      ),
    );

    const newSelectedValues = isAllSelected
      ? selectedValues.filter((value) => value.table !== table)
      : [
          ...selectedValues,
          ...groupOptions.filter(
            (option) =>
              !selectedValues.some(
                (selected) =>
                  selected.table === option.table && selected.name === option.name,
              ),
          ),
        ];

    setSelectedValues(newSelectedValues);
    onValueChange(newSelectedValues);
  };

  return (
    <Popover>
      <PopoverTrigger asChild className="flex-1">
        <Button variant="outline" size="sm" className="w-full border-dashed">
          <PlusCircledIcon className="mr-2" />
          <span className="align">{label}</span>
          {selectedValues.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <div className="space-x-1">
                {selectedValues.length > 3 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.length} selected
                  </Badge>
                ) : (
                  selectedValues.map(({ table, name }) => (
                    <Badge
                      key={`${table}-${name}`}
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      {name}
                    </Badge>
                  ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder={label} />
          <CommandList>
            <ScrollArea>
              <ScrollAreaViewport className="max-h-[300px]">
                <CommandEmpty>No columns found.</CommandEmpty>
                {Object.entries(groupedOptions).map(([table, options]) => (
                  <CommandGroup
                    key={table}
                    heading={
                      <div
                        className="group flex flex-row items-center justify-between hover:cursor-pointer"
                        onClick={() => toggleGroup(table)}
                      >
                        {table}
                        <span className="invisible select-none group-hover:visible">
                          Toggle All
                        </span>
                      </div>
                    }
                  >
                    {options.map((option) => {
                      const isSelected = selectedValues.some(
                        (selected) =>
                          selected.table === option.table &&
                          selected.name === option.name,
                      );
                      return (
                        <CommandItem
                          key={`${option.table}-${option.name}`}
                          onSelect={() => toggleOption(option)}
                        >
                          <div
                            className={`border-primary mr-2 flex items-center justify-center rounded-sm border ${isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"}`}
                          >
                            <CheckIcon />
                          </div>
                          <span>{option.name}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                ))}
                {selectedValues.length > 0 && (
                  <>
                    <CommandSeparator />
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => setSelectedValues([])}
                        className="justify-center text-center"
                      >
                        Clear
                      </CommandItem>
                    </CommandGroup>
                  </>
                )}
              </ScrollAreaViewport>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
