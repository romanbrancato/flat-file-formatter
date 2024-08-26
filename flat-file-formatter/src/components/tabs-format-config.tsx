import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContext, useEffect } from "react";
import { SelectAlign } from "@/components/select-align";
import { SelectSymbol } from "@/components/select-symbol";
import { ParserContext } from "@/context/parser-context";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { ButtonDefineWidths } from "@/components/button-define-widths";
import { PresetContext } from "@/context/preset-context";
import { Format, FormatSchema } from "@/types/schemas";

export function TabsFormatConfig() {
  const { data, isReady } = useContext(ParserContext);
  const { preset, setPreset } = useContext(PresetContext);

  const form = useForm<Format>({
    resolver: zodResolver(FormatSchema),
    defaultValues: {
      widths: {
        header: Object.fromEntries(
          Object.keys(data.records.header[0]).map((key) => [key, 0]),
        ),
        detail: Object.fromEntries(
          Object.keys(data.records.detail[0]).map((key) => [key, 0]),
        ),
        trailer: Object.fromEntries(
          Object.keys(data.records.trailer[0]).map((key) => [key, 0]),
        ),
      },
    },
  });

  const format = useWatch({
    control: form.control,
    name: [],
  });

  useEffect(() => {
    const values = FormatSchema.safeParse(form.getValues());
    if (values.success) {
      setPreset({
        ...preset,
        formatSpec: values.data,
      });
    }
  }, [format]);

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form>
          <FormField
            control={form.control}
            name="format"
            defaultValue="fixed"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Tabs
                    value={field.value}
                    onValueChange={(format: string) => {
                      form.setValue("format", format as "delimited" | "fixed", {
                        shouldValidate: true,
                      });
                    }}
                  >
                    <div className="text-sm font-medium leading-none min-w-[200px]">
                      <TabsList className="grid grid-cols-2">
                        <TabsTrigger value="fixed" disabled={!isReady}>
                          Fixed
                        </TabsTrigger>
                        <TabsTrigger value="delimited" disabled={!isReady}>
                          Delimited
                        </TabsTrigger>
                      </TabsList>
                    </div>
                    <TabsContent value="fixed" className="space-y-1 py-2">
                      <ButtonDefineWidths />
                      <FormField
                        control={form.control}
                        name="pad"
                        defaultValue=" "
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <SelectSymbol
                                label="Pad With"
                                selectedSymbol={field.value}
                                onSymbolSelect={(symbol) =>
                                  form.setValue("pad", symbol, {
                                    shouldValidate: true,
                                  })
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="align"
                        defaultValue="left"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <SelectAlign
                                selectedAlign={field.value}
                                onAlignSelect={(align) =>
                                  form.setValue("align", align, {
                                    shouldValidate: true,
                                  })
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    <TabsContent value="delimited" className="space-y-1 py-2">
                      <FormField
                        control={form.control}
                        name="delimiter"
                        defaultValue=","
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <SelectSymbol
                                label="Delimiter"
                                selectedSymbol={field.value}
                                onSymbolSelect={(symbol) =>
                                  form.setValue("delimiter", symbol, {
                                    shouldValidate: true,
                                  })
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  </Tabs>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </FormProvider>
  );
}
