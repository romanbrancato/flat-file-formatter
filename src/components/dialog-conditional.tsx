import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OperationSchema } from "@common/types/schemas";
import { useContext, useState } from "react";
import { DataProcessorContext } from "@/context/data-processor";
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
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Cross2Icon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/select-field";
import { FormConditionalActions } from "@/components/form-conditional-actions";
import { PresetContext } from "@/context/preset";
import { Selector } from "@/components/selector";

export function DialogConditional({ children }: { children: React.ReactNode }) {
  const { focus, evaluateConditions } = useContext(DataProcessorContext);
  const { preset, setPreset } = useContext(PresetContext);
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(OperationSchema),
    defaultValues: {
      operation: "conditional",
      tag: focus,
      conditions: [
        { statement: "if", field: null, comparison: "=", value: "" },
      ],
      actionTrue: {},
      actionFalse: {},
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: `conditions`,
    control: form.control,
  });

  function onSubmit(values: any) {
    evaluateConditions(values);
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
          <DialogTitle>Conditional</DialogTitle>
          <DialogDescription>
            Define a condition to apply an action to the data.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-y-1"
            >
              <ScrollArea>
                <ScrollAreaViewport className="max-h-[400px]">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="mr-4 flex flex-row items-center gap-x-1"
                    >
                      <FormField
                        control={form.control}
                        name={`conditions.${index}.statement`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Selector
                                selected={field.value}
                                options={[
                                  { label: "if", value: "if" },
                                  { label: "if not", value: "if not" },
                                ]}
                                onSelect={(statement) =>
                                  field.onChange(statement)
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`conditions.${index}.field`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <SelectField
                                selectedField={field.value}
                                filter={[focus]}
                                onFieldSelect={(selectedField) => {
                                  field.onChange(selectedField);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`conditions.${index}.comparison`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Selector
                                selected={field.value}
                                options={[
                                  { label: "=", value: "=" },
                                  { label: ">", value: ">" },
                                  { label: "<", value: "<" },
                                  { label: ">=", value: ">=" },
                                  { label: "<=", value: "<=" },
                                ]}
                                onSelect={(comparison) => {
                                  field.onChange(comparison);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`conditions.${index}.value`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <FloatingLabelInput label="Value" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Cross2Icon
                        className="ml-auto opacity-70 hover:text-destructive"
                        onClick={() => remove(index)}
                      />
                    </div>
                  ))}
                </ScrollAreaViewport>
              </ScrollArea>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-dashed"
                onClick={(event) => {
                  event.preventDefault();
                  append({
                    statement: "if",
                    field: null,
                    comparison: "=",
                    value: "",
                  });
                }}
              >
                <PlusCircledIcon className="mr-2" />
                Additional Condition
              </Button>
              <FormConditionalActions />
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
