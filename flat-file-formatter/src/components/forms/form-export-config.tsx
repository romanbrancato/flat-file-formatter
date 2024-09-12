import { useContext, useEffect } from "react";
import { SelectAlign } from "@/components/select-align";
import { SelectSymbol } from "@/components/select-symbol";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { PresetContext } from "@/context/preset-context";
import { Format, FormatSchema } from "@/types/schemas";
import { SelectFormat } from "@/components/select-format";
import { ButtonDefineWidths } from "@/components/button-define-widths";

export function FormExportConfig() {
  const { preset, setPreset } = useContext(PresetContext);

  const form = useForm<Format>({
    resolver: zodResolver(FormatSchema),
    defaultValues: { ...preset.formatSpec },
  });

  const format = useWatch({
    control: form.control,
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

  useEffect(() => {
    form.reset(preset.formatSpec);
  }, [preset.name]);

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form className="flex flex-col gap-y-1">
          <FormField
            control={form.control}
            name="format"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <SelectFormat
                    selectedFormat={field.value}
                    onFormatSelect={(format) => field.onChange(format)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {format.format === "fixed" && (
            <>
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
                        onSymbolSelect={(symbol) => field.onChange(symbol)}
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
                        onAlignSelect={(align) => field.onChange(align)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          {format.format === "delimited" && (
            <>
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
                        onSymbolSelect={(symbol) => field.onChange(symbol)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </form>
      </Form>
    </FormProvider>
  );
}
