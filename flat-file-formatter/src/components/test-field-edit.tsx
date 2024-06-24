import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { SelectField } from "@/components/select-field";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectFunction } from "@/components/select-function";

const editFieldValuesSchema = z.object({
  field: z.string({ required_error: "Select a field to edit." }),
  function: z.string({ required_error: "Select a function." }),
  condition: z.string(),
  then: z.string({ required_error: "Select a field." }),
  valueTrue: z.string({ required_error: "Enter a value." }),
  valueFalse: z.string({ required_error: "Enter a value." }),
});

const editFieldHeaderSchema = z.object({
  field: z.string({ required_error: "Select a field to edit." }),
  name: z.string({ required_error: "Enter a new name." }),
});

export function TestFieldEditButton() {
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<"header" | "values">("values");

  const form = useForm({
    resolver: zodResolver(
      target === "header" ? editFieldHeaderSchema : editFieldValuesSchema,
    ),
  });

  function onSubmit(values: any) {
    console.log(values);
    setOpen(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="flex-1">
        <Button variant="outline" size="sm" className="w-full border-dashed">
          <Pencil1Icon className="mr-2" />
          Edit Field
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[800px]">
        <DialogHeader>
          <DialogTitle>Edit Field</DialogTitle>
          <DialogDescription className="flex flex-row justify-between items-center">
            Select a field then change its name or values.
            <Select
              defaultValue={target}
              onValueChange={(value: "header" | "values") => setTarget(value)}
            >
              <SelectTrigger className="h-7 w-[145px] text-xs ml-auto text-foreground">
                <span className="text-muted-foreground">Target: </span>
                <SelectValue placeholder="Select target" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="header" value="header" className="text-xs">
                  Header
                </SelectItem>
                <SelectItem key="values" value="values" className="text-xs">
                  Values
                </SelectItem>
              </SelectContent>
            </Select>
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-y-2"
          >
            <FormField
              control={form.control}
              name="field"
              render={() => (
                <FormItem>
                  <FormControl>
                    <SelectField
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
            {target === "header" && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Change name to..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {target === "values" && (
              <>
                <FormField
                  control={form.control}
                  name="function"
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <SelectFunction
                          onFunctionSelect={(selectedFunc: string) =>
                            form.setValue("function", selectedFunc, {
                              shouldValidate: true,
                            })
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Condition" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      then
                    </span>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="thenField"
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <SelectField
                          onFieldSelect={(selectedField) =>
                            form.setValue("thenField", selectedField, {
                              shouldValidate: true,
                            })
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="valueTrue"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Value if true" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="valueFalse"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Value if false" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <Button type="submit" className="w-1/3 ml-auto">
              Edit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
