import React, { useContext, useState } from "react";
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
  FormDescription,
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
import { SelectOperation } from "@/components/select-operation";
import { DataContext } from "@/context/data-context";
import { PresetContext } from "@/context/preset-context";
import { FunctionSchema } from "@/types/preset";

const editFieldHeaderSchema = z.object({
  field: z.string({ required_error: "Select a field to edit." }),
  name: z.string({ required_error: "Enter a new name." }),
});

export function ButtonEditField() {
  const {
    data,
    editHeader: dataEditHeader,
    runFunction,
  } = useContext(DataContext);
  const { editHeader: presetEditHeader, addFunction } =
    useContext(PresetContext);
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<"header" | "values">("values");

  const form = useForm({
    resolver: zodResolver(
      target === "header" ? editFieldHeaderSchema : FunctionSchema,
    ),
    defaultValues: {
      field: "",
      name: "",
      operation: "",
      condition: "",
      resultField: "",
      valueTrue: "",
      valueFalse: "",
    },
  });

  function onSubmit(values: any) {
    if (target === "values") {
      runFunction({
        field: values.field,
        operation: values.operation,
        condition: values.condition,
        resultField: values.resultField,
        valueTrue: values.valueTrue,
        valueFalse: values.valueFalse,
      });
      addFunction({
        field: values.field,
        operation: values.operation,
        condition: values.condition,
        resultField: values.resultField,
        valueTrue: values.valueTrue,
        valueFalse: values.valueFalse,
      });
    } else {
      dataEditHeader({ [values.field]: values.name });
      presetEditHeader({ [values.field]: values.name });
    }
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
                <span className="text-muted-foreground">Edit: </span>
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
                  name="operation"
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <SelectOperation
                          onFunctionSelect={(selectedOperation: string) =>
                            form.setValue("operation", selectedOperation, {
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
                      <FormDescription>
                        Enter * to match all values.
                      </FormDescription>
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
                  name="resultField"
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <SelectField
                          onFieldSelect={(selectedField) =>
                            form.setValue("resultField", selectedField, {
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
                      <FormDescription>
                        Enter ... to preserve values.
                      </FormDescription>
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
