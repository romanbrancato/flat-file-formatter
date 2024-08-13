import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useContext } from "react";
import { SelectAlign } from "@/components/select-align";
import { CheckboxLabel } from "@/components/checkbox-label";
import { SelectSymbol } from "@/components/select-symbol";
import { ParserContext } from "@/context/parser-context";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

export const WidthsSchema = z.object({
  header: z.record(z.coerce.number().min(1)),
  detail: z.record(z.coerce.number().min(1)),
  trailer: z.record(z.coerce.number().min(1)),
});

export const FormatSchema = z.discriminatedUnion("format", [
  z.object({
    format: z.literal("delimited"),
    delimiter: z.string(),
    label: z.boolean(),
  }),
  z.object({
    format: z.literal("fixed"),
    pad: z.string(),
    align: z.enum(["left", "right"]),
    widths: WidthsSchema,
  }),
]);

export type Format = z.infer<typeof FormatSchema>;

export function FormatMenu() {
  const { data } = useContext(ParserContext);
  const { isReady } = useContext(ParserContext);

  const form = useForm<Format>({
    resolver: zodResolver(FormatSchema),
    defaultValues: {
      format: "delimited",
      delimiter: ",",
      label: false,
      pad: " ",
      align: "left",
      widths: {
        header: Object.fromEntries(
          Object.keys(data.header[0]).map((key) => [key, undefined]),
        ),
        detail: Object.fromEntries(
          Object.keys(data.detail[0]).map((key) => [key, undefined]),
        ),
        trailer: Object.fromEntries(
          Object.keys(data.trailer[0]).map((key) => [key, undefined]),
        ),
      },
    },
  });

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form>
          <FormField
            control={form.control}
            name="format"
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
                    <div className="text-sm font-medium space-y-1 leading-none min-w-[200px]">
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
                        <FormField
                          control={form.control}
                          name="delimiter"
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
                        <FormField
                          control={form.control}
                          name="label"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <CheckboxLabel
                                  checked={field.value}
                                  onCheckedChange={(checked) =>
                                    form.setValue("label", checked, {
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
                      <TabsContent value="fixed" className="space-y-2">
                        {/*<ButtonDefineWidths />*/}
                        <FormField
                          control={form.control}
                          name="pad"
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
                    </div>
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
