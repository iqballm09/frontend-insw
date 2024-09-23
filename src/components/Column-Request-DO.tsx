"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ListDo } from "@/models/ListDo";
import { Badge } from "./ui/badge";
import { ActionDORequest } from "./ActionDORequest";

export const columns: ColumnDef<ListDo>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "id",
  },
  {
    accessorKey: "isContainer",
    header: "is container",
  },
  {
    accessorKey: "requestNumber",
    header: "Request Number",
  },
  {
    accessorKey: "requestTime",
    header: "Request Time",
  },
  {
    accessorKey: "blNumber",
    header: "BL Number",
  },
  {
    accessorKey: "blDate",
    header: "BL Date",
  },
  {
    accessorKey: "requestName",
    header: "Request Name",
  },
  {
    accessorKey: "shippingLine",
    header: "Shipping Line",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge className="hover:bg-primary">{row.getValue("status")}</Badge>
    ),
  },

  {
    id: "actions",
    accessorKey: "aksi",
    header: "Action",
    cell: ({ row }) => {
      const doRequest = row.original;

      return <ActionDORequest doRequest={doRequest} key={doRequest.id} />;
    },
  },
];
