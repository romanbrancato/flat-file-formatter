"use client"
import {useContext, useEffect, useState} from "react";
import {parse} from "papaparse";
import {Dropzone} from "@/components/ui/dropzone";
import {CSVEditor} from "@/components/csv-editor";
import {DataContext} from "@/context/data-context";

export default function App() {
    const {data, setData} = useContext(DataContext);
    const [file, setFile] = useState<File | null>(null);

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
            <p className="text-center text-md font-bold">
                Format a CSV File.
            </p>
            <Dropzone
                onChange={setFile}
                className="w-full"
                fileExtension="csv"
            />
            <CSVEditor />
        </main>
    )

}
