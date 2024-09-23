"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Container } from "@/utils/dummy-cargo-detail";
import DeleteContainerItem from "./DeleteContainerItem";
import { ContainerItemForm } from "./form/ContainerItemForm";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Checkbox } from "@/components/ui/checkbox"
import { Stamp, StampIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

function formatGrossWeight(input: number) {
  return new Intl.NumberFormat("en-US", {
    style: "decimal"
  }).format(input);
}

export const columns0: ColumnDef<Container>[] = [
  {
    id: "no",
    header: "No",
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "containerNumber",
    header: "Container No",
  },
  {
    accessorKey: "sealNumber",
    header: "Seal No",
    cell: ({ row }) => (
      <div className="flex gap-1 flex-wrap">
        {row.original.sealNumber.map((item, index) => (
          <Badge key={index}>{item}</Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "sizeAndType",
    header: "Size & Type",
    cell: ({ row }) => <>{row.original.sizeAndType}</>,
  },
  {
    accessorKey: "grossWeight",
    header: "Gross Weight",
    cell: ({ row }) => (
      <>
        {formatGrossWeight(+row.original.grossWeight)}
      </>
    ),
  },
  {
    accessorKey: "unit",
    header: "Unit",
  },
  {
    accessorKey: "ownership",
    header: "Ownership",
  },

  {
    id: "actions",
    accessorKey: "aksi",
    header: "Action",
    cell: ({ row }) => {
      const con = row.original;
      return (
        <div className="flex gap-2 justify-center">
          <ContainerItemForm
            key={Object.values(con).join("_")}
            container={con}
          />
          <DeleteContainerItem con={con} />
        </div>
      );
    },
  },
  {
    id: "actionContainer",
    accessorKey: "aksi",
    header: "Action",
    cell: ({ row }) => {
      const con = row.original;
      return (
        <div className="flex gap-2 justify-center">
          <ContainerItemForm
            key={Object.values(con).join("_")}
            container={con}
          />
        </div>
      );
    },
  },
  {
    id: "actionContainerSeeDepo",
    accessorKey: "aksi",
    header: "Action",
    cell: ({ row }) => {
      const con = row.original;
      return (
        <Sheet>
          <SheetTrigger>
            <Button>
              <StampIcon className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader className="mb-4">
              <SheetTitle>Detail Depo</SheetTitle>
              <SheetDescription className="pb-2 border-b">
                Container No: <Badge>{con.containerNumber}</Badge>
              </SheetDescription>
            </SheetHeader>
            <tbody className="space-y-4 ">
              <tr className="">
                <td className="align-top w-2/5">Name</td>
                <td className="font-bold align-top">{con.depoName}</td>
              </tr>
              <tr>
                <td className="align-top w-2/5">NPWP</td>
                <td className="font-bold align-top">{con.depoNpwp}</td>
              </tr>
              <tr>
                <td className="align-top w-2/5">Address</td>
                <td className="font-bold align-top">{con.alamat}</td>
              </tr>
              <tr>
                <td className="align-top w-2/5">Phone No</td>
                <td className="font-bold align-top">{con.noTelp}</td>
              </tr>
              <tr>
                <td className="align-top w-2/5">Postal Code</td>
                <td className="font-bold align-top">{con.kodePos}</td>
              </tr>
            </tbody>
          </SheetContent>
        </Sheet>
      );
    },
  },
];
