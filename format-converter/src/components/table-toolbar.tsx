import {Button} from "@/components/ui/button";
import {MinusCircledIcon, Pencil1Icon, PlusCircledIcon} from "@radix-ui/react-icons";
import * as React from "react";
import {useContext} from "react";
import {DataContext} from "@/context/data-context";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {ColumnSelector} from "@/components/column-selector";
import {Input} from "@/components/ui/input";

export function TableToolbar() {
    const {data, setData} = useContext(DataContext);

    const addColumn = () => {
        const numFields = Object.keys(data[0]).length;
        const newData = data.map(item => ({
            ...item,
            [`column${numFields}`]: ''
        }));
        setData(newData);
    };

    const removeColumn = () => {

    }

    return (
        <div className="flex flex-row gap-x-1 md:w-1/2">
            <Dialog>
                <DialogTrigger asChild className="flex-1">
                    <Button variant="outline" size="sm" className="w-full border-dashed">
                        <PlusCircledIcon className="mr-2"/>
                        Add Column
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[800px]">
                    <DialogHeader>
                        <DialogTitle>Add Column</DialogTitle>
                        <DialogDescription>
                            Define column header and choose what to populate it with.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-row gap-x-2">
                        <Input placeholder="Name" className="flex-1"/>
                        <Input placeholder="Populate with..." className="flex-1"/>
                        <Button className="flex-shrink">
                            Add
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog>
                <DialogTrigger asChild className="flex-1">
                    <Button variant="outline" size="sm" className="w-full border-dashed">
                        <MinusCircledIcon className="mr-2"/>
                        Remove Column
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[800px]">
                    <DialogHeader>
                        <DialogTitle>Remove Column</DialogTitle>
                        <DialogDescription>
                            Select a column to remove.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-row gap-x-2">
                        <ColumnSelector/>
                        <Button className="flex-shrink">
                            Remove
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
            <Dialog>
                <DialogTrigger asChild className="flex-1">
                    <Button variant="outline" size="sm" className="w-full border-dashed">
                        <Pencil1Icon className="mr-2"/>
                        Edit Column
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[800px]">
                    <DialogHeader>
                        <DialogTitle>Edit Column</DialogTitle>
                        <DialogDescription>
                            Select a column to change all values to.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-row gap-x-2">
                        <ColumnSelector/>
                        <Input placeholder="Change to..." className="flex-1"/>
                        <Button className="flex-shrink">
                            Edit
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
