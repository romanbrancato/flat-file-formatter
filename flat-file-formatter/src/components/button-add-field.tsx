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
import { Input } from "@/components/ui/input";
import { useContext, useState } from "react";
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
import { ParserContext } from "@/context/parser-context";
import { SelectFlag } from "@/components/select-flag";
import { SelectField } from "@/components/select-field";
import { Operation, OperationSchema } from "@/types/schemas";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";

export function ButtonAddField() {
  const { isReady, addField } = useContext(ParserContext);
  const { preset, setPreset } = useContext(PresetContext);
  const [open, setOpen] = useState(false);

  const form = useForm<Operation>({
    resolver: zodResolver(OperationSchema),
    defaultValues: {
      operation: "add",
      flag: "detail",
      fields: [{ name: "", value: "" }],
      after: null,
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: `fields`,
    control: form.control,
  });

  function onSubmit(values: Operation) {
    if (values.operation != "add") return;
    addField(values);
    setPreset({
      ...preset,
      changes: {
        ...preset.changes,
        history: [...preset.changes.history, values],
      },
    });

    setOpen(false);
    form.reset({ operation: "add" });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="flex-1">
        <Button
          variant="outline"
          size="sm"
          className="w-full border-dashed"
          disabled={!isReady}
        >
          <PlusCircledIcon className="mr-2" />
          Add Field
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[800px] sm:max-w-[600px]">
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
            <FormField
              control={form.control}
              name="flag"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SelectFlag
                      label="Add To"
                      selectedFlag={field.value}
                      onFlagSelect={(flag: string) => {
                        field.onChange(flag);
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
                    className="mr-4 flex flex-row items-center gap-x-1"
                  >
                    <FormField
                      control={form.control}
                      name={`fields.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="Name" {...field} />
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
                            <Input placeholder="Populate with..." {...field} />
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
              Add Field
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
