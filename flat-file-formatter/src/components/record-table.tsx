import { CSSProperties, useContext, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
} from "@tanstack/table-core";
import { flexRender, useReactTable } from "@tanstack/react-table";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ParserContext } from "@/context/parser-context";

const DraggableHeaderCell = ({ header }: any) => {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({ id: header.column.id });
  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    cursor: isDragging ? "grabbing" : "grab",
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 1 : 0,
    whiteSpace: "nowrap",
  };

  return (
    <TableHead
      ref={setNodeRef}
      colSpan={header.colSpan}
      style={style}
      {...attributes}
      {...listeners}
    >
      {!header.isPlaceholder && (
        <div className="flex items-center">
          {flexRender(header.column.columnDef.header, header.getContext())}
          <DragHandleDots2Icon className="ml-auto" />
        </div>
      )}
    </TableHead>
  );
};

const DraggableCell = ({ cell }: any) => {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({ id: cell.column.id });
  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    cursor: isDragging ? "grabbing" : "grab",
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 1 : 0,
    whiteSpace: "nowrap",
  };

  return (
    <TableCell ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  );
};

export function RecordTable({
  tag,
  fields,
  rows,
}: {
  tag: string;
  fields: string[];
  rows: string[][];
}) {
  const { orderFields } = useContext(ParserContext);
  const [columns, setColumns] = useState<ColumnDef<string[], string>[]>([]);
  const [columnOrder, setColumnOrder] = useState<string[]>([]);

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { columnOrder, pagination: { pageIndex: 0, pageSize: 7 } },
    onColumnOrderChange: setColumnOrder,
  });

  useEffect(() => {
    if (fields.length) {
      const newColumns = fields.map((field, index) => ({
        accessorKey: index.toString(),
        header: field,
      }));
      setColumns(newColumns);
      setColumnOrder(newColumns.map((c) => c.accessorKey!));
    }
  }, [fields]);

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (!active || !over || active.id === over.id) return;
    const order = arrayMove(
      columnOrder,
      columnOrder.indexOf(active.id as string),
      columnOrder.indexOf(over.id as string),
    );
    setColumnOrder(order);
    orderFields(tag, order.map(Number));
  };

  return (
    <>
      <span className="text-xs text-muted-foreground">
        {tag}: {table.getCoreRowModel().rows.length} Row(s)
      </span>
      <div className="flex-grow overflow-hidden rounded-md border">
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToHorizontalAxis]}
          onDragEnd={handleDragEnd}
          sensors={useSensors(
            useSensor(MouseSensor),
            useSensor(TouchSensor),
            useSensor(KeyboardSensor),
          )}
        >
          <ScrollArea className="h-full">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    <SortableContext
                      items={columnOrder}
                      strategy={horizontalListSortingStrategy}
                    >
                      {headerGroup.headers.map((header) => (
                        <DraggableHeaderCell key={header.id} header={header} />
                      ))}
                    </SortableContext>
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    <SortableContext
                      items={columnOrder}
                      strategy={horizontalListSortingStrategy}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <DraggableCell key={cell.id} cell={cell} />
                      ))}
                    </SortableContext>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </DndContext>
      </div>
    </>
  );
}
