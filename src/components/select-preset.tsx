import { CaretSortIcon, CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
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

import { useContext, useEffect, useState } from "react";
import { PresetContext } from "@/context/preset-context";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import { Preset } from "@common/types/schemas";

export function SelectPreset() {
  const { preset, setPreset } = useContext(PresetContext);
  const [open, setOpen] = useState(false);
  const [storedPresets, setStoredPresets] = useState<Preset[]>([]);

  const onDelete = (selectedPreset: Preset) => {
    localStorage.removeItem(`preset_${selectedPreset.name}`);
    window.dispatchEvent(new Event("storage"));
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setStoredPresets(
        Object.keys(localStorage)
          .filter((key) => key.startsWith("preset_"))
          .map((key) => {
            return JSON.parse(localStorage.getItem(key) as string);
          }),
      );
    };
    handleStorageChange();

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [preset]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-label="Load a preset..."
          aria-expanded={open}
          className="flex-1 justify-between"
        >
          {preset && preset.name ? preset.name : "Load a preset..."}
          <CaretSortIcon className="ml-2 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0">
        <Command>
          <CommandInput placeholder="Search presets..." />
          {storedPresets.length > 0 && (
            <CommandGroup heading="Presets">
              <ScrollArea>
                <ScrollAreaViewport className="max-h-[150px]">
                  {storedPresets.map((p) => (
                    <ContextMenu key={p.name}>
                      <ContextMenuTrigger>
                        <CommandItem
                          onSelect={() => {
                            setPreset(p);
                            setOpen(false);
                          }}
                        >
                          {p.name}
                          <CheckIcon
                            className={cn(
                              "ml-auto",
                              preset.name === p.name
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem
                          className="text-destructive"
                          onClick={() => onDelete(p)}
                        >
                          Delete
                          <Cross2Icon className="ml-auto" />
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
                  ))}
                </ScrollAreaViewport>
              </ScrollArea>
            </CommandGroup>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
