import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ButtonDefineWidths } from "@/components/button-define-widths";
import { DataContext } from "@/context/data-context";
import { useContext, useEffect, useState } from "react";
import { PresetContext } from "@/context/preset-context";
import { SelectAlign } from "@/components/select-align";
import { CheckboxHeader } from "@/components/checkbox-header";
import { SelectSymbol } from "@/components/select-symbol";
import { SelectExport } from "@/components/select-export";

export function FormatMenu() {
  const { data } = useContext(DataContext);
  const { preset, setFormat } = useContext(PresetContext);
  const [tab, setTab] = useState<"delimited" | "fixed">(preset.format);

  useEffect(() => {
    setTab(preset.format);
  }, [preset.format]);

  return (
    <Tabs value={tab} onValueChange={(value) => setFormat(value)}>
      <div className="text-sm font-medium space-y-1 leading-none min-w-[200px]">
        <span> Format </span>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="delimited" disabled={data.length === 0}>
            Delimited
          </TabsTrigger>
          <TabsTrigger value="fixed" disabled={data.length === 0}>
            Fixed
          </TabsTrigger>
        </TabsList>
      </div>
      <div className="my-5">
        <TabsContent value="delimited" className="space-y-2">
          <SelectSymbol label="Delimiter" />
          <SelectExport />
          <CheckboxHeader />
        </TabsContent>
        <TabsContent value="fixed" className="space-y-2">
          <ButtonDefineWidths />
          <SelectSymbol label="Padding" />
          <SelectAlign />
          <CheckboxHeader />
        </TabsContent>
      </div>
    </Tabs>
  );
}
