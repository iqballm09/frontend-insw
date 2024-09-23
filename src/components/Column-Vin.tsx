"use client";

import { ColumnDef } from "@tanstack/react-table";
import { useAppState } from "@/provider/AppProvider";
import { VinItemForm } from "./form/VinItemForm";
import DeleteVinItem from "./DeleteVinItem";
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect, useState } from "react";
import { Vin, columnVin0 } from "./Column-Vin0";
import { useIsDetailPage } from "@/hooks/useIsDetailPage";

const BlNumber = () => {
  const context = useAppState();
  return <>{context.requestDetailForm?.ladingBillNumber}</>;
};

export type CheckedRows = Record<string, boolean>;

export const CreateColumnsVin = () => {
  const context = useAppState();
  const [checkedRows, setCheckedRows] = useState<CheckedRows>(context.listIdVinItems);
  const isDetailPage = useIsDetailPage()

  const handleCheckbox = (id: string) => {
    setCheckedRows(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  };

  useEffect(() => {
    context.setListIdVinItems(checkedRows)
    // You can perform any actions here that you want to execute when ceklis changes
  }, [checkedRows, context]);

  const renderCheckbox = (id: string) => {
    return (
      <Checkbox
        checked={checkedRows[id] || false}
        onClick={() => handleCheckbox(id)}
      />
    );
  };

  const columnVin: ColumnDef<Vin>[] = [
    {
      id: "checkbox",
      header: "",
      cell: ({ row }) => renderCheckbox(String(row.original.Id))
    },
    {
      id: "no",
      header: () => <span> No </span>,
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

  if (context.vinItems.length && !isDetailPage) {
    return columnVin
  } else {
    return columnVin0
  }
}