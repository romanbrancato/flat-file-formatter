import {CSSProperties, useMemo, useState} from "react";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core';
import {arrayMove, horizontalListSortingStrategy, SortableContext, useSortable} from '@dnd-kit/sortable';
import {restrictToHorizontalAxis} from "@dnd-kit/modifiers";
import {CSS} from '@dnd-kit/utilities';
import {ColumnDef, getCoreRowModel} from "@tanstack/table-core";
import {flexRender, useReactTable} from "@tanstack/react-table";
import {DragHandleDots2Icon, InfoCircledIcon, Pencil2Icon, PlusCircledIcon} from "@radix-ui/react-icons";
import {PresetToolbar} from "@/components/preset-toolbar";
import {Separator} from "@/components/ui/separator";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {DelimiterSelector} from "@/components/delimiter-selector";
import {Button} from "@/components/ui/button";

const DraggableTableHeader = ({header}: any) => {
    const {attributes, isDragging, listeners, setNodeRef, transform} =
        useSortable({
            id: header.column.id,
        })

    const style: CSSProperties = {
        opacity: isDragging ? 0.8 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 1 : 0,
        whiteSpace: 'nowrap'
    }

    return (
        <TableHead colSpan={header.colSpan} ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {header.isPlaceholder
                ? null
                : <div className="flex flex-row items-center">
                    <span>{flexRender(header.column.columnDef.header, header.getContext())} </span>
                    <DragHandleDots2Icon className="ml-2"/>
                </div>}
        </TableHead>
    )
}

const DraggableCell = ({cell}: any) => {
    const {attributes, isDragging, listeners, setNodeRef, transform} =
        useSortable({
            id: cell.column.id,
        })

    const style: CSSProperties = {
        opacity: isDragging ? 0.8 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
        transform: CSS.Translate.toString(transform),
        zIndex: isDragging ? 1 : 0,
    }

    return (
        <TableCell style={style} ref={setNodeRef} {...attributes} {...listeners}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
    )
}

interface CSVTableProps {
    data: Record<string, unknown>[];
}

export function CSVEditor({data}: CSVTableProps) {
    const [columnOrder, setColumnOrder] = useState<string[]>(() => {
        // Initialize columnOrder with the keys of the first record
        if (data.length > 0) {
            return Object.keys(data[0]);
        }
        return [];
    });
    const columns = useMemo<ColumnDef<Record<string, unknown>>[]>(() => {
        const keys = Object.keys(data[0] || {});
        return keys.map(key => ({
            accessorKey: key,
            header: () => <span>{key}</span>,
            id: key,
        }));
    }, [data]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        state: {
            columnOrder,
        },
        onColumnOrderChange: setColumnOrder,
        // debugTable: true,
        // debugHeaders: true,
        // debugColumns: true,
    })

    const handleDragEnd = (event: DragEndEvent) => {
        const {active, over} = event;
        if (active && over && active.id !== over.id) {
            setColumnOrder((columnOrder) => {
                const oldIndex = columnOrder.indexOf(active.id as string);
                const newIndex = columnOrder.indexOf(over.id as string);
                return arrayMove(columnOrder, oldIndex, newIndex);
            });
        }
    };

    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {})
    );

    return (
        <div className="rounded-md border">
            <PresetToolbar table={table}/>
            <Separator/>
            <div className="mx-5 my-3">
                <div className="grid grid-cols-7 gap-x-3 gap-y-1">
                    <div className="col-span-6 rounded-md border overflow-hidden">
                        {data.length > 0 ? (
                            <DndContext
                                collisionDetection={closestCenter}
                                modifiers={[restrictToHorizontalAxis]}
                                onDragEnd={handleDragEnd}
                                sensors={sensors}
                            >
                                <Table>
                                    <TableHeader>
                                        {table.getHeaderGroups().map((headerGroup) => (
                                            <TableRow key={headerGroup.id}>
                                                <SortableContext items={columnOrder}
                                                                 strategy={horizontalListSortingStrategy}>
                                                    {headerGroup.headers.map((header) => (
                                                        <DraggableTableHeader key={header.id} header={header}/>
                                                    ))}
                                                </SortableContext>
                                            </TableRow>
                                        ))}
                                    </TableHeader>
                                    <TableBody>
                                        {table.getRowModel().rows.map((row) => (
                                            <TableRow key={row.id}>
                                                {row.getVisibleCells().map((cell) => (
                                                    <SortableContext key={cell.id} items={columnOrder}
                                                                     strategy={horizontalListSortingStrategy}>
                                                        <DraggableCell cell={cell}/>
                                                    </SortableContext>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </DndContext>
                        ) : (
                            <div className="flex items-center justify-center h-full">
                                <Alert className="w-1/2 m-3">
                                    <InfoCircledIcon/>
                                    <AlertTitle>No File Uploaded</AlertTitle>
                                    <AlertDescription>
                                        Upload a file above to get started.
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )}
                    </div>
                    <aside className="min-w-[150px]">
                        <div className="text-sm font-medium peer-disabled:cursor-not-allowed mb-1">
                            Export As
                        </div>
                        <Tabs defaultValue="csv">
                            <TabsList className="grid grid-cols-2">
                                <TabsTrigger value="csv">
                                    .csv
                                </TabsTrigger>
                                <TabsTrigger value="txt">
                                    .txt
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="csv">
                                <div className="text-sm font-medium peer-disabled:cursor-not-allowed mb-1">
                                    Delimiter
                                </div>
                                <DelimiterSelector/>
                            </TabsContent>
                            <TabsContent value="txt">
                                <div className="text-sm font-medium peer-disabled:cursor-not-allowed mb-1">
                                    Configure
                                </div>
                                <Button variant="outline" size="sm" className="w-full border-dashed">
                                    <Pencil2Icon className="mr-2"/>
                                    Define Widths
                                </Button>
                            </TabsContent>
                        </Tabs>
                    </aside>
                    <Button variant="outline" size="sm" className="cols-span-1 min-w-[150px] border-dashed">
                    <PlusCircledIcon className="mr-2"/>
                        New Column
                    </Button>
                </div>
            </div>
        </div>
    );
}