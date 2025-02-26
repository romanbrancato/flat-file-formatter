"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DialogAddField } from "@/components/dialog-add-field";
import { DataProcessorContext } from "@/context/data-processor";
import { useContext } from "react";
import { PresetContext } from "@/context/preset";
import { DialogRemoveField } from "@/components/dialog-remove-field";
import { DialogConditional } from "@/components/dialog-conditional";
import { DialogEquation } from "@/components/dialog-equation";
import { DialogReformat } from "@/components/dialog-reformat";
import { cn, download } from "@/lib/utils";
import { SelectPreset } from "@/components/select-preset";
import { generateFileBuffers } from "@common/lib/parser-fns";
import { DialogLoadConfig } from "@/components/dialog-load-config";
import { DialogOutputConfig } from "@/components/dialog-output-config";
import { GearIcon } from "@radix-ui/react-icons";
import { DialogDelimitedConfig } from "@/components/dialog-delimited-config";
import { DialogFixedConfig } from "@/components/dialog-fixed-config";
import { loadCSVIntoTable, loadFixedIntoTable } from "@common/lib/load";
import { usePGlite } from "@electric-sql/pglite-react";
import { useTables } from "@/context/tables";

export function Toolbar() {
  const { tables, setTables } = useTables();
  const { isReady, data, setParams } = useContext(DataProcessorContext);
  const { preset, setPreset, fixed, delimited } = useContext(PresetContext);
  const db = usePGlite();

  const handleFileOpen = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt, .csv";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      // Reset input value to allow re-selecting same file
      (e.target as HTMLInputElement).value = "";

      const reader = new FileReader();
      reader.onload = async () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        const result =
          preset.parser.format === "delimited"
            ? await loadCSVIntoTable(uint8Array, db, preset.parser)
            : await loadFixedIntoTable(uint8Array, db, preset.parser);

        if (result.success) {
          setTables((prev) => new Set([...prev, result.table!]));
        } else {
          console.error("Failed to load file:", result.error);
        }
      };
      reader.onerror = (error) => console.error("Error reading file:", error);
      reader.readAsArrayBuffer(file);
    };
    input.click();
  };

  const handleDownload = () => {
    const buffers = generateFileBuffers(data, preset);
    buffers?.forEach((buffer) => download(buffer.content, buffer.name));
  };

  return (
    <div className="flex w-full justify-between border-y py-2">
      <div className="flex items-center gap-x-1">
        {/* File Menu */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground relative h-7 rounded-sm px-3 py-1"
            >
              File
            </Button>
          </PopoverTrigger>
          <PopoverContent className="min-w-[12rem] p-1" align="start">
            <div>
              <div className="hover:bg-accent group flex items-center justify-between rounded-sm px-2 py-1 text-sm">
                <button
                  onClick={handleFileOpen}
                  className="w-full cursor-default text-left"
                >
                  Open...
                </button>
                <DialogLoadConfig>
                  <GearIcon className="invisible cursor-pointer group-hover:visible" />
                </DialogLoadConfig>
              </div>
              <div className="hover:bg-accent group flex items-center justify-between rounded-sm px-2 py-1 text-sm [&:has(button:disabled)]:pointer-events-none [&:has(button:disabled)]:opacity-50">
                <button
                  onClick={handleDownload}
                  disabled={!isReady}
                  className="w-full cursor-default text-left disabled:cursor-not-allowed"
                >
                  Download
                </button>
                <DialogOutputConfig>
                  <GearIcon className="invisible cursor-pointer group-hover:visible" />
                </DialogOutputConfig>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Edit Menu */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground relative h-7 rounded-sm px-3 py-1"
              disabled={!isReady}
            >
              Edit
            </Button>
          </PopoverTrigger>
          <PopoverContent className="min-w-[12rem] p-1" align="start">
            <div>
              <DialogAddField>
                <div className="hover:bg-accent flex items-center rounded-sm px-2 py-1 text-sm">
                  <button className="w-full text-left">Add</button>
                </div>
              </DialogAddField>
              <DialogRemoveField>
                <div className="hover:bg-accent flex items-center rounded-sm px-2 py-1 text-sm">
                  <button className="w-full text-left">Remove</button>
                </div>
              </DialogRemoveField>
              <DialogConditional>
                <div className="hover:bg-accent flex items-center rounded-sm px-2 py-1 text-sm">
                  <button className="w-full text-left">Conditional</button>
                </div>
              </DialogConditional>
              <DialogEquation>
                <div className="hover:bg-accent flex items-center rounded-sm px-2 py-1 text-sm">
                  <button className="w-full text-left">Equation</button>
                </div>
              </DialogEquation>
              <DialogReformat>
                <div className="hover:bg-accent flex items-center rounded-sm px-2 py-1 text-sm">
                  <button className="w-full text-left">Reformat</button>
                </div>
              </DialogReformat>
            </div>
          </PopoverContent>
        </Popover>

        {/* Format Menu - Updated */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground relative h-7 rounded-sm px-3 py-1"
              disabled={!isReady}
            >
              Format
            </Button>
          </PopoverTrigger>
          <PopoverContent className="min-w-[12rem] p-1" align="start">
            <RadioGroup
              value={preset.format.format}
              onValueChange={(format: string) => {
                setPreset((prev) => ({
                  ...prev,
                  format: format === "fixed" ? fixed : delimited,
                }));
              }}
            >
              <div>
                <label className="hover:bg-accent flex items-center justify-between rounded-sm px-2 py-1 text-sm">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="delimited" id="delimited" />
                    Delimited
                  </div>
                  <DialogDelimitedConfig>
                    <GearIcon
                      className={cn("cursor-pointer", {
                        invisible: preset.format.format !== "delimited",
                      })}
                    />
                  </DialogDelimitedConfig>
                </label>
                <label className="hover:bg-accent flex items-center justify-between rounded-sm px-2 py-1 text-sm">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="fixed" id="fixed" />
                    Fixed
                  </div>
                  <DialogFixedConfig>
                    <GearIcon
                      className={cn("cursor-pointer", {
                        invisible: preset.format.format !== "fixed",
                      })}
                    />
                  </DialogFixedConfig>
                </label>
              </div>
            </RadioGroup>
          </PopoverContent>
        </Popover>
      </div>

      <SelectPreset className="w-1/3" />
    </div>
  );
}
