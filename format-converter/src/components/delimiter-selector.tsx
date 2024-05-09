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
import {useState} from "react";

const delimiters = [
    ",",
    ";",
    ":",
    "|",
    "Tab",
    "Space",
    "="
]
export function DelimiterSelector() {
    const [open, setOpen] = useState(false)
    const [selectedDelimiter, setSelectedDelimiter] = useState<string>("")

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-label="Select delimiter..."
                    aria-expanded={open}
                    className="flex-1 justify-between md:max-w-[200px] lg:max-w-[300px]"
                >
                    {selectedDelimiter ? selectedDelimiter : "Select delimiter..."}
                    <CaretSortIcon className="ml-2 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder="Search delimiters..." />
                    <CommandGroup heading="Delimiters">
                        {delimiters.map((delimiter) => (
                            <CommandItem
                                key={delimiter}
                                onSelect={() => {
                                    setSelectedDelimiter(delimiter)
                                    setOpen(false)
                                }}
                            >
                                {delimiter}
                                <CheckIcon
                                    className={cn(
                                        "ml-auto",
                                        selectedDelimiter === delimiter
                                            ? "opacity-100"
                                            : "opacity-0"
                                    )}
                                />
                            </CommandItem>
                        ))}
                    </CommandGroup>
                    <CommandEmpty>No delimiters found.</CommandEmpty>
                </Command>
            </PopoverContent>
        </Popover>
    )
}