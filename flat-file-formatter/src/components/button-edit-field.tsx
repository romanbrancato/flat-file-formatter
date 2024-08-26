import { useContext, useState } from "react";
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
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FunctionSchema, PresetContext } from "@/context/preset-context";
import { ParserContext } from "@/context/parser-context";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import { SelectOperation } from "@/components/select-operation";
import { SelectField } from "@/components/select-field";
import { Input } from "@/components/ui/input";
import { SelectStatement } from "@/components/select-statement";
import { SelectComparison } from "@/components/select-comparison";
import { SelectOperator } from "@/components/select-operator";
import { CheckboxOverpunch } from "@/components/checkbox-overpunch";
import { SelectType } from "@/components/select-type";

export function ButtonEditField() {
  const { isReady, runFunction } = useContext(ParserContext);
  const { preset, setPreset } = useContext(PresetContext);
  const [open, setOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(FunctionSchema),
    defaultValues: {
      operation: "",
      conditions: [
        {
          statement: "if",
          field: { name: "", flag: "" },
          comparison: "===",
          overpunch: false,
          value: "",
        },
      ],
      valueTrue: "",
      valueFalse: "",
      formulas: [
        {
          operator: "+",
          field: { name: "", flag: "" },
          overpunch: false,
        },
      ],
      overpunch: false,
      details: {
        type: "",
        pattern: "",
      },
      output: {},
    },
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
    name: "formulas",
    control: form.control,
  });

  const typeValue = useWatch({
    control: form.control,
    name: "details.type",
  });

  function onSubmit(values: any) {
    runFunction(values);
    setPreset({ ...preset, functions: [...preset.functions, { ...values }] });
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
      <DialogContent className="sm:max-w-[700px] max-h-[800px]">
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
                <FormItem className="mb-1">
                  <FormControl>
                    <SelectOperation
                      selectedOperation={field.value}
                      onOperationSelect={(selectedOperation: string) => {
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
              <div className="space-y-1">
                <ScrollArea>
                  <ScrollAreaViewport className="max-h-[400px]">
                    {conditions.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex flex-row items-center gap-x-2 mt-1"
                      >
                        <FormField
                          control={form.control}
                          name={`conditions.${index}.statement`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <SelectStatement
                                  selectedStatement={
                                    field.value as "if" | "if not"
                                  }
                                  onStatementSelect={(statement) =>
                                    form.setValue(
                                      `conditions.${index}.statement`,
                                      statement,
                                      {
                                        shouldValidate: true,
                                      },
                                    )
                                  }
                                />
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
                                  selectedField={field.value as Field}
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
                          name={`conditions.${index}.overpunch`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <CheckboxOverpunch
                                  checked={field.value}
                                  onCheckedChange={(checked) => {
                                    form.setValue(
                                      `conditions.${index}.overpunch`,
                                      checked,
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
                                <SelectComparison
                                  selectedComparison={
                                    field.value as "<" | "===" | ">"
                                  }
                                  onComparisonSelect={(comparison) => {
                                    form.setValue(
                                      `conditions.${index}.comparison`,
                                      comparison,
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
                          className="hover:text-destructive ml-auto opacity-70 flex-shrink-0"
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
                      statement: "if",
                      field: { name: "", flag: "" },
                      overpunch: false,
                      comparison: "===",
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
                  name="output"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SelectField
                          selectedField={field.value as Field}
                          onFieldSelect={(field) => {
                            form.setValue("output", field, {
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
              </div>
            )}
            {form.getValues().operation === "equation" && (
              <div className="space-y-1">
                <ScrollArea>
                  <ScrollAreaViewport className="max-h-[400px]">
                    {constants.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex flex-row gap-x-2 mt-1 items-center"
                      >
                        <FormField
                          control={form.control}
                          name={`formulas.${index}.operator`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <SelectOperator
                                  selectedOperator={field.value as "+" | "-"}
                                  onOperatorSelect={(operator) => {
                                    form.setValue(
                                      `formulas.${index}.operator`,
                                      operator,
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
                          name={`formulas.${index}.field`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <SelectField
                                  selectedField={field.value as Field}
                                  onFieldSelect={(field) => {
                                    form.setValue(
                                      `formulas.${index}.field`,
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
                          name={`formulas.${index}.overpunch`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <CheckboxOverpunch
                                  checked={field.value}
                                  onCheckedChange={(checked) => {
                                    form.setValue(
                                      `formulas.${index}.overpunch`,
                                      checked,
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
                          className="hover:text-destructive ml-auto opacity-70"
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
                      operator: "+",
                      field: { name: "", flag: "" },
                      overpunch: false,
                    });
                  }}
                >
                  <PlusCircledIcon className="mr-2" />
                  Add Constant
                </Button>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      EQUALS
                    </span>
                  </div>
                </div>
                <div className="flex flex-row items-center justify-between gap-x-2">
                  <FormField
                    control={form.control}
                    name="output"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <SelectField
                            selectedField={field.value as Field}
                            onFieldSelect={(field) => {
                              form.setValue("output", field, {
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
                    name="overpunch"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CheckboxOverpunch
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              form.setValue("overpunch", checked, {
                                shouldValidate: true,
                              });
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}
            {form.getValues().operation === "format" && (
              <div className="space-y-1">
                <FormField
                  control={form.control}
                  name={`details.type`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <SelectType
                          selectedType={field.value}
                          onTypeSelect={(type) => {
                            form.setValue(`details.type`, type, {
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
                  name={`output`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <SelectField
                          selectedField={field.value as Field}
                          onFieldSelect={(field) => {
                            form.setValue(`output`, field, {
                              shouldValidate: true,
                            });
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {typeValue === "date" && (
                  <FormField
                    control={form.control}
                    name={`details.pattern`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Pattern" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}
            <div className="flex">
              <Button type="submit" className="w-1/3 ml-auto mt-1">
                Edit
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
