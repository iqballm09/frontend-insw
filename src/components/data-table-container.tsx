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
import React, { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import {
  RankingInfo,
  rankItem,
  compareItems,
} from "@tanstack/match-sorter-utils";
import { useIsDetailPage } from "@/hooks/useIsDetailPage";
import { useAppState } from "@/provider/AppProvider";
import DeleteAllContainerItems from "./DeleteAllContainerItems";
import DeleteAllCargoItems from "./DeleteAllCargoitems";
import DeleteAllVinItems from "./DeleteAllVinItems";

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

const hasValue = (obj: any, value: any) => Object.values(obj).includes(value);

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const isDetailPage = useIsDetailPage();
  const ctx = useAppState();
  const [allSelected, setAllSelected] = useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState<any>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      actions: !isDetailPage,
      actionContainer: ctx.isShippingLineProcessing,
      actionContainerSeeDepo: ["Released"].includes(ctx.statusCurrentDO),
      currency: false,
    });
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageSize: 5,
    pageIndex: 0,
  });

  const handleSelectAll = () => {
    const listIdConItems = ctx.listIdContainerItems
    const listIdCargoItems = ctx.listIdCargoItems
    const listIdVinItems = ctx.listIdVinItems
    
    ctx.containerItems.map((con) => listIdConItems[String(con.Id)] = true);
    ctx.cargoItems.map((cargo) => listIdCargoItems[String(cargo.Id)] = true);
    ctx.vinItems.map((vin) => listIdVinItems[String(vin.Id)] = true);

    if (Object.keys(listIdConItems).length) {
      Object.keys(listIdConItems).forEach((key) => {
        listIdConItems[key] = true;
      })
      ctx.setListIdContainerItems(listIdConItems)
    } else if (Object.keys(listIdCargoItems).length && ctx.isCargoPage) {
      Object.keys(listIdCargoItems).forEach((key) => {
        listIdCargoItems[key] = true;
      })
      ctx.setListIdCargoItems(listIdCargoItems)
    } else {
      Object.keys(listIdVinItems).forEach((key) => {
        listIdVinItems[key] = true;
      })
      ctx.setListIdVinItems(listIdVinItems)
    }
  }

  const handleDeselectAll = () => {
    const listIdConItems = ctx.listIdContainerItems
    const listIdCargoItems = ctx.listIdCargoItems
    const listIdVinItems = ctx.listIdVinItems

    if (Object.keys(listIdConItems).length) {
      Object.keys(listIdConItems).forEach((key) => {
        listIdConItems[key] = false;
      })
      ctx.setListIdContainerItems(listIdConItems)
    } else if (Object.keys(listIdCargoItems).length && ctx.isCargoPage) {
      Object.keys(listIdCargoItems).forEach((key) => {
        listIdCargoItems[key] = false;
      })
      ctx.setListIdCargoItems(listIdCargoItems)
    } else {
      Object.keys(listIdVinItems).forEach((key) => {
        listIdVinItems[key] = false;
      })
      ctx.setListIdVinItems(listIdVinItems)
    }
  }

  const toggleSelectAll = () => {
    if (allSelected) {
      handleDeselectAll();
    } else {
      handleSelectAll();
    }
    setAllSelected(!allSelected);
  };

  const handleDeleteSelected = () => { 
    setAllSelected(false);
    ctx.setDeleteAllStatus(true);
  }

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
    onPaginationChange: setPagination,
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      pagination,
    },
  });
  
  return (
    <>
      <div className="rounded-md border mb-4">
        <Table>
          <TableHeader className="bg-primary ">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="hover:bg-transparent" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-white text-center"
                      colSpan={header.colSpan}
                    >
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
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell key={cell.id} className="text-center">
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
                  className="h-24 text-center"
                  colSpan={columns.length + 12}
                >
                  No Data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        { ctx.deleteAllStatus && ctx.containerItems.length > 0 && (<DeleteAllContainerItems deleteAll={ctx.deleteAllStatus}/>)}
        { ctx.deleteAllStatus && ctx.cargoItems.length > 0 && ctx.isCargoPage && (<DeleteAllCargoItems deleteAll={ctx.deleteAllStatus}/>)}
        { ctx.deleteAllStatus && ctx.vinItems.length > 0 && !ctx.isCargoPage && (<DeleteAllVinItems deleteAll={ctx.deleteAllStatus}/>)}
      </div>
      <div className="flex items-center justify-between py-2"> {/* Change justify-end to justify-between */}
        {(ctx.cargoItems.length > 0 && ctx.isCargoPage && (<div className="flex gap-4"> {/* Add a div to contain the "Select All" button */}
          {!isDetailPage && !ctx.isShippingLineProcessing && ctx.formIndex === 2 && (
            <Button size={"sm"} onClick={toggleSelectAll} variant={"secondary"}>
              {allSelected ? "Deselect All" : "Select All"}
            </Button>
          )}
          {!isDetailPage && hasValue(ctx.listIdCargoItems, true) && !ctx.isShippingLineProcessing && ctx.formIndex === 2 && (
            <Button size={"sm"} onClick={handleDeleteSelected} variant={"destructive"}>
              Delete Selected
            </Button>
          )}
        </div>))} 
        {(ctx.vinItems.length > 0 && !ctx.isCargoPage && (<div className="flex gap-4"> {/* Add a div to contain the "Select All" button */}
          {!isDetailPage && !ctx.isShippingLineProcessing && ctx.formIndex === 2 && (
            <Button size={"sm"} onClick={toggleSelectAll} variant={"secondary"}>
              {allSelected ? "Deselect All" : "Select All"}
            </Button>
          )}
          {!isDetailPage && hasValue(ctx.listIdVinItems, true) && !ctx.isShippingLineProcessing && ctx.formIndex === 2 && (
            <Button size={"sm"} onClick={handleDeleteSelected} variant={"destructive"}>
              Delete Selected
            </Button>
          )} </div>))}
        {ctx.containerItems.length > 0 && (<div className="flex gap-4"> {/* Add a div to contain the "Select All" button */}
          {!isDetailPage && !ctx.isShippingLineProcessing && ctx.formIndex === 2 && (
            <Button size={"sm"} onClick={toggleSelectAll} variant={"secondary"}>
              {allSelected ? "Deselect All" : "Select All"}
            </Button>
          )}
          {!isDetailPage && hasValue(ctx.listIdContainerItems, true) && !ctx.isShippingLineProcessing && ctx.formIndex === 2 && (
            <Button size={"sm"} onClick={handleDeleteSelected} variant={"destructive"}>
              Delete Selected
            </Button>
          )}
        </div>)}
        <div className="flex items-center space-x-2"> {/* Wrap the "Previous" and "Next" buttons in a flex container */}
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
              {table.getPageCount() !== 0 ? table.getPageCount() : 1}
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
      </div>
    </>
  );
}