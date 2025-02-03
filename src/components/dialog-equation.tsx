import { useContext, useState } from "react";
import { DataProcessorContext } from "@/context/data-processor-context";
import { PresetContext } from "@/context/preset-context";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OperationSchema } from "@common/types/schemas";
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
import { SelectField } from "@/components/select-field";
import { Cross2Icon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Selector } from "@/components/selector";

export function DialogEquation({ children }: { children: React.ReactNode }) {
  const { focus, evaluateEquation } = useContext(DataProcessorContext);
  const { preset, setPreset } = useContext(PresetContext);
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(OperationSchema),
    defaultValues: {
      operation: "equation",
      tag: focus,
      direction: "row",
      equation: [{ operator: "+", field: null }],
      output: null,
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: `equation`,
    control: form.control,
  });

  const direction = useWatch({
    control: form.control,
    name: "direction",
  });

  function onSubmit(values: any) {
    evaluateEquation(values);
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
          <DialogTitle>Equation</DialogTitle>
          <DialogDescription>
            Define an equation to calculate across the data.
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
                name="direction"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Selector
                        label={"direction"}
                        selected={field.value as "row" | "column"}
                        options={[
                          { label: "row", value: "row" },
                          { label: "column", value: "column" },
                        ]}
                        onSelect={(direction) => {
                          field.onChange(direction);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <ScrollArea>
                <ScrollAreaViewport className="max-h-[400px]">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="mr-4 flex flex-row items-center gap-x-2"
                    >
                      <FormField
                        control={form.control}
                        name={`equation.${index}.operator`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Selector
                                selected={field.value as "+" | "-"}
                                options={[
                                  { label: "+", value: "+" },
                                  { label: "-", value: "-" },
                                ]}
                                onSelect={(operator) => {
                                  field.onChange(operator);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`equation.${index}.field`}
                        render={({ field }) => (
                          <FormItem>
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
                    operator: "+",
                    field: null,
                  });
                }}
              >
                <PlusCircledIcon className="mr-2" />
                Additional Value
              </Button>
              <div className="flex flex-row items-center justify-between gap-x-2">
                <FormField
                  control={form.control}
                  name="output"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SelectField
                          selectedField={field.value}
                          filter={direction === "row" ? [focus] : undefined}
                          onFieldSelect={(selectedField) => {
                            field.onChange(selectedField);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
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
