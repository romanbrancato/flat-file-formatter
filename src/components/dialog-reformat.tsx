import { useContext, useState } from "react";
import { DataProcessorContext } from "@/context/data-processor";
import { PresetContext } from "@/context/preset";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { Columns, OperationSchema } from "@common/types/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { SelectMultiFields } from "@/components/select-multi-fields";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Selector } from "@/components/selector";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export function DialogReformat({ children }: { children: React.ReactNode }) {
  const { data, focus, reformatData } = useContext(DataProcessorContext);
  const { preset, setPreset } = useContext(PresetContext);
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(OperationSchema),
    defaultValues: {
      operation: "reformat",
      tag: focus,
      fields: [],
      reformat: {
        type: "date",
        pattern: "",
        overpunch: false,
      },
    },
  });

  const type = useWatch({
    control: form.control,
    name: "reformat.type",
  });

  function onSubmit(values: any) {
    reformatData(values);
    setPreset({
      ...preset,
      changes: [...preset.changes, values],
    });
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[75%] max-w-[50%] overflow-auto">
        <DialogHeader>
          <DialogTitle>Reformat</DialogTitle>
          <DialogDescription>
            Define a pattern to reformat selected columns.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-y-1"
            >
              <FormField
                control={form.control}
                name={`fields`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <SelectMultiFields
                        label="Select Fields"
                        options={(data[focus]?.fields ?? []).map((name) => ({
                          tag: focus,
                          name,
                        }))}
                        defaultValues={field.value as Columns[]}
                        onValueChange={(fields) => field.onChange(fields)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`reformat.type`}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Selector
                        label={"type"}
                        selected={field.value}
                        options={[
                          { label: "date", value: "date" },
                          { label: "number", value: "number" },
                        ]}
                        onSelect={(type) => {
                          field.onChange(type);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`reformat.pattern`}
                defaultValue={""}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingLabelInput label="Pattern" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {type === "number" && (
                <FormField
                  control={form.control}
                  name={`reformat.overpunch`}
                  defaultValue={false}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="overpunch"
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(checked)
                            }
                          />
                          <label
                            htmlFor="overpunch"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Convert From Overpunch Format
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <Button type="submit" className="ml-auto w-1/3">
                Apply
              </Button>
            </form>
          </Form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
