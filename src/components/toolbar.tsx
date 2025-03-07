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
import { cn, download } from "@/lib/utils";
import { PresetToolbar } from "@/components/preset-toolbar";
import { DialogLoadConfig } from "@/components/dialog-load-config";
import { DialogOutputConfig } from "@/components/dialog-output-config";
import { GearIcon } from "@radix-ui/react-icons";
import { DialogDelimitedConfig } from "@/components/dialog-delimited-config";
import { handleExport } from "@common/lib/export";
import { DialogFixedConfig } from "./dialog-fixed-config";
import { toast } from "sonner";
import { usePGlite } from "@electric-sql/pglite-react";
import { CommandShortcut } from "./ui/command";

export function Toolbar() {
  const { preset, setPreset, fixed, delimited } = useContext(PresetContext);
  const db = usePGlite();

  const handleDownload = async () => {
    const result = await handleExport(db, preset.export, preset.format);
    if (result.success && result.files) {
      result.files.map((file) => {
        download(file.dataString, file.name, "text/plain");
      });
    } else {
      toast.error("Failed to download file", {
        description: result.error,
      });
      console.error("Failed download:", result.error);
    }
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
              <DialogLoadConfig>
                <button
                  className="w-full cursor-default text-left"
                >
                  Open...
                </button>
                </DialogLoadConfig>
                <CommandShortcut>⌘O</CommandShortcut>
              </div>
              <div className="hover:bg-accent group flex items-center justify-between rounded-sm px-2 py-1 text-sm [&:has(button:disabled)]:pointer-events-none [&:has(button:disabled)]:opacity-50">
                <button
                  onClick={handleDownload}
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
              {/*<DialogConditional>*/}
              {/*  <div className="hover:bg-accent flex items-center rounded-sm px-2 py-1 text-sm">*/}
              {/*    <button className="w-full text-left">Conditional</button>*/}
              {/*  </div>*/}
              {/*</DialogConditional>*/}
              {/*<DialogEquation>*/}
              {/*  <div className="hover:bg-accent flex items-center rounded-sm px-2 py-1 text-sm">*/}
              {/*    <button className="w-full text-left">Equation</button>*/}
              {/*  </div>*/}
              {/*</DialogEquation>*/}
              {/*<DialogReformat>*/}
              {/*  <div className="hover:bg-accent flex items-center rounded-sm px-2 py-1 text-sm">*/}
              {/*    <button className="w-full text-left">Reformat</button>*/}
              {/*  </div>*/}
              {/*</DialogReformat>*/}
            </div>
          </PopoverContent>
        </Popover>

        {/* Format Menu - Updated */}
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
