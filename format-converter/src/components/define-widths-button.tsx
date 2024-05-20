import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {useState} from "react";
import {Pencil2Icon} from "@radix-ui/react-icons";
import {FieldSelector} from "@/components/field-selector";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";

const widthsSchema = z.object({
    field: z.string({required_error: "Select a field to remove."})
});

export function DefineWidthsButton() {const [open, setOpen] = useState(false)

    const form = useForm<z.infer<typeof widthsSchema>>({
        resolver: zodResolver(widthsSchema),
    })

    function onSubmit(values: z.infer<typeof widthsSchema>) {
        setOpen(false);
        form.reset()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild className="flex-1">
                <Button variant="outline" size="sm" className="w-full border-dashed mb-2">
                    <Pencil2Icon className="mr-2"/>
                    Define Widths
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[800px]">
                <DialogHeader>
                    <DialogTitle>Define Widths</DialogTitle>
                    <DialogDescription>
                        Define the widths of each field in characters.
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
                        <Button type="submit" className="flex-shrink">
                            Remove
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}