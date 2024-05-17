import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Pencil1Icon} from "@radix-ui/react-icons";
import {FieldSelector} from "@/components/field-selector";
import {Input} from "@/components/ui/input";
import {useContext, useState} from "react";
import {DataContext} from "@/context/data-context";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

const editFieldSchema = z.object({
    field: z.string({required_error: "Select a field to remove."}),
    value: z.string()
});

export function EditFieldButton() {
    const {editField} = useContext(DataContext);
    const [open, setOpen] = useState(false)


    const form = useForm<z.infer<typeof editFieldSchema>>({
        resolver: zodResolver(editFieldSchema),
        defaultValues: {
            value: ""
        },
    })

    function onSubmit(values: z.infer<typeof editFieldSchema>) {
        editField(values.field, values.value);
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild className="flex-1">
                <Button variant="outline" size="sm" className="w-full border-dashed">
                    <Pencil1Icon className="mr-2"/>
                    Edit Field
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[800px]">
                <DialogHeader>
                    <DialogTitle>Edit Field</DialogTitle>
                    <DialogDescription>
                        Select a field and change all its values.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-row gap-x-2">
                        <FormField
                            control={form.control}
                            name="field"
                            render={({field}) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <FieldSelector onFieldSelect={selectedField => form.setValue("field", selectedField)}/>
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="value"
                            render={({field}) => (
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <Input
                                            placeholder="Change values to..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="flex-shrink">
                            Edit
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}