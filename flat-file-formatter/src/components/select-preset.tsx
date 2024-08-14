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
import { toast } from "sonner";
import { PresetContext } from "@/context/preset-context";
import { ParserContext } from "@/context/parser-context";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import { ModeContext } from "@/context/mode-context";
import { Input } from "@/components/ui/input";
import { Preset, PresetSchema } from "@/types/schemas";

export function SelectPreset() {
  const { mode } = useContext(ModeContext);
  const { isReady, applyPreset } = useContext(ParserContext);
  const { preset, setPreset } = useContext(PresetContext);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File>();
  const [storedPresets, setStoredPresets] = useState<Preset[]>([]);

  const onSelect = (selectedPreset: Preset) => {
    if (mode !== "batch") applyPreset(selectedPreset);
    setPreset(selectedPreset);
  };

  const onDelete = (selectedPreset: Preset) => {
    localStorage.removeItem(`preset_${selectedPreset.name}`);
    window.dispatchEvent(new Event("storage"));
  };

  useEffect(() => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const obj = JSON.parse(event.target?.result as string);
        const importedPreset = PresetSchema.parse(obj);
        onSelect(importedPreset);
        localStorage.setItem(
          `preset_${importedPreset.name}`,
          JSON.stringify({ ...importedPreset }, null, 2),
        );
      } catch (error) {
        toast.error("Invalid Preset", {
          description: "The selected file is not a valid preset.",
        });
      }
    };
    reader.readAsText(file);
  }, [file]);

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
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-label="Load a preset..."
          aria-expanded={open}
          className="flex-1 justify-between min-w-[225px] md:min-w-[300px]"
          disabled={mode !== "batch" && !isReady}
        >
          {preset && preset.name ? preset.name : "Load a preset..."}
          <CaretSortIcon className="ml-2 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0">
        <Command>
          <CommandInput placeholder="Search presets..." />
          <CommandGroup>
            <Input
              type="file"
              accept=".json"
              onChange={(event) => setFile(event.target.files?.[0])}
            />
          </CommandGroup>
          {storedPresets.length > 0 && (
            <CommandGroup heading="Presets">
              <ScrollArea>
                <ScrollAreaViewport className="max-h-[150px]">
                  {storedPresets.map((p) => (
                    <ContextMenu key={p.name}>
                      <ContextMenuTrigger>
                        <CommandItem
                          onSelect={() => {
                            onSelect(p);
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
