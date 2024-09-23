"use client";

import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Cargo, Container } from "@/utils/dummy-cargo-detail";
import { useAppState } from "@/provider/AppProvider";
import { CargoItemForm } from "./form/CargoItemForm";
import DeleteCargoItem from "./DeleteCargoItem";
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect, useState } from "react";
import { columnCargo0 } from "./Column-Cargo0";
import { useIsDetailPage } from "@/hooks/useIsDetailPage";

const columnHelper = createColumnHelper<Cargo>();
export type CheckedRows = Record<string, boolean>;

function formatGrossWeight(input: number) {
  return new Intl.NumberFormat("en-US", {
    style: "decimal"
  }).format(input);
}

export const CreateColumnsCargo = () => {
  const context = useAppState();
  const [checkedRows, setCheckedRows] = useState<CheckedRows>(context.listIdCargoItems);
  const isDetailPage = useIsDetailPage();

  const handleCheckbox = (id: string) => {
    setCheckedRows(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  useEffect(() => {
    context.setListIdCargoItems(checkedRows)
    // You can perform any actions here that you want to execute when ceklis changes
  }, [checkedRows, context]);

  const renderCheckbox = (id: string) => {
    return (
      <Checkbox
        checked={checkedRows[id]}
        onClick={() => handleCheckbox(id)}
      />
    );
  };

  const columnCargo: ColumnDef<Cargo>[] = [
    {
      id: "checkbox",
      header: "",
      cell: ({ row }) => renderCheckbox(String(row.original.Id))
    },
    {
      id: "no",
      header: () => <span>No</span>,
      cell: ({ row }) => <>{row.index + 1}</>,
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

  if (context.cargoItems.length && !isDetailPage) {
    return columnCargo
  } else {
    return columnCargo0
  }

}
