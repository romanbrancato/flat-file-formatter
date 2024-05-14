import {CSSProperties, useContext, useEffect, useMemo, useState} from "react";
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
import {DragHandleDots2Icon} from "@radix-ui/react-icons";
import {DataContext} from "@/context/data-context";


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


export function CSVTable() {
    const {data, setData} = useContext(DataContext);
    const [columns, setColumns] = useState<ColumnDef<Record<string, unknown>>[]>(() => {
        const keys = Object.keys(data[0] || {});
        return keys.map(key => ({
            accessorKey: key,
            header: () => <span>{key}</span>,
            id: key,
        }));
    });
    const [columnOrder, setColumnOrder] = useState<string[]>(() =>
        columns.map(c => c.id!)
    );

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        state: {
            columnOrder,
        },
        onColumnOrderChange: setColumnOrder
    })

    useEffect(() => {
        const keys = Object.keys(data[0] || {});
        const newColumns = keys.map(key => ({
            accessorKey: key,
            header: () => <span>{key}</span>,
            id: key,
        }));
        setColumns(newColumns);
        setColumnOrder(newColumns.map(c => c.id!));
    }, [data]);


    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
            setColumnOrder(columnOrder => {
                const oldIndex = columnOrder.indexOf(active.id as string);
                const newIndex = columnOrder.indexOf(over.id as string);
                return arrayMove(columnOrder, oldIndex, newIndex);
            });
        }
    }

    const sensors = useSensors(
        useSensor(MouseSensor, {}),
        useSensor(TouchSensor, {}),
        useSensor(KeyboardSensor, {})
    );

    return (

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
    );
}