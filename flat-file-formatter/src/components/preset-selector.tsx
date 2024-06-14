import { CaretSortIcon, CheckIcon, Cross2Icon } from "@radix-ui/react-icons";
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

import { useContext, useEffect, useState } from "react";
import { Preset, PresetSchema } from "@/types/preset";
import { DataContext } from "@/context/data-context";
import { Dropzone } from "@/components/dropzone";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { PresetContext } from "@/context/preset-context";

export function PresetSelector() {
  const { data, applyPreset } =
    useContext(DataContext);
  const { preset, savedPresets, setPreset, savePreset } =
    useContext(PresetContext);
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const onSelect = (selectedPreset: Preset) => {
    applyPreset(selectedPreset);
    setPreset(selectedPreset);
    toast.success("Preset Loaded", {
      description: `The preset "${selectedPreset.name}" has been loaded.`,
    });
  };

  const onDelete = (selectedPreset: Preset) => {
    localStorage.removeItem(`preset_${selectedPreset.name}`);
    window.dispatchEvent(new Event("storage"));
  };

  // Handle imported presets
  useEffect(() => {
    if (!files.length) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const obj = JSON.parse(event.target?.result as string);
        const importedPreset = PresetSchema.parse(obj);
        onSelect(importedPreset);
        savePreset();
      } catch (error) {
        toast.error("Invalid Preset", {
          description: "The selected file is not a valid preset.",
        });
      }
    };
    reader.readAsText(files[files.length - 1]);
  }, [files]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-label="Load a preset..."
          aria-expanded={open}
          className="flex-1 justify-between min-w-[225px] md:min-w-[300px]"
          disabled={data.length === 0}
        >
          {preset && preset.name ? preset.name : "Load a preset..."}
          <CaretSortIcon className="ml-2 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0">
        <Command>
          <CommandInput placeholder="Search presets..." />
          <CommandGroup heading="Import">
            <Dropzone
              onChange={setFiles}
              className="w-full"
              fileExtension=".json"
              showInfo={false}
            />
          </CommandGroup>
          <CommandGroup heading="Presets">
            <ScrollArea>
              <ScrollAreaViewport className="max-h-[150px]">
                {savedPresets.map((p) => (
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
        </Command>
      </PopoverContent>
    </Popover>
  );
}
