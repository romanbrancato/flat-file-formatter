import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SymbolSelector } from "@/components/symbol-selector";
import { DefineWidthsButton } from "@/components/define-widths-button";
import { DataContext } from "@/context/data-context";
import { useContext, useState, useEffect } from "react";

export function ExportOptions() {
    const { preset} = useContext(DataContext);
    const [tab, setTab] = useState<"csv" | "txt">(preset.export);

    useEffect(() => {
        setTab(preset.export);
    }, [preset.export]);

    const onTabChange = (value: "csv" | "txt") => {
        setTab(value);
        preset.export = value
    };

    return (
        <Tabs value={tab} onValueChange={(value: string) => onTabChange(value as "csv" | "txt")} className="mb-5 md:w-[175px]">
            <div className="text-sm font-medium space-y-1">
                <span> Export As </span>
                <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="csv">
                        .csv
                    </TabsTrigger>
                    <TabsTrigger value="txt">
                        .txt
                    </TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="csv">
                <div className="text-sm font-medium space-y-1">
                    <span>Delimiter</span>
                    <SymbolSelector/>
                </div>
            </TabsContent>
            <TabsContent value="txt" className="space-y-2">
                <div className="text-sm font-medium space-y-1">
                    <span>Configure</span>
                    <DefineWidthsButton/>
                </div>
                <div className="text-sm font-medium space-y-1">
                    <span>Padding Symbol</span>
                    <SymbolSelector/>
                </div>
            </TabsContent>
        </Tabs>
    );
}