import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DefineWidthsButton } from "@/components/define-widths-button";
import { DataContext } from "@/context/data-context";
import { useContext, useEffect, useState } from "react";
import { PresetContext } from "@/context/preset-context";
import { AlignSelect } from "@/components/align-select";
import { HeaderCheckbox } from "@/components/header-checkbox";
import { SymbolSelect } from "@/components/symbol-select";

export function FormatMenu() {
  const { data } = useContext(DataContext);
  const { preset, setFormat } = useContext(PresetContext);
  const [tab, setTab] = useState<"csv" | "fixed">(preset.format);

  useEffect(() => {
    setTab(preset.format);
  }, [preset.format]);

  return (
    <Tabs value={tab} onValueChange={(value) => setFormat(value)}>
      <div className="text-sm font-medium space-y-1 leading-none min-w-[200px]">
        <span> Format </span>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="csv" disabled={data.length === 0}>
            csv
          </TabsTrigger>
          <TabsTrigger value="fixed" disabled={data.length === 0}>
            Fixed
          </TabsTrigger>
        </TabsList>
      </div>
      <div className="my-5">
        <TabsContent value="csv" className="space-y-2">
          <SymbolSelect label="Delimiter" />
          <HeaderCheckbox />
        </TabsContent>
        <TabsContent value="fixed" className="space-y-2">
          <DefineWidthsButton />
          <SymbolSelect label="Padding" />
          <AlignSelect />
          <HeaderCheckbox />
        </TabsContent>
      </div>
    </Tabs>
  );
}
