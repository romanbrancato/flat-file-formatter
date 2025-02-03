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
import { DialogConfigureOutput } from "@/components/dialog-configure-output";
import { DialogConfigureParser } from "@/components/dialog-configure-parser";
import { DialogConfigureFormat } from "@/components/dialog-configure-format";

export function Toolbar() {
  const { isReady, setParams, applyPreset } = useContext(DataProcessorContext);
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
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (!file) return;
                  setParams({
                    file: file,
                    config: preset.parser,
                  });
                };
                input.click();
              }}
            >
              Open
            </MenubarItem>
            <DialogConfigureParser>
              <MenubarItem
                onSelect={(e) => {
                  e.preventDefault();
                }}
                disabled={!isReady}
              >
                Configure Parser
              </MenubarItem>
            </DialogConfigureParser>
            <DialogConfigureOutput>
              <MenubarItem
                onSelect={(e) => {
                  e.preventDefault();
                }}
                disabled={!isReady}
              >
                Download
              </MenubarItem>
            </DialogConfigureOutput>
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
                    const parsed = await parsePreset(file);
                    setPreset(parsed);
                  } catch (error) {
                    console.error(error);
                  }
                };
                input.click();
              }}
            >
              Open
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
                download(
                  new File(
                    [JSON.stringify(preset, null, 2)],
                    preset.name || "preset",
                    { type: "application/json" },
                  ),
                );
              }}
              disabled={!isReady}
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
                Add Field
              </MenubarItem>
            </DialogAddField>
            <DialogRemoveField>
              <MenubarItem
                onSelect={(e) => {
                  e.preventDefault();
                }}
                disabled={!isReady}
              >
                Remove Field
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
            <DialogConfigureFormat>
              <MenubarItem
                disabled={!isReady}
                onSelect={(e) => {
                  e.preventDefault();
                }}
              >
                Configure Format
              </MenubarItem>
            </DialogConfigureFormat>
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
