"use client";

import { DORequest } from "@/utils/dummy";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "./ui/button";
import {
  ArrowUpDown,
  ArrowUpRight,
  ArrowUpRightSquare,
  Delete,
  Edit,
  File,
  FileSearch,
  FileText,
  MoreHorizontal,
  MoreVertical,
  Printer,
  Trash,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/utils/dummy-cargo-detail";
import { useAppState } from "@/provider/AppProvider";
import DropdownMenuItemCustom from "./DeleteContainerItem";
import { PaymentItemForm } from "./form/PaymentItemForm";
import DeleteItemPayment from "./DeletePaymentItem";

export type Payment = {
  invoiceNumber: string;
  invoiceDate: string;
  totalPayment: string;
  bank: string;
  bankName: string;
  accountNumber: string;
  currency: string;
  paymentReceipt: any;
  urlPayment: string;
};

function formatCurrency(input: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(input);
}

export const columnsPayment: ColumnDef<Payment>[] = [
  {
    id: "no",
    header: "No",
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "invoiceNumber",
    header: "Invoice No",
  },
  {
    accessorKey: "invoiceDate",
    header: "Invoice Date",
  },
  {
    accessorKey: "currency",
    header: "Currency",
  },
  {
    accessorKey: "totalPayment",
    header: "Total",
    cell: ({ row }) => (
      <>
        {row.original.currency +
          " " +
          formatCurrency(+row.original.totalPayment)}
      </>
    ),
  },
  {
    accessorKey: "bank",
    header: "Bank",
    cell: ({ row }) => <>{row.original.bankName}</>,
  },
  {
    accessorKey: "accountNumber",
    header: "Account Number",
    cell: ({ row }) => (
      <>{row.original.accountNumber == "" ? "-" : row.original.accountNumber}</>
    ),
  },
  {
    accessorKey: "paymentReceipt",
    header: "Payment Receipt",
    cell: ({ row }) => {
      return (
        <div
          onClick={() => window.open(row.original.urlPayment, "_blank")}
          className="cursor-pointer mx-auto flex gap-2 items-center px-3 py-2 max-w-[120px] md:max-w-[150px] rounded-sm bg-primary  text-white relative overflow-hidden"
        >
          <div className="rounded-md cursor-pointer absolute text-white transition-all opacity-100 z-10 top-0 left-0 bottom-0 right-0 bg-[rgba(2,39,95,.9)] flex justify-center items-center gap-2">
            View <ArrowUpRightSquare width={16} />
          </div>
          <File className="text-white" />{" "}
          <span className="line-clamp-1">
            {row.original.paymentReceipt?.name.split(".").pop() === '.pdf' ? row.original.paymentReceipt?.name : ""}
          </span>
        </div>
      );
    },
  },

  {
    id: "actions",
    accessorKey: "aksi",
    header: "Action",
    cell: ({ row, column }) => {
      return (
        <div className="flex gap-2 items-center">
          <PaymentItemForm
            key={
              Object.values(row.original).join("_") +
              row.original.paymentReceipt.name
            }
            payment={row.original}
          />
          <DeleteItemPayment payment={row.original} />
        </div>
      );
    },
  },
];
