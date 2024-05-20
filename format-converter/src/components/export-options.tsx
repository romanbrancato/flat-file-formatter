import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {SymbolSelector} from "@/components/symbol-selector";
import {DefineWidthsButton} from "@/components/define-widths-button";

export function ExportOptions() {

    return (
            <Tabs defaultValue="csv" className="mb-5">
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
    )
}