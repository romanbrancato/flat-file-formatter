import {CaretSortIcon, CheckIcon} from "@radix-ui/react-icons"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem,} from "@/components/ui/command"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"

import {useContext, useState} from "react";
import {DataContext} from "@/context/data-context";
import {ScrollArea, ScrollAreaViewport} from "@/components/ui/scroll-area";

export function ColumnSelector() {
    const {data} = useContext(DataContext)
    const [open, setOpen] = useState(false)
    const [selectedColumn, setSelectedColumn] = useState<string>()

    const columns = data.length > 0 ? Object.keys(data[0]) : [];

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-label="Select a column..."
                    aria-expanded={open}
                    className="flex-1 justify-between min-w-[100px] sm:min-w-[300px]"
                >
                    {selectedColumn ? selectedColumn : "Select a column..."}
                    <CaretSortIcon className="ml-2 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" side="bottom" className="p-0">
                <Command>
                    <CommandInput placeholder="Search columns..." className="sticky top-0"/>
                    <ScrollArea>
                        <ScrollAreaViewport className="max-h-[300px]">
                            <CommandGroup heading="Columns">
                                {columns.map((column) => (
                                    <CommandItem
                                        key={column}
                                        onSelect={() => {
                                            setSelectedColumn(column)
                                            setOpen(false)
                                        }}
                                    >
                                        {column}
                                        <CheckIcon
                                            className={cn(
                                                "ml-auto",
                                                selectedColumn === column
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                            <CommandEmpty>No columns found.</CommandEmpty>
                        </ScrollAreaViewport>
                    </ScrollArea>
                </Command>
            </PopoverContent>
        </Popover>
    )
}