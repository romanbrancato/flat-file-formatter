import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useContext, useState } from "react";
import {
  Cross2Icon,
  MinusCircledIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import { SelectField } from "@/components/select-field";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { PresetContext } from "@/context/preset-context";
import { ParserContext } from "@/context/parser-context";
import { Field, Operation, OperationSchema } from "@/types/schemas";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";

export function ButtonRemoveField() {
  const { isReady, removeField } = useContext(ParserContext);
  const { preset, setPreset } = useContext(PresetContext);
  const [open, setOpen] = useState(false);

  const form = useForm<Operation>({
    resolver: zodResolver(OperationSchema),
    defaultValues: {
      operation: "remove",
      fields: [{ flag: "", name: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: `fields`,
    control: form.control,
  });

  function onSubmit(values: Operation) {
    removeField(values);
    setPreset({
      ...preset,
      changes: {
        ...preset.changes,
        history: [...preset.changes.history, values],
      },
    });
    setOpen(false);
    form.reset({ fields: [] });
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
          <MinusCircledIcon className="mr-2" />
          Remove Fields
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[800px] sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Remove Fields</DialogTitle>
          <DialogDescription>Select fields to remove.</DialogDescription>
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
                      name={`fields.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <SelectField
                              selectedField={field.value as Field}
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
                append({ flag: "", name: "" });
              }}
            >
              <PlusCircledIcon className="mr-2" />
              Add Field
            </Button>
            <Button type="submit" className="ml-auto w-1/3">
              Remove
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
