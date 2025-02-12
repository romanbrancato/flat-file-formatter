import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarTrigger
} from "@/components/ui/menubar";
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

  return (
    <div className="flex w-full justify-between border-y py-2">
      <Menubar className="rounded-none border-none">
        <MenubarMenu>
          <MenubarTrigger className="relative">File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem
              onSelect={() => {
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

                  reader.onerror = (error) => {
                    console.error("Error reading file:", error);
                  };

                  reader.readAsArrayBuffer(file);
                };
                input.click();
              }}
              className="flex justify-between group"
            >
              Open...
              <DialogParserConfig>
                <GearIcon onClick={(e) => e.stopPropagation()} className="invisible cursor-pointer group-hover:visible" />
              </DialogParserConfig>
            </MenubarItem>
            <MenubarItem
              onSelect={(e) => {
                const buffers = generateFileBuffers(data, preset);

                if (!buffers?.length) {
                  console.error("Failed to create files");
                  return;
                }

                buffers.forEach((buffer) => {
                  download(buffer.content, buffer.name);
                });
              }}
              disabled={!isReady}
              className="flex justify-between group"
            >
              Download
              <DialogOutputConfig>
                <GearIcon onClick={(e) => e.stopPropagation()} className="invisible cursor-pointer group-hover:visible" />
              </DialogOutputConfig>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <DialogAddField>
              <MenubarItem
                onSelect={(e) => {
                  e.preventDefault();
                }}
                disabled={!isReady}
              >
                Add
              </MenubarItem>
            </DialogAddField>
            <DialogRemoveField>
              <MenubarItem
                onSelect={(e) => {
                  e.preventDefault();
                }}
                disabled={!isReady}
              >
                Remove
              </MenubarItem>
            </DialogRemoveField>
            <DialogConditional>
              <MenubarItem
                onSelect={(e) => {
                  e.preventDefault();
                }}
                disabled={!isReady}
              >
                Conditional
              </MenubarItem>
            </DialogConditional>
            <DialogEquation>
              <MenubarItem
                onSelect={(e) => {
                  e.preventDefault();
                }}
                disabled={!isReady}
              >
                Equation
              </MenubarItem>
            </DialogEquation>
            <DialogReformat>
              <MenubarItem
                onSelect={(e) => {
                  e.preventDefault();
                }}
                disabled={!isReady}
              >
                Reformat
              </MenubarItem>
            </DialogReformat>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Format</MenubarTrigger>
          <MenubarContent>
            <MenubarRadioGroup
              value={preset.format.format}
              onValueChange={(format: string) => {
                setPreset(prev => ({
                  ...prev,
                  format: format === "fixed" ? fixed : delimited
                }));
              }}
            >
              <MenubarRadioItem
                value="delimited"
                onSelect={(e) => e.preventDefault()}
                disabled={!isReady}
                className="flex justify-between"
              >
                Delimited
                <DialogDelimitedConfig>
                  <GearIcon onClick={(e) => e.stopPropagation()}
                            className={cn("cursor-pointer", { invisible: preset.format.format !== "delimited" })} />
                </DialogDelimitedConfig>
              </MenubarRadioItem>
              <MenubarRadioItem
                value="fixed"
                onSelect={(e) => e.preventDefault()}
                disabled={!isReady}
                className="flex justify-between"
              >
                Fixed
                <DialogFixedConfig>
                  <GearIcon onClick={(e) => e.stopPropagation()}
                            className={cn("cursor-pointer", { invisible: preset.format.format !== "fixed" })} />
                </DialogFixedConfig>
              </MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <SelectPreset className="w-1/3" />
    </div>
  );
}
