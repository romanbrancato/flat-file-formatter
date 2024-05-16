import {PresetSelector} from "@/components/preset-selector";
import {Button} from "@/components/ui/button";
import {Share2Icon} from "@radix-ui/react-icons";
import {Separator} from "@/components/ui/separator";

export function PresetToolbar() {

    function handlePresetChange(preset: any) {
        console.log(preset)
    }

    return (
        <>
            <div className="flex items-center justify-between py-2 px-5">
                <h2 className="text-md font-semibold whitespace-nowrap">File Preview</h2>
                <div className="flex flex-row items-center space-x-3">
                    <PresetSelector/>
                    <Button variant="secondary">
                        New Preset
                    </Button>
                    <Button variant="secondary" size="icon">
                        <Share2Icon/>
                    </Button>
                </div>
            </div>
            <Separator/>
        </>
    );
}