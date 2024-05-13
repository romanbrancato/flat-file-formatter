"use client"
import {useEffect, useState} from "react";
import {parse} from "papaparse";
import {Dropzone} from "@/components/ui/dropzone";
import {CSVEditor} from "@/components/csv-editor";

export default function App() {
    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<Record<string, unknown>[]>([]);

    // Parse the CSV file when a new file is set
    useEffect(() => {
        if (file) {
            setData([])
            parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: function (results) {
                    console.log("Parsing complete:", results);
                    setData(results.data as Record<string, unknown>[]);
                }
            });
        }
    }, [file]);

    return (
        <main className="flex flex-col justify-between] gap-y-3 mb-3">
            <p className="text-center text-md font-light">
                Rearrange the columns of a CSV file.
            </p>
            <Dropzone
                onChange={setFile}
                className="w-full"
                fileExtension="csv"
            />
            <CSVEditor data={data}/>
        </main>
    )

}
