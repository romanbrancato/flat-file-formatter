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
import {
  FieldValueSchema,
  FunctionSchema,
  PresetContext,
} from "@/context/preset-context";
import { ParserContext } from "@/context/parser-context";

export function ButtonEditField() {
  const { isReady, editHeader, runFunction } = useContext(ParserContext);
  const { preset, setPreset } = useContext(PresetContext);
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState<"name" | "values">("values");

  const form = useForm({
    resolver: zodResolver(
      target === "name" ? FieldValueSchema : FunctionSchema,
    ),
    defaultValues: {
      field: { flag: "detail", name: "" },
      value: "",
      operation: "",
      condition: "",
      resultField: { flag: "detail", name: "" },
      valueTrue: "",
      valueFalse: "",
    },
  });

  function onSubmit(values: any) {
    if (target === "values") {
      runFunction(values);
      setPreset({ ...preset, functions: [...preset.functions, { ...values }] });
    } else {
      editHeader(values);
      setPreset({
        ...preset,
        editedHeaders: [...preset.editedHeaders, { ...values }],
      });
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
          disabled={!isReady}
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
              onValueChange={(value: "name" | "values") => setTarget(value)}
            >
              <SelectTrigger className="h-7 w-[145px] text-xs ml-auto text-foreground">
                <span className="text-muted-foreground">Edit: </span>
                <SelectValue placeholder="Select target" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="name" value="name" className="text-xs">
                  Name
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
            {target === "name" && (
              <FormField
                control={form.control}
                name="value"
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
                          onOperationSelect={(selectedOperation: string) =>
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
                          onFieldSelect={(field) => {
                            form.setValue("resultField", field, {
                              shouldValidate: true,
                            });
                          }}
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
