"use client";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DialogAddColumn } from "@/components/dialog-add-column";
import { useContext } from "react";
import { PresetContext } from "@/context/preset";
import { DialogDropColumn } from "@/components/dialog-drop-column";
import { cn } from "@/lib/utils";
import { PresetToolbar } from "@/components/preset-toolbar";
import { DialogLoad } from "@/components/dialog-load";
import { DialogExport } from "@/components/dialog-export";
import { GearIcon } from "@radix-ui/react-icons";
import { DialogDelimitedConfig } from "@/components/dialog-delimited-config";
import { DialogFixedConfig } from "./dialog-fixed-config";
import { CommandShortcut } from "./ui/command";
import { useTables } from "@/context/tables";

export function Toolbar() {
  const { preset, setPreset, fixed, delimited } = useContext(PresetContext);
  const {resetTables} = useTables();

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
                <DialogLoad>
                  <button
                    className="w-full cursor-default text-left"
                  >
                    Open...
                  </button>
                </DialogLoad>
                <CommandShortcut>⌘O</CommandShortcut>
              </div>
              <div
                className="hover:bg-accent group flex items-center justify-between rounded-sm px-2 py-1 text-sm [&:has(button:disabled)]:pointer-events-none [&:has(button:disabled)]:opacity-50">
                <DialogExport>
                  <button
                    className="w-full cursor-default text-left disabled:cursor-not-allowed"
                  >
                    Export...
                  </button>
                </DialogExport>
              </div>
              <div
                className="hover:bg-accent group flex items-center justify-between rounded-sm px-2 py-1 text-sm [&:has(button:disabled)]:pointer-events-none [&:has(button:disabled)]:opacity-50">
                  <button
                    className="w-full cursor-default text-left disabled:cursor-not-allowed"
                    onClick={() => {
                      resetTables()
                    }}
                  >
                    Reset
                  </button>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Query Menu */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground relative h-7 rounded-sm px-3 py-1"
            >
              Query
            </Button>
          </PopoverTrigger>
          <PopoverContent className="min-w-[12rem] p-1" align="start">
            <div>
              <DialogAddColumn>
                <div className="hover:bg-accent flex items-center rounded-sm px-2 py-1 text-sm">
                  <button className="w-full text-left">Add Column</button>
                </div>
              </DialogAddColumn>
              <DialogDropColumn>
                <div className="hover:bg-accent flex items-center rounded-sm px-2 py-1 text-sm">
                  <button className="w-full text-left">Drop Column</button>
                </div>
              </DialogDropColumn>
            </div>
          </PopoverContent>
        </Popover>

        {/* Format Menu */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground relative h-7 rounded-sm px-3 py-1"
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

      <PresetToolbar className="w-1/3" />
    </div>
  );
}
