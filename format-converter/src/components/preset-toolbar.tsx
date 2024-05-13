import * as React from 'react';
import {PresetSelector} from "@/components/preset-selector";
import {presets} from "@/data/presets";
import {Button} from "@/components/ui/button";
import {Share2Icon} from "@radix-ui/react-icons";
import {Table} from "@tanstack/table-core";

interface PresetToolbarProps<TData> {
    table: Table<TData>
}

export function PresetToolbar<TData>({table}: PresetToolbarProps<TData>) {

    function handlePresetChange(preset: any) {
        console.log(preset)
    }

    return (
        <div className="flex items-center justify-between py-2 px-5">
            <h2 className="text-md font-semibold">File Preview</h2>
            <div className="flex flex-row items-center space-x-3">
                <PresetSelector presets={presets}/>
                <Button variant="outline">
                    New Preset
                </Button>
                <Button size="icon">
                    <Share2Icon/>
                </Button>
            </div>
        </div>
    );
}