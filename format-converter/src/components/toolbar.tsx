import * as React from 'react';
import {PresetSelector} from "@/components/preset-selector";
import {presets} from "@/data/presets";
import {Button} from "@/components/ui/button";
import {DownloadIcon} from "@radix-ui/react-icons";
import {DelimiterSelector} from "@/components/delimiter-selector";

const Toolbar: React.FC = () => {
    return (
        <div className="flex items-center justify-between py-2 px-5">
            <h2 className="text-lg font-light">CSV Preview</h2>
            <div className="flex flex-row items-center space-x-3">
                <PresetSelector presets={presets}/>
                <DelimiterSelector/>
                <Button variant="outline">
                    Save
                </Button>
                <Button size="icon">
                    <DownloadIcon/>
                </Button>
            </div>
        </div>
    );
}

export {Toolbar};