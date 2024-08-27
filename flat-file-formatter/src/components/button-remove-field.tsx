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
import { SelectField } from "@/components/select-field";
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
import { Operation, OperationSchema } from "@/types/schemas";

export function ButtonRemoveField() {
  const { isReady, removeField } = useContext(ParserContext);
  const { preset, setPreset } = useContext(PresetContext);
  const [open, setOpen] = useState(false);

  const form = useForm<Operation>({
    resolver: zodResolver(OperationSchema),
    defaultValues: {
      operation: "remove",
      field: undefined,
    },
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
          Remove Field
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[800px]">
        <DialogHeader>
          <DialogTitle>Remove Field</DialogTitle>
          <DialogDescription>Select a field to remove.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-2"
          >
            <FormField
              control={form.control}
              name="field"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SelectField
                      selectedField={field.value}
                      label="Remove"
                      onFieldSelect={(field) => {
                        form.setValue("field", field, {
                          shouldValidate: true,
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-1/3 ml-auto">
              Remove
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
