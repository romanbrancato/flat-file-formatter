import { SelectPreset } from "@/components/select-preset";
import { Button } from "@/components/ui/button";
import {
  DotsHorizontalIcon,
  PlusIcon,
  Share2Icon,
} from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ButtonNewPreset } from "@/components/button-new-preset";
import { ButtonExportPreset } from "@/components/button-export-preset";
import { useContext } from "react";
import { PresetContext } from "@/context/preset-context";
import { ModeContext } from "@/context/mode-context";
import { ButtonEditName } from "@/components/button-edit-name";
import { Label } from "@/components/ui/label";
import { ParserContext } from "@/context/parser-context";

export function PresetToolbar() {
  const { isReady, data } = useContext(ParserContext);
  const { preset } = useContext(PresetContext);
  const { mode } = useContext(ModeContext);

  return (
    <>
      <div className="flex py-2 px-5 justify-between">
        <div className="flex flex-row items-center w-full min-w-0">
          <Label className="text-md font-semibold whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[80%]">
            {data.name && mode === "single"
              ? data.name
              : mode === "batch"
                ? "File Queue"
                : "File Preview"}
          </Label>
          {mode === "single" && <ButtonEditName />}
        </div>
        <div className="flex flex-row space-x-2 justify-end">
          <SelectPreset />
          {mode !== "batch" && (
            <ButtonNewPreset
              trigger={
                <Button
                  variant="secondary"
                  className="hidden sm:flex"
                  disabled={!isReady}
                >
                  New Preset
                </Button>
              }
            />
          )}
          <ButtonExportPreset
            trigger={
              <Button
                variant="secondary"
                size="icon"
                className="hidden sm:flex"
                disabled={!preset.name}
              >
                <Share2Icon />
              </Button>
            }
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="flex sm:hidden"
                disabled={!isReady}
              >
                <DotsHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <ButtonNewPreset
                trigger={
                  <DropdownMenuItem
                    onSelect={(event) => event.preventDefault()}
                  >
                    <PlusIcon className="mr-2" />
                    New Preset
                  </DropdownMenuItem>
                }
              />
              <ButtonExportPreset
                trigger={
                  <DropdownMenuItem disabled={!preset.name}>
                    <Share2Icon className="mr-2" />
                    Export Preset
                  </DropdownMenuItem>
                }
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Separator />
    </>
  );
}
