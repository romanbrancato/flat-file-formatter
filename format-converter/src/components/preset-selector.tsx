import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { Preset } from "@/data/presets"

interface PresetSelectorProps{
    presets: Preset[]
}

export function PresetSelector({ presets }: PresetSelectorProps) {
    const [open, setOpen] = React.useState(false)
    const [selectedPreset, setSelectedPreset] = React.useState<Preset>()

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
                    <CaretSortIcon className="ml-2 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command>
                    <CommandInput placeholder="Search presets..." />
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