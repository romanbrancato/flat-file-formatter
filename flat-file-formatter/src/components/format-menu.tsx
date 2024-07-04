import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ButtonDefineWidths } from "@/components/button-define-widths";
import { useContext, useEffect, useState } from "react";
import { PresetContext } from "@/context/preset-context";
import { SelectAlign } from "@/components/select-align";
import { CheckboxHeader } from "@/components/checkbox-header";
import { SelectSymbol } from "@/components/select-symbol";
import { SelectExport } from "@/components/select-export";
import { ParserContext } from "@/context/parser-context";

export function FormatMenu() {
  const { isReady } = useContext(ParserContext);
  const { preset, setPreset } = useContext(PresetContext);
  const [tab, setTab] = useState<"delimited" | "fixed">(preset.format);

  useEffect(() => {
    setTab(preset.format);
  }, [preset.format]);

  return (
    <Tabs
      value={tab}
      onValueChange={(value: string) =>
        setPreset({ ...preset, format: value as "delimited" | "fixed" })
      }
    >
      <div className="text-sm font-medium space-y-1 leading-none min-w-[200px]">
        <span> Format </span>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="delimited" disabled={!isReady}>
            Delimited
          </TabsTrigger>
          <TabsTrigger value="fixed" disabled={!isReady}>
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
