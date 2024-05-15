import {Button} from "@/components/ui/button";
import {MinusCircledIcon, Pencil1Icon, PlusCircledIcon} from "@radix-ui/react-icons";
import {useContext} from "react";
import {DataContext} from "@/context/data-context";

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

    return (
        <div className="flex flex-row gap-x-1 md:w-1/2">
            <Button variant="outline" size="sm" className="flex-1 border-dashed" onClick={addColumn}>
                <PlusCircledIcon className="mr-2"/>
                Add Column
            </Button>
            <Button variant="outline" size="sm" className="flex-1 border-dashed">
                <MinusCircledIcon className="mr-2"/>
                Remove Column
            </Button>
            <Button variant="outline" size="sm" className="flex-1 border-dashed">
                <Pencil1Icon className="mr-2"/>
                Edit Column
            </Button>
        </div>
    );
}
