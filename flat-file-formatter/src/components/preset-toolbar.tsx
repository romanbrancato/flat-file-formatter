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
import { NewPresetButton } from "@/components/new-preset-button";
import { ExportPresetButton } from "@/components/export-preset-button";
import { useContext } from "react";
import { DataContext } from "@/context/data-context";
import { PresetContext } from "@/context/preset-context";

export function PresetToolbar() {
  const { data } = useContext(DataContext);
  const { preset } = useContext(PresetContext);

  return (
    <>
      <div className="flex items-center justify-between py-2 px-5">
        <h2 className="text-md font-semibold whitespace-nowrap">
          File Preview
        </h2>
        <div className="flex flex-row items-center space-x-3">
          <PresetSelector />
          <NewPresetButton
            trigger={
              <Button
                variant="secondary"
                className="hidden sm:flex"
                disabled={data.length === 0}
              >
                New Preset
              </Button>
            }
          />
          <ExportPresetButton
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
                disabled={data.length === 0}
              >
                <DotsHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <NewPresetButton
                trigger={
                  <DropdownMenuItem
                    onSelect={(event) => event.preventDefault()}
                  >
                    <PlusIcon className="mr-2" />
                    New Preset
                  </DropdownMenuItem>
                }
              />
              <ExportPresetButton
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
