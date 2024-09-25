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

const DraggableTableHeader = ({ header }: any) => {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: header.column.id,
    });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    cursor: isDragging ? "grabbing" : "grab",
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 1 : 0,
    whiteSpace: "nowrap",
  };

  return (
    <TableHead
      colSpan={header.colSpan}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {header.isPlaceholder ? null : (
        <div className="flex flex-row items-center">
          <span>
            {flexRender(header.column.columnDef.header, header.getContext())}{" "}
          </span>
          <DragHandleDots2Icon className="ml-auto" />
        </div>
      )}
    </TableHead>
  );
};

const DraggableCell = ({ cell }: any) => {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: cell.column.id,
    });

  const style: CSSProperties = {
    opacity: isDragging ? 0.8 : 1,
    cursor: isDragging ? "grabbing" : "grab",
    transform: CSS.Translate.toString(transform),
    zIndex: isDragging ? 1 : 0,
    whiteSpace: "nowrap",
  };

  return (
    <TableCell style={style} ref={setNodeRef} {...attributes} {...listeners}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  );
};

export function RecordTable({
  tag,
  records,
}: {
  tag: string;
  records: Record<string, string>[];
}) {
  const { orderFields } = useContext(ParserContext);
  const [columns, setColumns] = useState<ColumnDef<Record<string, string>>[]>(
    [],
  );
  const [columnOrder, setColumnOrder] = useState<string[]>([]);

  const table = useReactTable({
    data: records,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      columnOrder,
      pagination: {
        pageIndex: 0,
        pageSize: 7,
      },
    },
    onColumnOrderChange: setColumnOrder,
  });

  useEffect(() => {
    if (records.length > 0) {
      const newColumns = Object.keys(records[0]).map((field) => ({
        accessorKey: field,
        header: field,
      }));
      setColumns(newColumns);
      setColumnOrder(newColumns.map((c) => c.accessorKey!));
    }
  }, [records]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = columnOrder.indexOf(active.id as string);
      const newIndex = columnOrder.indexOf(over.id as string);
      const order = arrayMove(columnOrder, oldIndex, newIndex);
      setColumnOrder(order);
      orderFields(tag, order);
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

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
          sensors={sensors}
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
                        <DraggableTableHeader key={header.id} header={header} />
                      ))}
                    </SortableContext>
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <SortableContext
                        key={cell.id}
                        items={columnOrder}
                        strategy={horizontalListSortingStrategy}
                      >
                        <DraggableCell cell={cell} />
                      </SortableContext>
                    ))}
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
