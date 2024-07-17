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
import {
  Cross2Icon,
  Pencil1Icon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Function,
  FunctionSchema,
  PresetContext,
} from "@/context/preset-context";
import { ParserContext } from "@/context/parser-context";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import { SelectOperation } from "@/components/select-operation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectField } from "@/components/select-field";
import { Input } from "@/components/ui/input";

export function ButtonEditField() {
  const { isReady, editHeader, runFunction } = useContext(ParserContext);
  const { preset, setPreset } = useContext(PresetContext);
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(FunctionSchema),
  });

  const {
    fields: conditions,
    append: appendCondition,
    remove: removeCondition,
  } = useFieldArray({
    name: "conditions",
    control: form.control,
  });

  const {
    fields: constants,
    append: appendConstant,
    remove: removeConstant,
  } = useFieldArray({
    name: "equation",
    control: form.control,
  });

  function onSubmit(values: any) {
    console.log(JSON.stringify(values, null, 2));
    runFunction(values);
    // setPreset({ ...preset, functions: [...preset.functions, { ...values }] });
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
      <DialogContent className="sm:max-w-[900px] max-h-[800px]">
        <DialogHeader>
          <DialogTitle>Edit Field</DialogTitle>
          <DialogDescription className="flex flex-row justify-between items-center">
            Perform various operations.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="operation"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <SelectOperation
                      onOperationSelect={(selectedOperation: string) => {
                        console.log(selectedOperation),
                          form.setValue("operation", selectedOperation, {
                            shouldValidate: true,
                          });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {form.getValues().operation === "conditional" && (
              <>
                <ScrollArea>
                  <ScrollAreaViewport className="max-h-[400px]">
                    {conditions.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex flex-row gap-x-1 items-center"
                      >
                        <FormField
                          control={form.control}
                          name={`conditions.${index}.statement`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Select
                                  value="if"
                                  onValueChange={(statement) =>
                                    form.setValue(
                                      `conditions.${index}.statement`,
                                      statement,
                                      {
                                        shouldValidate: true,
                                      },
                                    )
                                  }
                                >
                                  <SelectTrigger className="text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem
                                      key="if"
                                      value="if"
                                      className="text-xs"
                                    >
                                      IF
                                    </SelectItem>
                                    <SelectItem
                                      key="if not"
                                      value="if not"
                                      className="text-xs"
                                    >
                                      IF NOT
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`conditions.${index}.field`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <SelectField
                                  onFieldSelect={(field) => {
                                    form.setValue(
                                      `conditions.${index}.field`,
                                      field,
                                      {
                                        shouldValidate: true,
                                      },
                                    );
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`conditions.${index}.comparison`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Select
                                  value="==="
                                  onValueChange={(comparison) =>
                                    form.setValue(
                                      `conditions.${index}.comparison`,
                                      comparison,
                                      {
                                        shouldValidate: true,
                                      },
                                    )
                                  }
                                >
                                  <SelectTrigger className="text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem
                                      key="<"
                                      value="<"
                                      className="text-xs"
                                    >
                                      {`<`}
                                    </SelectItem>
                                    <SelectItem
                                      key="==="
                                      value="==="
                                      className="text-xs"
                                    >
                                      =
                                    </SelectItem>
                                    <SelectItem
                                      key=">"
                                      value=">"
                                      className="text-xs"
                                    >
                                      {`>`}
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`conditions.${index}.value`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input placeholder="Value" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Cross2Icon
                          className="hover:text-destructive mx-auto opacity-70"
                          onClick={() => removeCondition(index)}
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
                    appendCondition({
                      statement: "",
                      field: {},
                      comparison: "",
                      value: "",
                    });
                  }}
                >
                  <PlusCircledIcon className="mr-2" />
                  Add Condition
                </Button>
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
                  name="result"
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <SelectField
                          onFieldSelect={(field) => {
                            form.setValue("result", field, {
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            {form.getValues().operation === "equation" && (
              <>
                <ScrollArea>
                  <ScrollAreaViewport className="max-h-[400px]">
                    {constants.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex flex-row gap-x-1 items-center"
                      >
                        <FormField
                          control={form.control}
                          name={`equation.${index}.operator`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Select
                                  defaultValue="+"
                                  onValueChange={(operator) =>
                                    form.setValue(
                                      `formula.${index}.operator`,
                                      operator,
                                      {
                                        shouldValidate: true,
                                      },
                                    )
                                  }
                                >
                                  <SelectTrigger className="text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem
                                      key="+"
                                      value="+"
                                      className="text-xs"
                                    >
                                      +
                                    </SelectItem>
                                    <SelectItem
                                      key="-"
                                      value="-"
                                      className="text-xs"
                                    >
                                      -
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`equation.${index}.field`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <SelectField
                                  onFieldSelect={(field) => {
                                    form.setValue(
                                      `formula.${index}.field`,
                                      field,
                                      {
                                        shouldValidate: true,
                                      },
                                    );
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Cross2Icon
                          className="hover:text-destructive mx-auto opacity-70"
                          onClick={() => removeConstant(index)}
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
                    appendConstant({
                      operation: "",
                      field: {},
                    });
                  }}
                >
                  <PlusCircledIcon className="mr-2" />
                  Add Constant
                </Button>
                <FormField
                  control={form.control}
                  name="result"
                  render={() => (
                    <FormItem>
                      <FormControl>
                        <SelectField
                          onFieldSelect={(field) => {
                            form.setValue("result", field, {
                              shouldValidate: true,
                            });
                          }}
                        />
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
