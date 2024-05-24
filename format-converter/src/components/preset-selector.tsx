import {CaretSortIcon, CheckIcon} from "@radix-ui/react-icons"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem,} from "@/components/ui/command"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"

import {useContext, useState} from "react";
import {Preset} from "@/types/preset";
import {DataContext} from "@/context/data-context";
import {Dropzone} from "@/components/dropzone";
import {ScrollArea, ScrollAreaViewport} from "@/components/ui/scroll-area";
import {toast} from "sonner";

export function PresetSelector() {
    const {preset, loadPreset} = useContext(DataContext)
    const [open, setOpen] = useState(false)

    const presets: Preset[] = [
        {
            name: "Default CSV",
            removed: ['BINNumber'],
            added: [{field: 'NewField', value: '21'}, {field: 'NewField2', value: '21'}],
            edited: [{field: 'ClaimType', value: ''}, {field: 'PharmacyStatusCode', value: ''}],
            order: ['NewField', 'NewField2', 'ClaimType', 'PharmacyStatusCode', 'ClaimCounter'],
            export: "txt",
            widths: null,
            symbol: ","
        },
        {
            name: "Default CS",
            removed: ['BINNumber'],
            added: [{field: 'NewField', value: '21'}, {field: 'NewField2', value: '21'}],
            edited: [{field: 'ClaimType', value: ''}, {field: 'PharmacyStatusCode', value: ''}],
            order: ['NewField', 'NewField2', 'ClaimType', 'PharmacyStatusCode', 'ClaimCounter'],
            export: "txt",
            widths: null,
            symbol: ","
        },
        {
            name: "Default C",
            removed: ['BINNumber'],
            added: [{field: 'NewField', value: '21'}, {field: 'NewField2', value: '21'}],
            edited: [{field: 'ClaimType', value: ''}, {field: 'PharmacyStatusCode', value: ''}],
            order: ['NewField', 'NewField2', 'ClaimType', 'PharmacyStatusCode', 'ClaimCounter'],
            export: "txt",
            widths: null,
            symbol: ","
        },
        {
            name: "Default",
            removed: ['BINNumber'],
            added: [{field: 'NewField', value: '21'}, {field: 'NewField2', value: '21'}],
            edited: [{field: 'ClaimType', value: ''}, {field: 'PharmacyStatusCode', value: ''}],
            order: ['NewField', 'NewField2', 'ClaimType', 'PharmacyStatusCode', 'ClaimCounter'],
            export: "txt",
            widths: null,
            symbol: ","
        },
        {
            name: "Defaul",
            removed: ['BINNumber'],
            added: [{field: 'NewField', value: '21'}, {field: 'NewField2', value: '21'}],
            edited: [{field: 'ClaimType', value: ''}, {field: 'PharmacyStatusCode', value: ''}],
            order: ['NewField', 'NewField2', 'ClaimType', 'PharmacyStatusCode', 'ClaimCounter'],
            export: "txt",
            widths: null,
            symbol: ","
        },
        {
            name: "Defau",
            removed: ['BINNumber'],
            added: [{field: 'NewField', value: '21'}, {field: 'NewField2', value: '21'}],
            edited: [{field: 'ClaimType', value: ''}, {field: 'PharmacyStatusCode', value: ''}],
            order: ['NewField', 'NewField2', 'ClaimType', 'PharmacyStatusCode', 'ClaimCounter'],
            export: "txt",
            widths: null,
            symbol: ","
        },
        {
            name: "Defa",
            removed: ['BINNumber'],
            added: [{field: 'NewField', value: '21'}, {field: 'NewField2', value: '21'}],
            edited: [{field: 'ClaimType', value: ''}, {field: 'PharmacyStatusCode', value: ''}],
            order: ['NewField', 'NewField2', 'ClaimType', 'PharmacyStatusCode', 'ClaimCounter'],
            export: "txt",
            widths: null,
            symbol: ","
        }
    ]

    const onPresetSelect = (preset: Preset) => {
        loadPreset(preset);
        toast.success(
            "Preset Loaded", {
                description: `The preset "${preset.name}" has been loaded.`
            })
    }

    const onPresetImport = (file: File | null) => {
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-label="Load a preset..."
                    aria-expanded={open}
                    className="flex-1 justify-between min-w-[225px] md:min-w-[300px]"
                >
                    {preset && preset.name ? preset.name : "Load a preset..."}
                    <CaretSortIcon className="ml-2 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-0">
                <Command>
                    <CommandInput placeholder="Search presets..."/>
                    <CommandGroup heading="Import">
                        <Dropzone
                            onChange={(file) => onPresetImport(file)}
                            className="w-full"
                            fileExtension="json"
                        >
                        </Dropzone>
                    </CommandGroup>
                    <CommandGroup heading="Presets">
                        <ScrollArea>
                            <ScrollAreaViewport className="max-h-[150px]">
                                {presets.map((p, index) => (
                                    <CommandItem
                                        key={index}
                                        onSelect={() => {
                                            onPresetSelect(p)
                                            setOpen(false)
                                        }}
                                    >
                                        {p.name}
                                        <CheckIcon
                                            className={cn(
                                                "ml-auto",
                                                JSON.stringify(preset) === JSON.stringify(p)
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </ScrollAreaViewport>
                        </ScrollArea>
                    </CommandGroup>
                    <CommandEmpty>No presets found.</CommandEmpty>
                </Command>
            </PopoverContent>
        </Popover>
    )
}