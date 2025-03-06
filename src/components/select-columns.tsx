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
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";

type SelectedColumn = {
  table: string;
  name: string;
};

export function SelectColumns({
  label,
  tables,
  defaultValues,
  onValueChange,
}: {
  label?: string;
  tables: Record<string, string[]>;
  defaultValues: SelectedColumn[];
  onValueChange: (fields: SelectedColumn[]) => void;
}) {
  const [selectedValues, setSelectedValues] =
    useState<SelectedColumn[]>(defaultValues);

  const toggleOption = (table: string, name: string) => {
    const isSelected = selectedValues.some(
      (selected) => selected.table === table && selected.name === name,
    );

    const newSelectedValues = isSelected
      ? selectedValues.filter(
          (value) => !(value.table === table && value.name === name),
        )
      : [...selectedValues, { table, name }];

    setSelectedValues(newSelectedValues);
    onValueChange(newSelectedValues);
  };

  const toggleGroup = (table: string) => {
    const tableColumns = tables[table] || [];
    const isAllSelected = tableColumns.every((columnName) =>
      selectedValues.some(
        (selected) => selected.table === table && selected.name === columnName,
      ),
    );

    const newSelectedValues = isAllSelected
      ? selectedValues.filter((value) => value.table !== table)
      : [
          ...selectedValues,
          ...tableColumns
            .filter(
              (columnName) =>
                !selectedValues.some(
                  (selected) =>
                    selected.table === table && selected.name === columnName,
                ),
            )
            .map((columnName) => ({ table, name: columnName })),
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
                <CommandEmpty>No tables found.</CommandEmpty>
                {Object.entries(tables).map(([table, columnNames]) => (
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
                    {columnNames.map((columnName) => {
                      const isSelected = selectedValues.some(
                        (selected) =>
                          selected.table === table &&
                          selected.name === columnName,
                      );
                      return (
                        <CommandItem
                          key={`${table}-${columnName}`}
                          onSelect={() => toggleOption(table, columnName)}
                        >
                          <div
                            className={`border-primary mr-2 flex items-center justify-center rounded-sm border ${isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"}`}
                          >
                            <CheckIcon />
                          </div>
                          <span>{columnName}</span>
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
                        onSelect={() => {
                          setSelectedValues([]);
                          onValueChange([]);
                        }}
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
