import {PresetSelector} from "@/components/preset-selector";
import {Button} from "@/components/ui/button";
import {DotsHorizontalIcon, PlusIcon, Share2Icon} from "@radix-ui/react-icons";
import {Separator} from "@/components/ui/separator";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {useContext} from "react";
import {DataContext} from "@/context/data-context";
import {NewPresetButton} from "@/components/new-preset-button";

export function PresetToolbar() {
    const {exportPreset} = useContext(DataContext)
    return (
        <>
            <div className="flex items-center justify-between py-2 px-5">
                <h2 className="text-md font-semibold whitespace-nowrap">File Preview</h2>
                <div className="flex flex-row items-center space-x-3">
                    <PresetSelector/>
                    <NewPresetButton/>
                    <Button variant="secondary" size="icon" onClick={exportPreset} className="hidden sm:flex">
                        <Share2Icon/>
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="flex sm:hidden">
                                <DotsHorizontalIcon/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <PlusIcon className="mr-2"/>
                                New Preset
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Share2Icon className="mr-2"/>
                                Export Preset
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            <Separator/>
        </>
    );
}