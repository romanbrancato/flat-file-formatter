import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { PresetContext } from "@/context/preset";
import { DataProcessorContext } from "@/context/data-processor";
import { Columns, Operation, OperationSchema } from "@common/types/schemas";
import { SelectMultiFields } from "@/components/select-multi-fields";
import { z } from "zod";
import { useTerminal } from "@/context/terminal";
import { usePGlite } from "@electric-sql/pglite-react";
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

export function DialogRemoveField({ children }: { children: React.ReactNode }) {
  const {setValue} = useTerminal();
  const pg = usePGlite();
  const {tables, getColumns} = useTables();
  const { preset, setPreset } = useContext(PresetContext);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<{ table: string; name: string }[]>([]);

  const form = useForm<dropColumn>({
    resolver: zodResolver(dropColumnSchema),
    defaultValues: {
      columns: [],
    },
  });

  useEffect(() => {
    const fetchColumns = async () => {
      const allOptions: Column[] = [];
      for (const table of tables) {
        const columns = await getColumns(pg, table);
        allOptions.push(...columns.map((name) => ({ table, name })));
      }
      setOptions(allOptions);
    };

    fetchColumns();
  }, [tables, getColumns, pg]);

  function onSubmit(values: dropColumn) {
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
              name={`columns`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SelectMultiFields
                      label="Select Fields"
                      options={options}
                      defaultValues={field.value as Column[]}
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
