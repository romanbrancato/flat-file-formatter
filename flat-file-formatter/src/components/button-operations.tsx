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
import { Cross2Icon, GearIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PresetContext } from "@/context/preset-context";
import { ParserContext } from "@/context/parser-context";
import { ScrollArea, ScrollAreaViewport } from "@/components/ui/scroll-area";
import { SelectOperation } from "@/components/select-operation";
import { SelectField } from "@/components/select-field";
import { Input } from "@/components/ui/input";
import { SelectStatement } from "@/components/select-statement";
import { SelectComparison } from "@/components/select-comparison";
import { SelectOperator } from "@/components/select-operator";
import { Field, OperationSchema } from "@/types/schemas";
import { SelectDirection } from "@/components/select-direction";
import { Separator } from "@/components/ui/separator";
import { SelectType } from "@/components/select-type";
import { FormActions } from "@/components/forms/form-actions";

export function ButtonOperations() {
  const { isReady, evaluateConditions, evaluateEquation, reformatData } =
    useContext(ParserContext);
  const { preset, setPreset } = useContext(PresetContext);
  const [open, setOpen] = useState(false);
  const form = useForm({
    resolver: zodResolver(OperationSchema),
    defaultValues: {
      operation: "",
      conditions: [
        {
          statement: "if",
          field: { name: "", flag: "" },
          comparison: "=",
          value: "",
        },
      ],
      direction: "column",
      formula: [
        {
          operator: "+",
          field: { name: "", flag: "" },
        },
      ],
      output: {},
      fields: [
        {
          field: { name: "", flag: "" },
        },
      ],
      details: {
        type: "",
        pattern: "",
      },
      field: {
        name: "",
        flag: "",
      },
    },
  });

  const typeValue = useWatch({
    control: form.control,
    name: "details.type",
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
    name: "formula",
    control: form.control,
  });

  function onSubmit(values: any) {
    if (values.operation === "conditional") {
      evaluateConditions(values);
    }
    if (values.operation === "equation") {
      evaluateEquation(values);
    }
    if (values.operation === "reformat") {
      reformatData(values);
    }
    setPreset({
      ...preset,
      changes: {
        ...preset.changes,
        history: [...preset.changes.history, values],
      },
    });

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
          <GearIcon className="mr-2" />
          Operations
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[800px]">
        <DialogHeader>
          <DialogTitle>Define Operation</DialogTitle>
          <DialogDescription className="flex flex-row justify-between items-center">
            Perform various operations.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
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
                          field.onChange(selectedOperation);
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
                                      field.onChange(statement)
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
                                    onFieldSelect={(selectedField) => {
                                      field.onChange(selectedField);
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
                                      field.value as "<" | "=" | ">"
                                    }
                                    onComparisonSelect={(comparison) => {
                                      field.onChange(comparison);
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
                        comparison: "===",
                        value: "",
                      });
                    }}
                  >
                    <PlusCircledIcon className="mr-2" />
                    Add Condition
                  </Button>
                  <Separator />
                  <FormActions />
                </div>
              )}
              {form.getValues().operation === "equation" && (
                <div className="space-y-1">
                  <ScrollArea>
                    <ScrollAreaViewport className="max-h-[400px]">
                      <FormField
                        control={form.control}
                        name="direction"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <SelectDirection
                                selectedDirection={
                                  field.value as "row" | "column"
                                }
                                onDirectionSelect={(direction) => {
                                  field.onChange(direction);
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {constants.map((field, index) => (
                        <div
                          key={field.id}
                          className="flex flex-row gap-x-2 mt-1 items-center"
                        >
                          <FormField
                            control={form.control}
                            name={`formula.${index}.operator`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <SelectOperator
                                    selectedOperator={field.value as "+" | "-"}
                                    onOperatorSelect={(operator) => {
                                      field.onChange(operator);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`formula.${index}.field`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <SelectField
                                    selectedField={field.value as Field}
                                    onFieldSelect={(selectedField) => {
                                      field.onChange(selectedField);
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
                      });
                    }}
                  >
                    <PlusCircledIcon className="mr-2" />
                    Add Constant
                  </Button>
                  <Separator />
                  <div className="flex flex-row items-center justify-between gap-x-2">
                    <FormField
                      control={form.control}
                      name="output"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <SelectField
                              selectedField={field.value as Field}
                              onFieldSelect={(selectedField) => {
                                field.onChange(selectedField);
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
              {form.getValues().operation === "reformat" && (
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
                              field.onChange(type);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`field`}
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <SelectField
                            selectedField={field.value as Field}
                            onFieldSelect={(selectedField) => {
                              field.onChange(selectedField);
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
                  Apply
                </Button>
              </div>
            </form>
          </Form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
