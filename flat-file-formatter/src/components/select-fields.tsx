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
import { Field } from "@/types/schemas";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";

export function SelectFields({
  label,
  options,
  defaultValues,
  onValueChange,
}: {
  label?: string;
  options: Field[];
  defaultValues: Field[];
  onValueChange: (fields: Field[]) => void;
}) {
  const [selectedValues, setSelectedValues] = useState<Field[]>(defaultValues);

  const groupedOptions = options.reduce(
    (acc, option) => {
      acc[option.tag] = [...(acc[option.tag] || []), option];
      return acc;
    },
    {} as Record<string, Field[]>,
  );

  const toggleSelect = (option: Field) => {
    setSelectedValues((prev) => {
      const isSelected = prev.some((selected) => selected === option);
      const newSelectedValues = isSelected
        ? prev.filter((selected) => selected !== option)
        : [...prev, option];

      onValueChange(newSelectedValues);
      return newSelectedValues;
    });
  };

  const selectAllInTag = (tag: string) => {
    setSelectedValues((prev) => {
      const groupOptions = groupedOptions[tag];
      const newSelectedValues = [
        ...prev.filter((field) => field.tag !== tag),
        ...groupOptions,
      ];
      onValueChange(newSelectedValues);
      return newSelectedValues;
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-full border-dashed">
          <PlusCircledIcon className="mr-2" />
          <span className="align">{label}</span>
          {selectedValues.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <div className="space-x-1 overflow-hidden">
                {selectedValues.length > 4 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.length} selected
                  </Badge>
                ) : (
                  selectedValues.map(({ tag, name }) => (
                    <Badge
                      key={`${tag}-${name}`}
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
                <CommandEmpty>No fields found.</CommandEmpty>
                {Object.entries(groupedOptions).map(([tag, options]) => (
                  <CommandGroup key={tag} heading={tag}>
                    <CommandItem
                      onSelect={() => selectAllInTag(tag)}
                      className="justify-center text-center"
                    >
                      Select All
                    </CommandItem>
                    {options.map((option) => {
                      const isSelected = selectedValues.some(
                        (selected) =>
                          selected.tag === option.tag &&
                          selected.name === option.name,
                      );
                      return (
                        <CommandItem
                          key={`${option.tag}-${option.name}`}
                          onSelect={() => toggleSelect(option)}
                        >
                          <div
                            className={`mr-2 flex items-center justify-center rounded-sm border border-primary ${isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible"}`}
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
                        Clear fields
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
