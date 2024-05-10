"use client"
import {useEffect, useState} from "react";
import {parse} from "papaparse";
import {Dropzone} from "@/components/ui/dropzone";
import {InfoCircledIcon} from "@radix-ui/react-icons";
import {CSVTable} from "@/components/csv-table";
import {Separator} from "@/components/ui/separator";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Toolbar} from "@/components/toolbar";

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
        <main className="flex flex-col justify-between] space-y-3 mb-3">
            <p className="text-center text-md font-light">
                Rearrange the columns of a CSV file.
            </p>
            <Dropzone
                onChange={setFile}
                className="w-full"
                fileExtension="csv"
            />
            <div className="rounded-md border">
                <Toolbar/>
                <Separator/>
                <div className="mx-5">
                    {(data.length > 0) ? (
                        <CSVTable data={data}/>
                    ) : (
                        <div className="flex justify-center">
                            <Alert className="w-1/2 m-3">
                                <InfoCircledIcon/>
                                <AlertTitle>No File Uploaded</AlertTitle>
                                <AlertDescription>
                                    Upload a file above to get started.
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
