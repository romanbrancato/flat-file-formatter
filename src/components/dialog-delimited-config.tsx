import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { useContext, useState } from "react";
import { PresetContext } from "@/context/preset";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FloatingLabelInput } from "@/components/ui/floating-label-input";
import { Delimited, DelimitedSchema } from "@common/types/preset";
import { Checkbox } from "@/components/ui/checkbox";

export function DialogDelimitedConfig({
                                        children
                                      }: {
  children: React.ReactNode;
}) {
  const { delimited, setDelimited } = useContext(PresetContext);
  const [open, setOpen] = useState(false);

  const form = useForm<Delimited>({
    resolver: zodResolver(DelimitedSchema),
    defaultValues: { ...delimited }
  });

  function onSubmit(values: Delimited) {
    setDelimited({ ...values });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-h-[75%] max-w-[50%] overflow-auto">
        <DialogHeader>
          <DialogTitle>Delimited Format Config</DialogTitle>
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
                name="delimiter"
                defaultValue=""
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <FloatingLabelInput label="Delimiter" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="txt"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={field.value || false}
                          onCheckedChange={field.onChange}
                        />
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Export As .txt
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="exclude_header"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={field.value || false}
                          onCheckedChange={field.onChange}
                        />
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Exclude Header Row
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
