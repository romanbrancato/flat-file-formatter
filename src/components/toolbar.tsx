import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { DialogAddField } from "@/components/dialog-add-field";
import { parsePreset } from "@common/lib/parser-fns";
import { DataProcessorContext } from "@/context/data-processor-context";
import { useContext } from "react";
import { PresetContext } from "@/context/preset-context";
import { DialogRemoveField } from "@/components/dialog-remove-field";
import { DialogConditional } from "@/components/dialog-conditional";
import { DialogEquation } from "@/components/dialog-equation";
import { DialogReformat } from "@/components/dialog-reformat";
import { DialogSavePreset } from "@/components/dialog-save-preset";
import { download } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MagicWandIcon } from "@radix-ui/react-icons";
import { SelectPreset } from "@/components/select-preset";
import {generateFileBuffers} from "@common/lib/parser-fns";
import {DialogParserConfig} from "@/components/dialog-parser-config";
import {DialogOutputConfig} from "@/components/dialog-output-config";
import {DialogFormatConfig} from "@/components/dialog-format-config";

export function Toolbar() {
  const { isReady, data, setParams, applyPreset } = useContext(DataProcessorContext);
  const { preset, setPreset } = useContext(PresetContext);

  return (
    <>
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
                        config: preset.parser,
                      });
                    };

                    reader.onerror = (error) => {
                      console.error("Error reading file:", error);
                    };

                    reader.readAsArrayBuffer(file);
                  };
                  input.click();
                }}
            >
              Open...
            </MenubarItem>
            <DialogParserConfig>
              <MenubarItem
                onSelect={(e) => {
                  e.preventDefault();
                }}
                disabled={!isReady}
              >
                Parser Config
              </MenubarItem>
            </DialogParserConfig>
            <DialogOutputConfig>
              <MenubarItem
                onSelect={(e) => {
                  e.preventDefault();
                }}
                disabled={!isReady}
              >
                Output Config
              </MenubarItem>
            </DialogOutputConfig>
            <MenubarItem
                onSelect={(e) => {
                  const buffers = generateFileBuffers(data, preset);

                  if (!buffers?.length) {
                    console.error("Failed to create files");
                    return;
                  }

                  buffers.forEach(buffer => {
                    download(buffer.content, buffer.name);
                  });
                }}
                disabled={!isReady || preset.output.groups.length === 0}
            >
              Download
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="relative">Preset</MenubarTrigger>
          <MenubarContent>
            <MenubarItem
                onSelect={() => {
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

                      // Pass buffer instead of File
                      const parsed = parsePreset(buffer);
                      setPreset(parsed);
                      localStorage.setItem(`preset_${parsed.name}`, JSON.stringify(parsed, null, 2));
                    } catch (error) {
                      console.error("Error loading preset:", error);
                    }
                  };
                  input.click();
                }}
            >
              Open...
            </MenubarItem>

            <DialogSavePreset>
              <MenubarItem
                onSelect={(e) => {
                  e.preventDefault();
                }}
                disabled={!isReady}
              >
                Save
              </MenubarItem>
            </DialogSavePreset>

            <MenubarItem
                onSelect={() => {
                  // Convert JSON to Uint8Array
                  const encoder = new TextEncoder();
                  const content = encoder.encode(JSON.stringify(preset, null, 2));

                  download(
                      content,
                      `${preset.name || 'preset'}.json`
                  );
                }}
                disabled={!preset.name}
            >
              Download
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
              onValueChange={(format: any) =>
                setPreset({
                  ...preset,
                  format: { ...preset.format, format: format },
                })
              }
            >
              <MenubarRadioItem
                value="delimited"
                onSelect={(e) => {
                  e.preventDefault();
                }}
                disabled={!isReady}
              >
                Delimited
              </MenubarRadioItem>
              <MenubarRadioItem
                value="fixed"
                onSelect={(e) => {
                  e.preventDefault();
                }}
                disabled={!isReady}
              >
                Fixed
              </MenubarRadioItem>
            </MenubarRadioGroup>
            <MenubarSeparator />
            <DialogFormatConfig>
              <MenubarItem
                disabled={!isReady}
                onSelect={(e) => {
                  e.preventDefault();
                }}
              >
                Configure Format
              </MenubarItem>
            </DialogFormatConfig>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <div className="flex w-1/3 flex-row justify-end space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => applyPreset(preset.changes)}
          disabled={!preset.name || !isReady}
        >
          <MagicWandIcon />
        </Button>
        <SelectPreset />
      </div>
    </>
  );
}
