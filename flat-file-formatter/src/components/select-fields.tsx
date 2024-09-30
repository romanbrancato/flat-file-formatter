import * as React from "react";
import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";

export function SelectFields({
  label,
  options,
  onValueChange,
}: {
  label?: string;
  options: { tag: string; name: string }[];
  onValueChange: (value: string[]) => void;
}) {
  const [selectedValues, setSelectedValues] = useState<
    { tag: string; name: string }[]
  >([]);
  const sortedOptions = options.sort((a, b) => a.tag.localeCompare(b.tag));

  const toggleSelect = (option: { tag: string; name: string }) => {
    setSelectedValues((prev) => {
      const isSelected = prev.find(
        (selected) =>
          selected.tag === option.tag && selected.name === option.name,
      );
      return isSelected
        ? prev.filter((selected) => selected !== isSelected)
        : [...prev, option];
    });
  };

  // Effect to call onValueChange when selectedValues changes
  useEffect(() => {
    onValueChange(selectedValues.map((val) => val.name));
  }, [selectedValues, onValueChange]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircledIcon className="mr-2" />
          {label}
          {selectedValues.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.length > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.length} selected
                  </Badge>
                ) : (
                  selectedValues.map((option) => (
                    <Badge
                      key={option.tag + option.name}
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      {option.name}
                    </Badge>
                  ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={label} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {sortedOptions.map((option) => {
                const isSelected = selectedValues.some(
                  (selected) =>
                    selected.tag === option.tag &&
                    selected.name === option.name,
                );
                return (
                  <CommandItem
                    key={option.tag + option.name}
                    onSelect={() => toggleSelect(option)}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <CheckIcon />
                    </div>
                    <span>{option.name}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      setSelectedValues([]);
                    }}
                    className="justify-center text-center"
                  >
                    Clear fields
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
