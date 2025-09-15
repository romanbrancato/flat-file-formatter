"use client"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import { useTables } from "@/context/tables";
import { PresetContext } from "@/context/preset";
import { useContext, useEffect, useState, useCallback } from "react";
import { usePGlite } from "@/context/db";
import { Skeleton } from "@/components/ui/skeleton";

const ROWS_PER_PAGE = 100;

export function QueryTable() {
  const pg = usePGlite();
  const { tables, focusedTable } = useTables();
  const { preset } = useContext(PresetContext);

  const [items, setItems] = useState<{fields: string[], rows: unknown[]}>({
    fields: [],
    rows: []
  });
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTableData = useCallback(async (page: number) => {
    if (!pg || !focusedTable) return;

    setIsLoading(true);
    setError(null);

    try {
      // Get total count
      const countRes = await pg.query(`SELECT COUNT(*) FROM "${focusedTable}"`);
      let count = 0;

      if (countRes.rows.length > 0) {
        const countRow = countRes.rows[0];
        if (typeof countRow === 'object' && countRow !== null) {
          const values = Object.values(countRow);
          count = parseInt(values[0] as string) || 0;
        } else if (Array.isArray(countRow)) {
          count = parseInt(countRow[0] as string) || 0;
        }
      }

      setTotalCount(count);

      // Get paginated data
      const offset = page * ROWS_PER_PAGE;
      const res = await pg.query(
        `SELECT * FROM "${focusedTable}" LIMIT $1 OFFSET $2`,
        [ROWS_PER_PAGE, offset]
      );

      setItems({
        fields: res.fields.map((field: any) => field.name),
        rows: res.rows
      });
    } catch (err) {
      console.error('Error fetching table data:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [pg, focusedTable]);

  useEffect(() => {
    setCurrentPage(0);
  }, [focusedTable]);

  useEffect(() => {
    fetchTableData(currentPage);
  }, [fetchTableData, currentPage, tables, preset.queries.length]);

  const totalPages = Math.ceil(totalCount / ROWS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 3;

    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    // If at end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1);
    }

    // First page and ellipsis if needed
    if (startPage > 0) {
      items.push(
        <PaginationItem key={0}>
          <PaginationLink onClick={() => handlePageChange(0)}>1</PaginationLink>
        </PaginationItem>
      );

      if (startPage > 1) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={i === currentPage}
            onClick={() => handlePageChange(i)}
          >
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Last page and ellipsis if needed
    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key={totalPages - 1}>
          <PaginationLink onClick={() => handlePageChange(totalPages - 1)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  if (!focusedTable) {
    return null;
  }

  return (
    <div className="h-full flex flex-col">
      {/* Pagination Controls */}
      <div className="flex items-center justify-between border-b py-1 bg-background">
        <div className="text-sm text-muted-foreground">
          {isLoading ? (
            <Skeleton className="h-4 w-40" />
          ) : error ? (
            "Error loading data"
          ) : totalCount > 0 ? (
            <>
              {currentPage * ROWS_PER_PAGE + 1} -{" "}
              {Math.min((currentPage + 1) * ROWS_PER_PAGE, totalCount)} of{" "}
              {totalCount} rows
            </>
          ) : (
            "No data"
          )}
        </div>

        {totalPages > 1 && (
          <div>
          <Pagination>
            <PaginationContent>
              {renderPaginationItems()}
            </PaginationContent>
          </Pagination>
          </div>
        )}
      </div>

      {/* Table */}
      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="p-4 space-y-2">
            {Array.from({ length: 50 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-8">
            <div className="text-sm text-destructive mb-2">Error: {error}</div>
            <Button variant="outline" size="sm" onClick={() => fetchTableData(currentPage)}>
              Retry
            </Button>
          </div>
        ) : items.rows.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-sm text-muted-foreground">No data found</div>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-background sticky top-0">
              <TableRow>
                {items.fields.map((field, index) => (
                  <TableHead key={index}>
                    <div className="whitespace-nowrap">{field}</div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {items.fields.map((field, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <div className="whitespace-nowrap max-w-64 truncate">
                        {(row as Record<string, any>)[field]?.toString() ?? ""}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <ScrollBar orientation="vertical" />
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}