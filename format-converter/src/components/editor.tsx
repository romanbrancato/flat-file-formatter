import {PresetToolbar} from "@/components/preset-toolbar";
import {CSVTable} from "@/components/csv-table";
import {ExportOptions} from "@/components/export-options";
import {TableToolbar} from "@/components/table-toolbar";
import {Button} from "@/components/ui/button";
import {Share2Icon} from "@radix-ui/react-icons";

export function Editor() {

    return (
        <div className="rounded-md border">
            <PresetToolbar/>
            <div className="flex flex-col md:flex-row mx-5 gap-y-2 md:gap-x-3 my-3">
                <div className="flex flex-col gap-y-1 overflow-hidden flex-grow">
                    <CSVTable/>
                    <TableToolbar/>
                </div>
                <div className="flex flex-col">
                    <ExportOptions/>
                    <Button className="md:mt-auto mt-5">
                        <Share2Icon className="mr-2"/>
                        Export File
                    </Button>
                </div>
            </div>
        </div>
    );
}