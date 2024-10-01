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
import { Output, OutputSchema } from "@/types/schemas";
import { SelectFormat } from "@/components/select-format";
import { FormGroups } from "@/components/forms/form-groups";
import { FormDefineWidths } from "@/components/forms/form-define-widths";

export function FormOutput() {
  const { preset, setPreset } = useContext(PresetContext);

  const form = useForm<Output>({
    resolver: zodResolver(OutputSchema),
    defaultValues: { ...preset.output },
  });

  const format = useWatch({
    control: form.control,
    name: "details.format",
  });

  const output = useWatch({
    control: form.control,
  });

  useEffect(() => {
    const values = OutputSchema.safeParse(output);
    if (values.success) {
      setPreset({
        ...preset,
        output: values.data,
      });
    }
  }, [output]);

  useEffect(() => {
    form.reset(preset.output);
  }, [preset.name]);

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form className="flex flex-col gap-y-1">
          <FormField
            control={form.control}
            name="details.format"
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
          {format === "fixed" && (
            <>
              <FormDefineWidths />
              <FormField
                control={form.control}
                name="details.pad"
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
                name="details.align"
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
          {format === "delimited" && (
            <FormField
              control={form.control}
              name="details.delimiter"
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
          )}
          <FormGroups />
        </form>
      </Form>
    </FormProvider>
  );
}
