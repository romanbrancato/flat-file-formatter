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
import { Label } from "@/components/ui/label";
import { ParserContext } from "@/context/parser-context";
import { ButtonApplyPreset } from "@/components/button-apply-preset";

export function PresetToolbar() {
  const { isReady } = useContext(ParserContext);
  const { preset } = useContext(PresetContext);
  const { mode } = useContext(ModeContext);

  return (
    <>
      <div className="flex items-center justify-between px-5 py-2">
        <Label>{mode === "batch" ? "File Queue" : "File Preview"}</Label>
        <div className="flex flex-row justify-end space-x-2">
          {mode !== "batch" && <ButtonApplyPreset />}
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
