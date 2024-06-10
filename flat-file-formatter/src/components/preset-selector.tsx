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

import { useContext, useState } from "react";
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
  const {
    data,
    removeField: dataRemoveField,
    addField: dataAddField,
    editField: dataEditField,
    orderFields,
  } = useContext(DataContext);
  const {
    preset,
    savedPresets,
    setName,
    setOrder,
    setSymbol,
    setWidths,
    setExport,
    removeField: presetRemoveField,
    addField: presetAddField,
    editField: presetEditField,
    savePreset,
  } = useContext(PresetContext);
  const [open, setOpen] = useState(false);

  const loadPreset = (preset: Preset) => {
    preset.name && setName(preset.name);
    setSymbol(preset.symbol);
    setWidths(preset.widths);
    setExport(preset.export);

    preset.removed?.forEach((field) => {
      dataRemoveField(field);
      presetRemoveField(field);
    });

    preset.added?.forEach(({ field, value }) => {
      dataAddField(field, value);
      presetAddField(field, value);
    });

    preset.edited?.forEach(({ field, value }) => {
      dataEditField(field, value);
      presetEditField(field, value);
    });

    orderFields(preset.order);
    setOrder(preset.order);
  };

  const onPresetSelect = (selectedPreset: Preset) => {
    loadPreset(selectedPreset);
    toast.success("Preset Loaded", {
      description: `The preset "${selectedPreset.name}" has been loaded.`,
    });
  };

  const onPresetImport = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const obj = JSON.parse(event.target?.result as string);
          const importedPreset = PresetSchema.parse(obj);
          onPresetSelect(importedPreset);
          savePreset();
        } catch (error) {
          toast.error("Invalid Preset", {
            description: "The selected file is not a valid preset.",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const onPresetDelete = (selectedPreset: Preset) => {
    localStorage.removeItem(`preset_${selectedPreset.name}`);
    window.dispatchEvent(new Event("storage"));
  };

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
              onChange={(file) => onPresetImport(file)}
              className="w-full"
              fileExtension=".json"
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
                          onPresetSelect(p);
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
                        onClick={() => onPresetDelete(p)}
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
          <CommandEmpty>No presets found.</CommandEmpty>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
