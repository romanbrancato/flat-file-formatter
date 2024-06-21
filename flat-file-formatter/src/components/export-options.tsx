import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SymbolSelector } from "@/components/symbol-selector";
import { DefineWidthsButton } from "@/components/define-widths-button";
import { DataContext } from "@/context/data-context";
import { useContext, useEffect, useState } from "react";
import { PresetContext } from "@/context/preset-context";
import { AlignRadioGroup } from "@/components/align-radio-group";
import { HeaderCheckbox } from "@/components/header-checkbox";

export function ExportOptions() {
  const { data } = useContext(DataContext);
  const { preset, setFormat } = useContext(PresetContext);
  const [tab, setTab] = useState<"csv" | "fixed">(preset.format);

  useEffect(() => {
    setTab(preset.format);
  }, [preset.format]);

  return (
    <Tabs
      value={tab}
      onValueChange={(value) => setFormat(value)}
      className="mb-10"
    >
      <div className="text-sm font-medium space-y-1 mb-2 leading-none">
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
      <TabsContent value="csv" className="space-y-2">
        <div className="text-sm font-medium space-y-1 leading-none">
          <span>Delimiter</span>
          <SymbolSelector />
        </div>
        <HeaderCheckbox />
      </TabsContent>
      <TabsContent value="fixed" className="space-y-2">
        <DefineWidthsButton />
        <div className="text-sm font-medium space-y-1 leading-none">
          <span>Padding</span>
          <SymbolSelector />
        </div>
        <div className="text-sm font-medium space-y-1 leading-none">
          <span>Align Values</span>
          <AlignRadioGroup />
        </div>
        <HeaderCheckbox />
      </TabsContent>
    </Tabs>
  );
}
