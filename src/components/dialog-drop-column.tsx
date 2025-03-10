import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { SelectColumns } from "@/components/select-columns";
import { z } from "zod";
import { useTerminal } from "@/context/terminal";
import { useTables } from "@/context/tables";

export const columnSchema = z.object({
  table: z.string(),
  name: z.string(),
})

export type Column = z.infer<typeof columnSchema>;

export const dropColumnSchema = z.object({
    columns: z.array(columnSchema)
})

export type dropColumn = z.infer<typeof dropColumnSchema>;

export function DialogDropColumn({ children }: { children: React.ReactNode }) {
  const {setValue, focusTerminal} = useTerminal();
  const {tables} = useTables();
  const [open, setOpen] = useState(false);

  const form = useForm<dropColumn>({
    resolver: zodResolver(dropColumnSchema),
    defaultValues: {
      columns: [],
    },
  });

  function onSubmit(values: dropColumn) {
    // Group columns by table
    const columnsByTable = values.columns.reduce((acc, column) => {
      if (!acc[column.table]) {
        acc[column.table] = [];
      }
      acc[column.table].push(column.name);
      return acc;
    }, {} as Record<string, string[]>);
    
    // Generate SQL queries
    const queries = Object.entries(columnsByTable).map(([table, columns]) => {
      // For multiple columns in the same table, combine them in one ALTER TABLE statement
      const dropClauses = columns.map(col => `DROP COLUMN "${col}" CASCADE`).join(', ');
      return `ALTER TABLE ${table} ${dropClauses};`;
    });
    
    // Join all queries and set the terminal value
    const fullQuery = queries.join('\n');
    setValue(fullQuery);
    
    setOpen(false);
    focusTerminal();
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[75%] max-w-[50%] overflow-auto">
        <DialogHeader>
          <DialogTitle>Drop Columns</DialogTitle>
          <DialogDescription>Select columns to drop.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-1"
          >
            <FormField
              control={form.control}
              name={`columns`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SelectColumns
                      label="Select Columns"
                      tables={tables}
                      defaultValues={field.value as Column[]}
                      onValueChange={(columns) => field.onChange(columns)}
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
