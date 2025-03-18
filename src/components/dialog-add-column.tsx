import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Cross2Icon, PlusCircledIcon } from "@radix-ui/react-icons";
import { ReactNode, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { useTerminal } from "@/context/terminal";
import { z } from "zod";
import { useTables } from "@/context/tables";

export const addColumnSchema = z.object({
  table: z.string(),
  fields: z.array(
    z.object({
      name: z.string().min(1, "Enter a field name."),
      value: z.string()
    })
  )
});

export type addColumn = z.infer<typeof addColumnSchema>;


export function DialogAddColumn({ children }: { children: ReactNode }) {
  const { setValue, focusTerminal } = useTerminal();
  const { focusedTable } = useTables();
  const [open, setOpen] = useState(false);

  const form = useForm<addColumn>({
    resolver: zodResolver(addColumnSchema),
    defaultValues: {
      table: focusedTable || "",
      fields: [{ name: "", value: "" }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    name: `fields`,
    control: form.control
  });

  function onSubmit(values: addColumn) {
    const table = values.table;

    const addColumnsQuery = `ALTER TABLE ${table} ${values.fields.map(field => 
      `ADD COLUMN ${field.name} TEXT`
    ).join(", ")};`;

    let queries = [addColumnsQuery];

    for (const field of values.fields) {
      if (field.value) {
        const referenceMatch = field.value.match(/^\{([^.]+)\.([^}]+)\}$/);

        if (referenceMatch) {
          const [_, referenceTable, referenceColumn] = referenceMatch;

          if (referenceTable === table) {
            // Same table - use direct column reference
            queries.push(`UPDATE ${table} SET ${field.name} = ${referenceColumn};`);
          } else {
            // Different table - use correlated subquery
            queries.push(`UPDATE ${table} SET ${field.name} = (SELECT ${referenceColumn} FROM ${referenceTable} WHERE ${referenceTable}.id = ${table}.${referenceTable}_id );`);
          }
        } else {
          // Direct value
          const escapedValue = field.value.replace(/'/g, "''");
          queries.push(`UPDATE ${table} SET ${field.name} = '${escapedValue}';`);
        }
      }
    }

    setValue(queries.join("\n"));
    setOpen(false);
    focusTerminal();
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[75%], flex max-w-[50%] flex-col overflow-auto">
        <DialogHeader>
          <DialogTitle>Add Column</DialogTitle>
          <DialogDescription>
            Define a column and what to populate it with.
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
                    className="mr-4 flex flex-row items-center gap-x-2 group relative"
                  >
                    <Cross2Icon
                      className="ml-auto opacity-0 group-hover:opacity-70 hover:text-destructive"
                      onClick={() => remove(index)}
                    />
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
                  </div>
                ))}
              </ScrollAreaViewport>
            </ScrollArea>
            <div className="flex content-center justify-between">

              <Button
                variant="outline"
                size="sm"
                className="w-1/3 border-dashed"
                onClick={(event) => {
                  event.preventDefault();
                  append({
                    name: "",
                    value: ""
                  });
                }}
              >
                <PlusCircledIcon className="mr-2" />
                Additional Column
              </Button>
              <Button type="submit" className="ml-auto w-1/3">
                Create Query
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
