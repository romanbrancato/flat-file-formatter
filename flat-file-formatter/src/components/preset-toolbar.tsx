import { PresetSelector } from "@/components/preset-selector";
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
import { PresetNewButton } from "@/components/preset-new-button";
import { PresetExportButton } from "@/components/preset-export-button";
import { useContext } from "react";
import { DataContext } from "@/context/data-context";
import { PresetContext } from "@/context/preset-context";
import { ModeContext } from "@/context/mode-context";
import { DefineSchemaButton } from "@/components/define-schema-button";
import { Label } from "@/components/ui/label";

export function PresetToolbar() {
  const { data, name } = useContext(DataContext);
  const { preset } = useContext(PresetContext);
  const { mode } = useContext(ModeContext);

  return (
    <>
      <div className="flex py-2 px-5 justify-between">
        <div className="flex flex-row items-center w-full min-w-0 gap-x-1">
          <Label className="text-md font-semibold whitespace-nowrap overflow-hidden overflow-ellipsis max-w-[80%]">
            {name && mode === "single" ? name : "File Preview"}
          </Label>
          {mode === "single" && <DefineSchemaButton />}
        </div>
        <div className="flex flex-row space-x-3 justify-end">
          <PresetSelector />
          <PresetNewButton
            trigger={
              <Button
                variant="secondary"
                className="hidden sm:flex"
                disabled={data.length === 0 || mode === "batch"}
              >
                New Preset
              </Button>
            }
          />
          <PresetExportButton
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
                disabled={data.length === 0 || mode === "batch"}
              >
                <DotsHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <PresetNewButton
                trigger={
                  <DropdownMenuItem
                    onSelect={(event) => event.preventDefault()}
                  >
                    <PlusIcon className="mr-2" />
                    New Preset
                  </DropdownMenuItem>
                }
              />
              <PresetExportButton
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
