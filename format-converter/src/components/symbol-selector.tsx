import {CaretSortIcon, CheckIcon} from "@radix-ui/react-icons"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem,} from "@/components/ui/command"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import {useState} from "react";
import {symbols} from "@/data/symbols";

export function SymbolSelector() {
    const [open, setOpen] = useState(false)
    const [selectedSymbol, setSelectedSymbol] = useState<string>("")

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-label="Select a symbol..."
                    aria-expanded={open}
                    className="flex-1 justify-between w-full"
                >
                    {selectedSymbol ? selectedSymbol : "Select a symbol..."}
                    <CaretSortIcon className="ml-2 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search symbols..."/>
                    <CommandGroup heading="Symbols">
                        {symbols.map((delimiter) => (
                            <CommandItem
                                key={delimiter}
                                onSelect={() => {
                                    setSelectedSymbol(delimiter)
                                    setOpen(false)
                                }}
                            >
                                {delimiter}
                                <CheckIcon
                                    className={cn(
                                        "ml-auto",
                                        selectedSymbol === delimiter
                                            ? "opacity-100"
                                            : "opacity-0"
                                    )}
                                />
                            </CommandItem>
                        ))}
                    </CommandGroup>
                    <CommandEmpty>No symbols found.</CommandEmpty>
                </Command>
            </PopoverContent>
        </Popover>
    )
}