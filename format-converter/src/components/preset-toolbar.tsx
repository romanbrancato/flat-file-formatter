import {PresetSelector} from "@/components/preset-selector";
import {Button} from "@/components/ui/button";
import {DotsHorizontalIcon, PlusIcon, Share2Icon, UploadIcon} from "@radix-ui/react-icons";
import {Separator} from "@/components/ui/separator";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator, DropdownMenuShortcut,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export function PresetToolbar() {

    return (
        <>
            <div className="flex items-center justify-between py-2 px-5">
                <h2 className="text-md font-semibold whitespace-nowrap">File Preview</h2>
                <div className="flex flex-row items-center space-x-3">
                    <PresetSelector/>
                    <Button variant="secondary" className="hidden sm:flex">
                        New Preset
                    </Button>
                    <Button variant="secondary" size="icon" className="hidden sm:flex">
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