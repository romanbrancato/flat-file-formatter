"use client"
import {createContext, useState} from 'react';
import {Preset} from "@/types/preset";

interface PresetContextProps {
    preset: Preset;
}

export const PresetContext = createContext<PresetContextProps>({
    preset: {
        name: "",
        removed: null,
        added: null,
        edited: null,
        order: [],
        export: "csv",
        widths: null,
        symbol: ","
    }
});

export const PresetContextProvider = (props: any) => {
    const [preset, setPreset] = useState<Preset>({
        name: "",
        removed: null,
        added: null,
        edited: null,
        order: [],
        export: "csv",
        widths: null,
        symbol: ","
    });

    const loadPreset = (preset: Preset) => {

    }

    const savePreset = () => {

    }

    const exportPreset = () => {

    }

    return (
        <PresetContext.Provider
            value={{
                preset
            }}
        >
            {props.children}
        </PresetContext.Provider>
    );
};