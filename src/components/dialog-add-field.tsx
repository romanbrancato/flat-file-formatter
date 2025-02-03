import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Cross2Icon, PlusCircledIcon } from "@radix-ui/react-icons";
import { ReactNode, useContext, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import { PresetContext } from "@/context/preset-context";
import { DataProcessorContext } from "@/context/data-processor-context";
import { SelectField } from "@/components/select-field";
import { Operation, OperationSchema } from "@common/types/schemas";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";

export function DialogAddField({ children }: { children: ReactNode }) {
  const { addFields, focus } = useContext(DataProcessorContext);
  const { preset, setPreset } = useContext(PresetContext);
  const [open, setOpen] = useState(false);

  const form = useForm<Operation>({
    resolver: zodResolver(OperationSchema),
    defaultValues: {
      operation: "add",
      tag: focus,
      fields: [],
      after: null,
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: `fields`,
    control: form.control,
  });

  function onSubmit(values: Operation) {
    if (values.operation != "add") return;
    addFields(values);
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
      <DialogContent className="max-h-[75%], flex max-w-[50%] flex-col overflow-auto">
        <DialogHeader>
          <DialogTitle>Add Field</DialogTitle>
          <DialogDescription>
            Define a field and what to populate it with.
          </DialogDescription>
        </DialogHeader>
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
                    className="mr-4 flex flex-row items-center gap-x-2"
                  >
                    <FormField
                      control={form.control}
                      name={`fields.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <FloatingLabelInput label={"Name"} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`fields.${index}.value`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <FloatingLabelInput label="Populate" {...field} />
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
                  name: "",
                  value: "",
                });
              }}
            >
              <PlusCircledIcon className="mr-2" />
              Additional Field
            </Button>
            <FormField
              control={form.control}
              name="after"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SelectField
                      selectedField={field.value}
                      label="Add After"
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
            <Button type="submit" className="ml-auto w-1/3">
              Add
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
