import {
    GitHubLogoIcon,
    InfoCircledIcon,
    MinusCircledIcon,
    Pencil1Icon,
    Pencil2Icon,
    PlusCircledIcon
} from "@radix-ui/react-icons";
import {PresetToolbar} from "@/components/preset-toolbar";
import {Separator} from "@/components/ui/separator";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {DelimiterSelector} from "@/components/delimiter-selector";
import {Button} from "@/components/ui/button";
import {CSVTable} from "@/components/csv-table";
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
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Label} from "@/components/ui/label";

export function CSVEditor() {
    const {data, setData} = useContext(DataContext)

    const addColumn = () => {
        const numFields = Object.keys(data[0]).length;
        const newData = data.map(item => ({
            ...item,
            [`column${numFields}`]: ''
        }));
        setData(newData);
    }

    return (
        <div className="rounded-md border">
            <PresetToolbar/>
            <Separator/>
            <div className="mx-5 my-3">
                <div className="grid grid-cols-7 gap-x-3 gap-y-1">
                    <div className="col-span-6 rounded-md border overflow-hidden">
                        {data.length > 0 ? (
                            <CSVTable/>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <Alert className="md:w-1/2 m-3">
                                    <InfoCircledIcon/>
                                    <AlertTitle>No File Uploaded</AlertTitle>
                                    <AlertDescription>
                                        Upload a file above to get started.
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )}
                    </div>
                    <aside className="min-w-[150px]">
                        <div className="text-sm font-medium peer-disabled:cursor-not-allowed mb-1">
                            Export As
                        </div>
                        <Tabs defaultValue="csv">
                            <TabsList className="grid grid-cols-2">
                                <TabsTrigger value="csv">
                                    .csv
                                </TabsTrigger>
                                <TabsTrigger value="txt">
                                    .txt
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="csv">
                                <div className="text-sm font-medium peer-disabled:cursor-not-allowed mb-1">
                                    Delimiter
                                </div>
                                <DelimiterSelector/>
                            </TabsContent>
                            <TabsContent value="txt" className="space-y-2">
                                <div>
                                    <div className="text-sm font-medium peer-disabled:cursor-not-allowed mb-1">
                                        Configure
                                    </div>
                                    <Dialog>
                                        <DialogTrigger className="w-full">
                                            <Button variant="outline" size="sm" className="w-full border-dashed">
                                                <Pencil2Icon className="mr-2"/>
                                                Define Widths
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[600px] max-h-[800px]">
                                            <DialogHeader>
                                                <DialogTitle>Define Widths</DialogTitle>
                                                <DialogDescription>
                                                    Define the widths of each column in characters.
                                                </DialogDescription>
                                            </DialogHeader>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                                <div>
                                    <div className="text-sm font-medium peer-disabled:cursor-not-allowed mb-1">
                                        Padding Symbol
                                    </div>
                                    <DelimiterSelector/>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </aside>
                    <div className="flex flex-row gap-x-3">
                        <Button variant="outline" size="sm" className=" sm:min-w-[150px] border-dashed"
                                onClick={addColumn}>
                            <PlusCircledIcon className="mr-2"/>
                            Add Column
                        </Button>
                        <Button variant="outline" size="sm" className="sm:min-w-[150px] border-dashed">
                            <MinusCircledIcon className="mr-2"/>
                            Remove Column
                        </Button>
                        <Button variant="outline" size="sm" className="sm:min-w-[150px] border-dashed">
                            <Pencil1Icon className="mr-2"/>
                            Edit Column
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}