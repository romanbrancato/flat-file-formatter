import {CaretSortIcon, CheckIcon} from "@radix-ui/react-icons"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem,} from "@/components/ui/command"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"

import {Preset, presets} from "@/data/presets"
import {useState} from "react";

export function PresetSelector() {
    const [open, setOpen] = useState(false)
    const [selectedPreset, setSelectedPreset] = useState<Preset>()

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-label="Load a preset..."
                    aria-expanded={open}
                    className="flex-1 justify-between min-w-[100px] sm:min-w-[300px]"
                >
                    {selectedPreset ? selectedPreset.name : "Load a preset..."}
                    <CaretSortIcon className="ml-2 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command>
                    <CommandInput placeholder="Search presets..."/>
                    <CommandGroup heading="Presets">
                        {presets.map((preset) => (
                            <CommandItem
                                key={preset.id}
                                onSelect={() => {
                                    setSelectedPreset(preset)
                                    setOpen(false)
                                }}
                            >
                                {preset.name}
                                <CheckIcon
                                    className={cn(
                                        "ml-auto",
                                        selectedPreset?.id === preset.id
                                            ? "opacity-100"
                                            : "opacity-0"
                                    )}
                                />
                            </CommandItem>
                        ))}
                    </CommandGroup>
                    <CommandEmpty>No presets found.</CommandEmpty>
                </Command>
            </PopoverContent>
        </Popover>
    )
}