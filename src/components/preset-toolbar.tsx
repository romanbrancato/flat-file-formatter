import {
  BookmarkIcon,
  CaretSortIcon,
  CheckIcon,
  Cross2Icon,
  DownloadIcon,
  FilePlusIcon,
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
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import { cn, download } from "@/lib/utils";
import { Preset } from "@common/types/preset";
import { DialogSavePreset } from "@/components/dialog-save-preset";
import { loadPresetFromFile, runQueriesFromPreset } from "@common/lib/preset";
import { useTables } from "@/context/tables";
import { toast } from "sonner";
import { usePGlite } from "@/context/db";

export function PresetToolbar({ className }: { className?: string }) {
  const db = usePGlite();
  const { updateTables } = useTables();
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
          <div className="flex items-center gap-x-2">
            <div
              onClick={async (e) => {
                e.stopPropagation();
                const result = await runQueriesFromPreset(db, preset.queries);
                if (result.success) {
                  updateTables();
                } else {
                  toast.error("Failed to run queries, no changes committed", {
                    description: result.error
                  });
                  console.error(
                    "Failed to run queries, no changes committed:",
                    result.error,
                  );
                }
              }}
              className={cn("text-muted-foreground border bg-muted px-1.5 rounded hover:text-foreground hover:border-foreground", { invisible: !preset.name || preset.queries.length === 0 })}
            >
            Run
            </div>
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

                        const arrayBuffer = await file.arrayBuffer();
                        const buffer = new Uint8Array(arrayBuffer);

                        const result = loadPresetFromFile(buffer);
                        if (result.success) {
                          setPreset(result.preset);
                          localStorage.setItem(
                            `preset_${result.preset.name}`,
                            JSON.stringify(result.preset, null, 2),
                          );
                        } else {
                          toast.error("Failed to load preset", {
                            description: result.error
                          });
                          console.error("Failed to load preset:", result.error);
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
                          const content = JSON.stringify(p, null, 2);
                          download(
                            content,
                            `${p.name || "preset"}`,
                            "application/json",
                          );
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
