import {PresetToolbar} from "@/components/preset-toolbar";
import {CSVTable} from "@/components/csv-table";
import {ExportOptions} from "@/components/export-options";
import {TableToolbar} from "@/components/table-toolbar";
import {ExportFileButton} from "@/components/export-file-button";
import {useContext} from "react";
import {ModeContext} from "@/context/mode-context";
import {Cross2Icon, FileTextIcon, Share2Icon} from "@radix-ui/react-icons";
import {Button} from "@/components/ui/button";
import {parse, unparse} from "papaparse";
import {DataContext} from "@/context/data-context";
import {PresetContext} from "@/context/preset-context";

interface PreviewProps {
    files: File[];
}

export function Preview({files}: PreviewProps) {
    const {mode} = useContext(ModeContext);
    const {data, name, setData, applyPreset} = useContext(DataContext);
    const {preset} = useContext(PresetContext);

    const exportFiles = () => {
        files.forEach((file) => {
            parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: function (results) {
                    setData(results.data as Record<string, unknown>[]);

                    applyPreset(preset);

                    let flatData;
                    const config = {
                        delimiter: preset.symbol,
                        header: preset.header,
                        skipEmptyLines: true,
                    };
                    flatData = unparse(data, config);

                    const url = URL.createObjectURL(new Blob([flatData]));
                    const link = document.createElement("a");
                    link.setAttribute("href", url);
                    link.setAttribute("download", `${name}.${preset.export}`);
                    link.click();
                }
        });
    }
)

}

return (
    <div className="rounded-md border">
        <PresetToolbar/>
        <div className="flex flex-col md:flex-row mx-5 gap-y-2 md:gap-x-3 my-3">
            {mode === "single" ? (
                <>
                    <div className="flex flex-col gap-y-1 overflow-hidden flex-grow">
                        <CSVTable/>
                        <TableToolbar/>
                    </div>
                    <div className="flex flex-col">
                        <ExportOptions/>
                        <ExportFileButton/>
                    </div>
                </>
            ) : (
                <div className="flex flex-col w-full gap-y-1">
                    <div className="flex flex-col gap-y-2 mx-auto w-full border rounded-md p-2">
                        {files.map((file, index) => (
                            <div
                                key={index}
                                className="flex flex-row justify-between items-center rounded-md px-5 py-3 bg-muted text-xs font-bold"
                            >
                                <div className="flex flex-row items-center gap-x-2">
                                    <FileTextIcon/> {file.name}
                                </div>
                                <span>{(file.size / 1024).toFixed(2)} KB</span>
                                <Cross2Icon/>
                            </div>
                        ))}
                    </div>
                    <Button onClick={exportFiles} className="w-[175px] gap-x-2 ml-auto">
                        <Share2Icon/>
                        Export Files
                    </Button>
                </div>
            )}
        </div>
    </div>
);
}
