"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useAppState } from "@/provider/AppProvider";
import { VinItemForm } from "./form/VinItemForm";
import DeleteVinItem from "./DeleteVinItem";
import { Checkbox } from "@radix-ui/react-checkbox";

const BlNumber = () => {
  const context = useAppState();
  return <>{context.requestDetailForm?.ladingBillNumber}</>;
};

export type Vin = {
    Id?: string;
    vinNumber: string;
};

export const columnVin0: ColumnDef<Vin>[] = [
  {
    id: "no",
    header: () => <span>No</span>,
    cell: ({ row, column }) => <>{row.index + 1}</>,
  },

  {
    id: "blNumber",
    accessorKey: "blNumber",
    header: () => <>BL Number</>,
    cell: () => <BlNumber />,
  },

  {
    id: "vinNumber",
    accessorKey: "vinNumber",
    header: () => <>VIN Number</>,
  },

  {
    id: "actions",
    accessorKey: "aksi",
    header: "Action",
    cell: ({ row }) => {
      const con = row.original;
      return (
        <div className="flex gap-2 justify-center">
          <VinItemForm key={Object.values(con).join("_")} vin={con} />
          <DeleteVinItem vin={con} />
        </div>
      );
    },
  },
];
