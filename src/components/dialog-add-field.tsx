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
import { ReactNode, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { useTerminal } from "@/context/terminal";
import { z } from "zod";
import { useTables } from "@/context/tables";
import { usePGlite } from "@electric-sql/pglite-react";

export const addColumnSchema = z.object({
    table: z.string(),
    fields: z.array(
      z.object({
        name: z.string().min(1, "Enter a field name."),
        value: z.string(),
      }),
    )
})

export type addColumn = z.infer<typeof addColumnSchema>;


export function DialogAddField({ children }: { children: ReactNode }) {
  const {setValue} = useTerminal();
  const pg = usePGlite();
  const {focusedTable, getColumns} = useTables()
  const [open, setOpen] = useState(false);

  const form = useForm<addColumn>({
    resolver: zodResolver(addColumnSchema),
    defaultValues: {
      table: focusedTable || "",
      fields: [{ name: "", value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: `fields`,
    control: form.control,
  });

  function onSubmit(values: addColumn) {
    const table = values.table;
    const fields = values.fields.map(field => `ADD COLUMN ${field.name} TEXT`).join(", ");
    const query = `ALTER TABLE ${table} ${fields};`;
    setValue(query);
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
            <Button type="submit" className="ml-auto w-1/3">
              Create Query
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
