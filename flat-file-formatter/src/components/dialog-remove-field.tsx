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
import { DataProcessorContext } from "@/context/data-processor-context";
import { Field, Operation, OperationSchema } from "@/types/schemas";
import { SelectMultiFields } from "@/components/select-multi-fields";

export function DialogRemoveField({ children }: { children: React.ReactNode }) {
  const { removeFields } = useContext(DataProcessorContext);
  const { data } = useContext(DataProcessorContext);
  const { preset, setPreset } = useContext(PresetContext);
  const [open, setOpen] = useState(false);

  const form = useForm<Operation>({
    resolver: zodResolver(OperationSchema),
    defaultValues: {
      operation: "remove",
      fields: [],
    },
  });

  const options = data.records
    ? Object.entries(data.records).flatMap(([tag, records]) =>
        records.fields.map((name) => ({ tag, name })),
      )
    : [];

  function onSubmit(values: Operation) {
    removeFields(values);
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
                <FormItem>
                  <FormControl>
                    <SelectMultiFields
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
