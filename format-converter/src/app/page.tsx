"use client"
import {useEffect, useState} from "react";
import {parse} from "papaparse";
import {Dropzone} from "@/components/ui/dropzone";
import {Button} from "@/components/ui/button";
import {DownloadIcon} from "@radix-ui/react-icons";
import {CSVTable} from "@/components/csv-table";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

export default function Home() {
    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<string[]>([]);

    // Parse the CSV file when a new file is set
    useEffect(() => {
        if (file) {
            parse(file, {
                header: true,
                complete: function (results) {
                    setData(results.data as string[]);
                    console.log(results.data);
                }
            });
        }
    }, [file]);

    return (
        <main className="flex flex-col justify-between] space-y-3 mb-3">
            <p className="max-w-[750px] text-center text-md font-light text-foreground">
                Rearrange the columns of a CSV file.
            </p>
            <Dropzone
                onChange={setFile}
                className="w-full"
                fileExtension="csv"
            />
            <CSVTable data={data}/>
            <div className="grid grid-cols-7">
                <Button className="col-span-6">
                    <DownloadIcon className="mr-2"/>
                    Download
                </Button>
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a fruit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Delimiter</SelectLabel>
                            <SelectItem value=",">Apple</SelectItem>
                            <SelectItem value="|">Banana</SelectItem>
                            <SelectItem value="/t">Blueberry</SelectItem>
                            <SelectItem value=";">Grapes</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </main>
    );
}
