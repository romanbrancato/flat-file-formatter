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
import { MinusCircledIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
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
import { SelectFields } from "@/components/select-fields";

export function ButtonRemoveField() {
  const { isReady, removeFields } = useContext(ParserContext);
  const { data } = useContext(ParserContext);
  const { preset, setPreset } = useContext(PresetContext);
  const [open, setOpen] = useState(false);

  const options = Object.entries(data.records).flatMap(([tag, records]) =>
    records.fields.map((name) => ({ tag, name })),
  );

  const form = useForm<Operation>({
    resolver: zodResolver(OperationSchema),
    defaultValues: {
      operation: "remove",
      fields: [],
    },
  });

  function onSubmit(values: Operation) {
    removeFields(values);
    setPreset({
      ...preset,
      changes: {
        ...preset.changes,
        history: [...preset.changes.history, values],
      },
    });
    setOpen(false);
    form.reset();
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
            <FormField
              control={form.control}
              name={`fields`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <SelectFields
                      label="Select Fields"
                      options={options}
                      defaultValues={field.value as Field[]}
                      onValueChange={(fields) => field.onChange(fields)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="ml-auto w-1/3">
              Remove
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
