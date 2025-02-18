import {
  BookmarkIcon,
  CaretSortIcon,
  CheckIcon,
  Cross2Icon,
  DownloadIcon,
  FilePlusIcon,
  MagicWandIcon,
} from "@radix-ui/react-icons";
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

import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { PresetContext } from "@/context/preset";
import { DataProcessorContext } from "@/context/data-processor";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import { cn, download } from "@/lib/utils";
import { Preset } from "@common/types/schemas";
import { parsePreset } from "@common/lib/parser-fns";
import { DialogSavePreset } from "@/components/dialog-save-preset";

export function SelectPreset({ className }: { className?: string }) {
  const { isReady, applyPreset } = useContext(DataProcessorContext);
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
          className={`justify-between ${className}`}
        >
          {preset && preset.name ? preset.name : "Load a preset..."}
          <div className="flex gap-x-2">
            <MagicWandIcon
              onClick={(e) => {
                e.stopPropagation();
                applyPreset(preset.changes);
              }}
              className={cn({ invisible: !preset.name || !isReady })}
            />
            <CaretSortIcon />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <Command>
          <CommandInput placeholder="Search presets..." />
          <CommandEmpty>No presets found.</CommandEmpty>
          <CommandGroup
            heading={
              <div className="flex flex-row items-center justify-between">
                Saved Presets
                <div className="flex gap-x-2">
                  <DialogSavePreset>
                    <BookmarkIcon className="cursor-pointer" />
                  </DialogSavePreset>
                  <FilePlusIcon
                    className="cursor-pointer"
                    onClick={() => {
                      const input = document.createElement("input");
                      input.type = "file";
                      input.accept = ".json";
                      input.onchange = async (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (!file) return;

                        try {
                          // Convert File to Uint8Array
                          const arrayBuffer = await file.arrayBuffer();
                          const buffer = new Uint8Array(arrayBuffer);

                          const parsed = parsePreset(buffer);
                          setPreset(parsed);
                          localStorage.setItem(
                            `preset_${parsed.name}`,
                            JSON.stringify(parsed, null, 2),
                          );
                        } catch (error) {
                          console.error("Error loading preset:", error);
                        }
                      };
                      input.click();
                    }}
                  />
                </div>
              </div>
            }
          >
            <ScrollArea>
              <ScrollAreaViewport className="max-h-[150px]">
                {storedPresets.map((p) => (
                  <CommandItem
                    key={p.name}
                    className="group"
                    onSelect={() => {
                      setPreset(p);
                      setOpen(false);
                    }}
                  >
                    {p.name}
                    <div className="ml-auto flex flex-row gap-x-2">
                      <Cross2Icon
                        className="text-destructive ml-auto cursor-pointer opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(p);
                        }}
                      />
                      <DownloadIcon
                        className="cursor-pointer opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          const encoder = new TextEncoder();
                          const content = encoder.encode(
                            JSON.stringify(p, null, 2),
                          );
                          download(content, `${p.name || "preset"}.json`);
                        }}
                      />
                      <CheckIcon
                        className={cn(
                          preset.name === p.name ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </div>
                  </CommandItem>
                ))}
              </ScrollAreaViewport>
            </ScrollArea>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
