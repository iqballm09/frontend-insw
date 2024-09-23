"use client";

import { DORequest } from "@/utils/dummy";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Cargo, Container } from "@/utils/dummy-cargo-detail";
import { CargoItemForm } from "./form/CargoItemForm";
import DeleteCargoItem from "./DeleteCargoItem";

const columnHelper = createColumnHelper<Cargo>();

function formatGrossWeight(input: number) {
  return new Intl.NumberFormat("en-US", {
    style: "decimal"
  }).format(input);
}

export const columnCargo0: ColumnDef<Cargo>[] = [
  {
    id: "no",
    header: () => <span>No</span>,
    cell: ({ row, column }) => <>{row.index + 1}</>,
  },
  {
    id: "descriptionOfGoods",
    accessorKey: "descriptionOfGoods",
    header: () => <>Description of Goods</>,
  },
  columnHelper.group({
    id: "package",
    header: () => <span>Package</span>,
    // footer: (props) => props.column.id,
    columns: [
      columnHelper.accessor("packageQuantity", {
        cell: (info) => info.getValue(),
        header: () => <span>Quantity</span>,
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor("packageSatuan", {
        cell: (info) => info.getValue(),
        header: () => <span>Unit</span>,
        footer: (props) => props.column.id,
      }),
    ],
  }),
  columnHelper.group({
    id: "grossWeight",
    header: () => <span>Gross Weight</span>,
    columns: [
      columnHelper.accessor("grossQuantity", {
        cell: (info) => (
          <>
            {formatGrossWeight(info.getValue())}
          </>
        ),
        header: () => <span>Quantity</span>,
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor("grossSatuan", {
        cell: (info) => info.getValue(),
        header: () => <span>Unit</span>,
        footer: (props) => props.column.id,
      }),
    ],
  }),
  columnHelper.group({
    id: "measurement",
    header: () => <span>Measurement</span>,
    columns: [
      columnHelper.accessor("measurementQuantity", {
        cell: (info) => (
          <>
            {formatGrossWeight(info.getValue())}
          </>
        ),
        header: () => <span>Quantity</span>,
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor("measurementSatuan", {
        cell: (info) => info.getValue(),
        header: () => <span>Unit</span>,
        footer: (props) => props.column.id,
      }),
    ],
  }),

  {
    id: "actions",
    accessorKey: "aksi",
    header: "Action",
    cell: ({ row }) => {
      const con = row.original;
      return (
        <div className="flex gap-2 justify-center">
          <CargoItemForm key={Object.values(con).join("_")} cargo={con} />
          <DeleteCargoItem con={con} />
        </div>
      );
    },
  },
];
