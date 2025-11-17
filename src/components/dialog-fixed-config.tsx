import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useContext, useState } from "react";
import { PresetContext } from "@/context/preset";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fixed, FixedSchema } from "@common/types/preset";
import { Selector } from "./selector";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { useTables } from "@/context/tables";

export function DialogFixedConfig({ children }: { children: React.ReactNode }) {
  const { tables } = useTables();
  const { fixed, setFixed } = useContext(PresetContext);
  const [open, setOpen] = useState(false);

  const form = useForm<Fixed>({
    resolver: zodResolver(FixedSchema),
    defaultValues: { ...fixed },
  });

  function onSubmit(values: Fixed) {
    console.log(values)
    setFixed({ ...values });
    setOpen(false);
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[75%] max-w-[50%] overflow-auto">
        <DialogHeader>
          <DialogTitle>Fixed Width Format Config</DialogTitle>
          <DialogDescription>Configure the desired format.</DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-y-1"
            >
              <FormField
                control={form.control}
                name="pad"
                defaultValue="\s"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Selector
                        label="Padding"
                        selected={field.value}
                        options={[
                          { label: ",", value: "," },
                          { label: ";", value: ";" },
                          { label: ":", value: ":" },
                          { label: "|", value: "|" },
                          { label: "tab", value: "\t" },
                          { label: "space", value: " " },
                          { label: "=", value: "=" },
                        ]}
                        onSelect={(symbol) => field.onChange(symbol)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="align"
                defaultValue="left"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Selector
                        label={"Alignment"}
                        selected={field.value}
                        options={[
                          { label: "left", value: "left" },
                          { label: "right", value: "right" },
                        ]}
                        onSelect={(align) => field.onChange(align)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <ScrollArea className="max-h-[400px] pr-4">
                <Accordion type="single" collapsible>
                  {Object.entries(tables).map(([tableName, tableColumns]) => (
                    <TableAccordionItem 
                      key={tableName}
                      table={tableName} 
                      columns={tableColumns} 
                      form={form}
                    />
                  ))}
                </Accordion>
              </ScrollArea>
              <Button type="submit" className="ml-auto w-1/3">
                Save
              </Button>
            </form>
          </Form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}

function TableAccordionItem({ 
  table, 
  columns, 
  form 
}: { 
  table: string; 
  columns: string[];
  form: any;
}) {
  const { control, getValues} = form;

  const tableWidths = getValues(`widths.${table}`) || {};
  
  // Calculate the sum of widths for this table
  const tableWidthsSum = Object.values(tableWidths).reduce(
    (total: number, width) => {
      const numWidth = Number(width);
      return total + (isNaN(numWidth) ? 0 : numWidth);
    }, 
    0
  );

  return (
    <AccordionItem value={table}>
      <div className="sticky top-0 z-10 bg-background">
        <AccordionTrigger className="text-xs">
          {table}
          <span className="ml-auto mr-2">{tableWidthsSum}</span>
        </AccordionTrigger>
      </div>
        <AccordionContent>
          {columns.map((columnName) => (
            <FormField
              control={control}
              name={`widths.${table}.${columnName}`}
              key={`${table}.${columnName}`}
              render={({ field }) => (
                <FormItem className="mr-3 mt-2">
                  <FormControl>
                    <div className="relative">
                    <span
                      className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 transform text-xs font-normal">
                      {columnName}
                    </span>
                      <Input
                        className="text-right [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                        defaultValue={field.value}
                        onWheel={(e) => {
                          e.target instanceof HTMLElement
                            ? e.target.blur()
                            : null;
                        }}
                        onBlur={(e) => field.onChange(e.target.value)}
                        type="number"
                        min={0}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </AccordionContent>
    </AccordionItem>
);
}