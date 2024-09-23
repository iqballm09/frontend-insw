"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  PaginationState,
  SortingFn,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  sortingFns,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useEffect, useState } from "react";
import { InputSearch } from "./ui/InputSearch";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  RankingInfo,
  rankItem,
  compareItems,
} from "@tanstack/match-sorter-utils";
import { useSearchParams } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useAppState } from "@/provider/AppProvider";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0;

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    );
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const sp = useSearchParams();
  const context = useAppState();
  const isNonContainer = sp.get("con") == "2";
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [isDownArrow, setDownArrow] = useState(true);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([
    { id: "isContainer", value: !isNonContainer },
  ]);
  const [globalFilter, setGlobalFilter] = React.useState<any>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      isContainer: false,
      id: false,
    });
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const table = useReactTable({
    data,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    columns,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      pagination,
    },
  });

  const [containerActive, setContainerActive] = useState(!isNonContainer);

  const handleFilter = (filterName: string) => {
    setDownArrow(true);
    context.setFilterStatus(filterName);
  }

  return (
    <>
      <div className="flex justify-between items-center py-4">
        <div className="space-x-2">
          <Button
            onClick={(event) => {
              setContainerActive(true);
              table.getColumn("isContainer")?.setFilterValue(true);
            }}
            variant={containerActive ? "default" : "outline"}
          >
            Container
          </Button>
          <Button
            onClick={(event) => {
              setContainerActive(false);
              table.getColumn("isContainer")?.setFilterValue(false);
            }}
            variant={!containerActive ? "default" : "outline"}
          >
            Non Container
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <DropdownMenu onOpenChange={(open) => setDownArrow(!open)}>
            <DropdownMenuTrigger asChild>
              <div className="relative">
                <Button variant="outline" className="h-9 w-40 rounded-full">
                  <a className="absolute left-4 flex">{context.filterStatus}</a>
                  <div className="absolute right-4 flex items-center">
                    {
                      isDownArrow ? (<ChevronDown size={16} />) : (<ChevronUp size={16}/>)
                    }
                  </div>
                </Button>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="items-start w-40 z-[99] bg-white p-2 rounded-sm shadow-md"
            >
              <DropdownMenuItem onClick={() => handleFilter("All Status")}>All Status</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilter("Draft")}>Draft</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilter("Submitted")}>Submitted</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilter("Processed")}>Processed</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilter("Released")}>Released</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilter("Rejected")}>Rejected</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFilter("Cancelled")}>Cancelled</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <InputSearch
            placeholder="Search data..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-sm"
          />
        </div>

      </div>
      <div className="rounded-md border mb-4">
        <Table>
          <TableHeader className="bg-primary ">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="hover:bg-transparent" key={headerGroup.id}>
                <TableHead className="text-white">No</TableHead>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="text-white">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, number) => {
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    <TableCell>{number + 1}</TableCell>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant={!table.getCanPreviousPage() ? "outline" : "default"}
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount() != 0 ? table.getPageCount() : 1}
          </strong>
        </span>
        <Button
          variant={!table.getCanNextPage() ? "outline" : "default"}
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </>
  );
}
