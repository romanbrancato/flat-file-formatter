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
import { useFieldArray, useForm, useWatch } from "react-hook-form";
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
import { SelectAction } from "@/components/select-action";
import { Separator } from "@/components/ui/separator";
import { SelectType } from "@/components/select-type";

export function ButtonOperations() {
  const { isReady, evaluateConditions, evaluateEquation, reformatData } =
    useContext(ParserContext);
  const { preset, setPreset } = useContext(PresetContext);
  const [open, setOpen] = useState(false);
  // REVISE FOR ACTION TRUE AND FALSE
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
      actionTrue: {
        action: "",
        field: { name: "", flag: "" },
        tag: "",
        value: "",
      },
      actionFalse: {
        action: "",
        field: { name: "", flag: "" },
        tag: "",
        value: "",
      },
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

  const actionTrue = useWatch({
    control: form.control,
    name: "actionTrue.action",
  });
  const actionFalse = useWatch({
    control: form.control,
    name: "actionFalse.action",
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
                          name={`conditions.${index}.comparison`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <SelectComparison
                                  selectedComparison={
                                    field.value as "<" | "=" | ">"
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
                      comparison: "===",
                      value: "",
                    });
                  }}
                >
                  <PlusCircledIcon className="mr-2" />
                  Add Condition
                </Button>
                <Separator />
                <FormField
                  control={form.control}
                  name="actionTrue.action"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SelectAction
                          label="Action if True"
                          selectedAction={field.value}
                          onActionSelect={(action) => {
                            form.setValue("actionTrue.action", action, {
                              shouldValidate: true,
                            });
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {actionTrue === "setValue" && (
                  <>
                    <FormField
                      control={form.control}
                      name="actionTrue.field"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <SelectField
                              selectedField={field.value as Field}
                              onFieldSelect={(field) => {
                                form.setValue("actionTrue.field", field, {
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
                      name="actionTrue.value"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Value" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                {actionTrue === "separate" && (
                  <FormField
                    control={form.control}
                    name="actionTrue.tag"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Tag" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <Separator />
                <FormField
                  control={form.control}
                  name="actionFalse.action"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <SelectAction
                          label="Action if False"
                          selectedAction={field.value}
                          onActionSelect={(action) => {
                            form.setValue("actionFalse.action", action, {
                              shouldValidate: true,
                            });
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {actionFalse === "setValue" && (
                  <>
                    <FormField
                      control={form.control}
                      name="actionFalse.field"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <SelectField
                              selectedField={field.value as Field}
                              onFieldSelect={(field) => {
                                form.setValue("actionFalse.field", field, {
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
                      name="actionFalse.value"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Value" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                {actionFalse === "separate" && (
                  <FormField
                    control={form.control}
                    name="actionFalse.tag"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Tag" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
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
                                form.setValue(field.name, direction, {
                                  shouldValidate: true,
                                });
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
                                    form.setValue(
                                      `formula.${index}.operator`,
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
                          name={`formula.${index}.field`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <SelectField
                                  selectedField={field.value as Field}
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
                  name={`field`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <SelectField
                          selectedField={field.value as Field}
                          onFieldSelect={(field) => {
                            form.setValue(`field`, field, {
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
                Apply
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
