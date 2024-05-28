import {AddFieldButton} from "@/components/add-field-button";
import {RemoveFieldButton} from "@/components/remove-field-button";
import {EditFieldButton} from "@/components/edit-field-button";
import {useContext} from "react";
import {DataContext} from "@/context/data-context";

export function TableToolbar() {
    const {data} = useContext(DataContext);

    return (
        <div className="flex flex-row gap-x-1 md:w-1/2">
            <AddFieldButton disabled={data.length === 0}/>
            <RemoveFieldButton disabled={data.length === 0}/>
            <EditFieldButton disabled={data.length === 0}/>
        </div>
    );
}
