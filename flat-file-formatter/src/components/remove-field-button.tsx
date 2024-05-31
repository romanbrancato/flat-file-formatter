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
import { DataContext } from "@/context/data-context";
import { MinusCircledIcon } from "@radix-ui/react-icons";
import { FieldSelector } from "@/components/field-selector";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const removeFieldSchema = z.object({
  field: z.string({ required_error: "Select a field to remove." }),
});

export function RemoveFieldButton() {
  const { data, removeField } = useContext(DataContext);
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof removeFieldSchema>>({
    resolver: zodResolver(removeFieldSchema),
  });

  function onSubmit(values: z.infer<typeof removeFieldSchema>) {
    removeField(values.field);
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
          disabled={data.length === 0}
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
            className="flex flex-row gap-x-2"
          >
            <FormField
              control={form.control}
              name="field"
              render={() => (
                <FormItem className="flex-1">
                  <FormControl>
                    <FieldSelector
                      onFieldSelect={(selectedField) =>
                        form.setValue("field", selectedField, {
                          shouldValidate: true,
                        })
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Remove</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
