"use client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpRightSquare, File } from "lucide-react";
import DeleteSupportItem from "./DeleteSupportDocItem";
import { SupportDocItemForm } from "./form/SupportingDocItemForm";
import {
  documentTypeContainer,
  documentTypeNonContainer,
} from "@/utils/data-gw";

export type SupportingDocument = {
  documentType: string;
  documentNumber: string;
  documentName: string;
  date: string;
  document: any;
  urlDocument: string;
};

export const columnsSupporting: ColumnDef<SupportingDocument>[] = [
  {
    id: "no",
    header: "No",
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "documentType",
    header: "Document Type",
    cell: ({ row }) => <>{row.original.documentName}</>,
  },
  {
    accessorKey: "documentNumber",
    header: "Document No",
  },
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "document",
    header: "Document",
    cell: ({ row }) => {
      return (
        <div
          onClick={() => window.open(row.original.urlDocument, "_blank")}
          className="cursor-pointer mx-auto flex gap-2 items-center px-3 py-2 max-w-[120px] md:max-w-[150px] rounded-sm bg-primary  text-white relative overflow-hidden"
        >
          <div className="rounded-md cursor-pointer absolute text-white transition-all opacity-100 z-10 top-0 left-0 bottom-0 right-0 bg-[rgba(2,39,95,.9)] flex justify-center items-center gap-2">
            View <ArrowUpRightSquare width={16} />
          </div>
          <File className="text-white" />{" "}
        </div>
      );
    },
  },

  {
    id: "actions",
    accessorKey: "aksi",
    header: "Action",
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 items-center">
          <SupportDocItemForm
            key={
              Object.values(row.original).join("_") + row.original.document.name
            }
            support={row.original}
          />
          <DeleteSupportItem support={row.original} />
        </div>
      );
    },
  },
];
