import {PresetToolbar} from "@/components/preset-toolbar";
import {CSVTable} from "@/components/csv-table";
import {ExportOptions} from "@/components/export-options";
import {TableToolbar} from "@/components/table-toolbar";

export function Editor() {

    return (
        <div className="rounded-md border">
            <PresetToolbar/>
            <div className="flex flex-col md:flex-row mx-5 gap-y-2 md:gap-x-3 my-3">
                <div className="flex flex-col gap-y-1 overflow-hidden flex-grow">
                    <CSVTable/>
                    <TableToolbar/>
                </div>
                <ExportOptions/>
            </div>
        </div>
    );
}