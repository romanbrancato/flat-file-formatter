import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { DialogAddField } from "@/components/dialog-add-field";
import { DataProcessorContext } from "@/context/data-processor-context";
import { useContext } from "react";
import { PresetContext } from "@/context/preset-context";
import { DialogRemoveField } from "@/components/dialog-remove-field";
import { DialogConditional } from "@/components/dialog-conditional";
import { DialogEquation } from "@/components/dialog-equation";
import { DialogReformat } from "@/components/dialog-reformat";
import { cn, download } from "@/lib/utils";
import { SelectPreset } from "@/components/select-preset";
import { generateFileBuffers } from "@common/lib/parser-fns";
import { DialogParserConfig } from "@/components/dialog-parser-config";
import { DialogOutputConfig } from "@/components/dialog-output-config";
import { GearIcon } from "@radix-ui/react-icons";
import { DialogDelimitedConfig } from "@/components/dialog-delimited-config";
import { DialogFixedConfig } from "@/components/dialog-fixed-config";

export function Toolbar() {
  const { isReady, data, setParams } = useContext(DataProcessorContext);
  const { preset, setPreset, fixed, delimited } = useContext(PresetContext);

  const handleFileOpen = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".txt, .csv";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);
        setParams({
          buffer: uint8Array,
          config: preset.parser
        });
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
            <Button variant="ghost" className="relative px-3 py-1 h-7 rounded-sm data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
              File
            </Button>
          </PopoverTrigger>
          <PopoverContent className="min-w-[12rem] p-1" align="start">
            <div>
              <div className="flex items-center justify-between group px-2 py-1 text-sm rounded-sm hover:bg-accent">
                <button onClick={handleFileOpen} className="w-full text-left">
                  Open...
                </button>
                <DialogParserConfig>
                  <GearIcon className="invisible cursor-pointer group-hover:visible" />
                </DialogParserConfig>
              </div>
              <div className="flex items-center justify-between group px-2 py-1 text-sm rounded-sm hover:bg-accent">
                <button
                  onClick={handleDownload}
                  disabled={!isReady}
                  className="w-full text-left"
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

        {/* Edit Menu - Updated */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="relative px-3 py-1 h-7 rounded-sm data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
              Edit
            </Button>
          </PopoverTrigger>
          <PopoverContent className="min-w-[12rem] p-1" align="start">
            <div>
              <DialogAddField>
                <div className="flex items-center px-2 py-1 text-sm rounded-sm hover:bg-accent">
                  <button className="w-full text-left" disabled={!isReady}>
                    Add
                  </button>
                </div>
              </DialogAddField>
              <DialogRemoveField>
                <div className="flex items-center px-2 py-1 text-sm rounded-sm hover:bg-accent">
                  <button className="w-full text-left" disabled={!isReady}>
                    Remove
                  </button>
                </div>
              </DialogRemoveField>
              <DialogConditional>
                <div className="flex items-center px-2 py-1 text-sm rounded-sm hover:bg-accent">
                  <button className="w-full text-left" disabled={!isReady}>
                    Conditional
                  </button>
                </div>
              </DialogConditional>
              <DialogEquation>
                <div className="flex items-center px-2 py-1 text-sm rounded-sm hover:bg-accent">
                  <button className="w-full text-left" disabled={!isReady}>
                    Equation
                  </button>
                </div>
              </DialogEquation>
              <DialogReformat>
                <div className="flex items-center px-2 py-1 text-sm rounded-sm hover:bg-accent">
                  <button className="w-full text-left" disabled={!isReady}>
                    Reformat
                  </button>
                </div>
              </DialogReformat>
            </div>
          </PopoverContent>
        </Popover>

        {/* Format Menu - Updated */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="relative px-3 py-1 h-7 rounded-sm data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
              Format
            </Button>
          </PopoverTrigger>
          <PopoverContent className="min-w-[12rem] p-1" align="start">
            <RadioGroup
              value={preset.format.format}
              onValueChange={(format: string) => {
                setPreset(prev => ({
                  ...prev,
                  format: format === "fixed" ? fixed : delimited
                }));
              }}
            >
              <div>
                <label className="flex items-center justify-between px-2 py-1 text-sm rounded-sm hover:bg-accent">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="delimited" id="delimited" />
                    Delimited
                  </div>
                  <DialogDelimitedConfig>
                    <GearIcon className={cn(
                      "cursor-pointer",
                      { invisible: preset.format.format !== "delimited" }
                    )} />
                  </DialogDelimitedConfig>
                </label>
                <label className="flex items-center justify-between px-2 py-1 text-sm rounded-sm hover:bg-accent">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="fixed" id="fixed" />
                    Fixed
                  </div>
                  <DialogFixedConfig>
                    <GearIcon className={cn(
                      "cursor-pointer",
                      { invisible: preset.format.format !== "fixed" }
                    )} />
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