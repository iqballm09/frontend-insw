"use client";
import React, { useRef } from "react";
import { Button } from "../ui/button";
import { useAppState } from "@/provider/AppProvider";
import { ChevronLeft, ChevronRight, Container, FileText, ListChecks, Megaphone, Save, Send } from "lucide-react";
import { DataTable } from "../data-table-container";
import { columnsPayment } from "../Column-Payment";
import { PaymentItemForm } from "./PaymentItemForm";
import { SupportDocItemForm } from "./SupportingDocItemForm";
import { columnsSupporting } from "../Column-Supporting";
import { toast } from "sonner";
import { useIsDetailPage } from "@/hooks/useIsDetailPage";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "../ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import RejectOrReleaseSchema from "@/validation/RejectOrRelaseSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import usePutSlRejectOrReleaseDo from "@/hooks/usePutSlRejectOrReleaseDo";
import { DocumentType, Invoice } from "@/utils/model";
import usePostPaymentSupporting from "@/hooks/usePostPaymentSupporting";
import TimelineForm from "../TimelineForm";
import { cn } from "@/lib/utils";



const DocumentDetail = () => {
  const context = useAppState();
  const close = useRef<HTMLButtonElement>(null);
  const isDetailPage = useIsDetailPage() && !context.isEditPage;
  const form = useForm<z.infer<typeof RejectOrReleaseSchema>>({
    resolver: zodResolver(RejectOrReleaseSchema),
  });

  const sendDo = usePutSlRejectOrReleaseDo(context.containerIdActive);

  const createPaymentSupporting = usePostPaymentSupporting();

  const queryStatus = [
    {
      kode: "200",
      display: "200 | Reject Request DO",
    },
    {
      kode: "210",
      display: "210 | Release DO",
    },
  ];

  function onSubmit(data: z.infer<typeof RejectOrReleaseSchema>) {
    console.log("RejectOrRelase", data);

    const listDepoExist = context.containerItems.filter((con) => !!!con.depoName).map((con) => con.containerNumber);

    if (listDepoExist.length > 0 && context.isShippingLineProcessing && data.status == "210") {
      listDepoExist.map((item) => {
        toast.error(`Depo data is required for container number ${item}`)
      })
      return;
    }

    if (!queryStatus.map((v) => v.kode).includes(data.status)) {
      toast.error("Kode Status Keputusan Tidak Valid !");
      return;
    }

    sendDo.mutateAsync({
      id: context.containerIdActive,
      status: data.status == "200" ? "Rejected" : "Released",
      do: {
        request: {
          callSign: context.requestDetailForm?.callSign,
          doExpiredDate: context.requestDetailForm?.doExpiredDate,
          doReleaseDate: context.requestDetailForm?.doReleaseDate,
          doReleaseNo: context.requestDetailForm?.doReleaseNo,
          statusNote: data.note,
          terminalOp: context.requestDetailForm?.terminalOperator,
          vesselName: context.requestDetailForm?.vesselName,
          voyageNo: context.requestDetailForm?.voyageNumber,
          cargoDetail: context.containerItems.map((item) => ({
            containerNo: item.containerNumber,
            grossWeight: {
              amount: +item.grossWeight,
              unit: item.unit,
            },
            ownership: item.ownership,
            sealNo: item.sealNumber,
            sizeType: {
              kodeSize: item.sizeAndType,
            },
            depoDetail: {
              alamat: item.alamat as string,
              depoName: item.depoName as string,
              depoNpwp: item.depoNpwp as string,
              kodePos: item.kodePos as string,
              kotaDepo: item.kotaDepo as string,
              noTelp: item.noTelp as string,
            },
          })),
        },
      },
    });
  }

  const checkInputsSL = () => {
    const statusInputsSL = []
    context.containerItems.map((item) => {
      if (!item.depoName || !item.noTelp) {
        statusInputsSL.push(false)
      }
      statusInputsSL.push(true)
    })
    statusInputsSL.push(!!context.requestDetailForm?.vesselName)
    statusInputsSL.push(!!context.requestDetailForm?.voyageNumber)
    statusInputsSL.push(!!context.requestDetailForm?.doReleaseNo)
    statusInputsSL.push(!!context.requestDetailForm?.doExpiredDate)
    statusInputsSL.push(!!context.requestDetailForm?.callSign)
    statusInputsSL.push(!!context.requestDetailForm?.terminalOperator)
    if (statusInputsSL.includes(false)) {
      return false
    }
    return true
  }

  const handleSave = async() => {
    const invoice: Invoice[] = await Promise.all(
      context.paymentItems.map(async (item) => {
        return {
          accountNo: item.accountNumber,
          bankId: item.bank,
          currency: item.currency,
          invoiceDate: item.invoiceDate,
          invoiceNo: item.invoiceNumber,
          totalAmount: +item.totalPayment,
          urlFile: item.urlPayment,
        };
      })
    );

    const documentType: DocumentType[] = await Promise.all(
      context.supportingDocument.map(async (item) => {
        const doc: DocumentType = {
          document: item.documentType,
          documentDate: item.date,
          documentNo: item.documentNumber,
          urlFile: item.urlDocument,
        };
        return doc;
      })
    );

    const payloadData = {
      paymentDetail: {
        invoice,
      },
      supportingDocument: {
        documentType,
      },
    }

    createPaymentSupporting.mutateAsync({
      id: context.containerIdActive,
      payload: payloadData,
    })
  }

  const checkDocumentDetail = async () => {
    const isContainer = context.isContainer;
    const isCocExist = context.containerItems.find(
      (val) => val.ownership == "Carrier Owned Container"
    );
    const isSocExist = context.containerItems.find(
      (val) => val.ownership == "Shipper Owned Container"
    );
    const isSpkExist = context.supportingDocument.find(
      (val) => val.documentType == "0500005"
    )
    const isVinExist = context.supportingDocument.find(
      (val) => val.documentType == "0500010"
    );
    const isLoiExist = context.supportingDocument.find(
      (val) => val.documentType == "0500004"
    )
    const isInvoiceExist = context.supportingDocument.find((val) => val.documentType == "0400380")

    if (context.requestDetailForm?.paymentType == "2" && !isInvoiceExist) {
      toast.error("Supporting Document (Invoice) is required!")
      return false;
    }

    if (context.requestDetailForm?.paymentType === "1" && !context.paymentItems.length) {
      toast.error("Payment Details are required!")
      return false;
    }

    if (isContainer) {
      if (isCocExist && !isSpkExist) {
        toast.error("Surat Peminjaman Kontainer is required!");
        return false;
      }
      if (isSocExist && !isLoiExist) {
        toast.error("Letter of Indemnity (LOI) is required!")
        return false;
      }
    } else {
      if (!isVinExist && context.vinItems.length) {
        toast.error("Dokumen VIN is required!")
        return false;
      }
    }
    return true;
  }

  const handleNext = async () => {
    const isDocumentCompleted = await checkDocumentDetail();
    if (isDocumentCompleted) {
      context.handleNextForm();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, handler: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handler();
    }
  };


  return (
    <>
          <div className="flex justify-center gap-20 py-5 border-b">
            <div
                className={cn(
                "flex flex-col items-center gap-2 cursor-pointer",
                context.formIndex <= 1 ? "text-primary" : "text-muted-foreground"
                )}
                onClick={() => {
                  context.handleSpecificForm(0)
                }}
                onKeyDown={(e) => handleKeyDown(e, () => context.handleSpecificForm(0))}
                role="button"
                tabIndex={0}
            >
                <Megaphone width={50} height={50} />
                <p className="text-xs font-medium">Notification Data</p>
            </div>
            <div
                className={cn(
                "flex flex-col items-center gap-2 cursor-pointer",
                context.formIndex == 2 ? "text-primary" : "text-muted-foreground"
                )}
                onClick={() => {
                    context.handleSpecificForm(context.containerIdActive ? 2 : 0)
                }}
                onKeyDown={(e) => handleKeyDown(e, () => context.handleSpecificForm(context.containerIdActive ? 2 : 0))}
                role="button"
                tabIndex={0}
            >
                <Container width={50} height={50} />
                <p className="text-xs font-medium">
                {context.isContainer ? "Container" : "Non Container"} Data
                </p>
            </div>
            <div
                className={cn(
                "flex flex-col items-center gap-2 cursor-pointer",
                context.formIndex == 3 ? "text-primary" : "text-muted-foreground"
                )}
                onClick={() => {
                    context.handleSpecificForm(context.containerIdActive ? 3 : 0)
                }}
                onKeyDown={(e) => handleKeyDown(e, () => context.handleSpecificForm(context.containerIdActive ? 3 : 0))}
                role="button"
                tabIndex={0}
            >
                <FileText width={50} height={50} />
                <p className="text-xs font-medium">Document Data</p>
            </div>
            {!isDetailPage && (
              <div
                className={cn(
                  "flex flex-col items-center gap-2 cursor-pointer",
                  context.formIndex == 4 ? "text-primary" : "text-muted-foreground"
                )}
                onClick={async () => {
                  const isDocumentCompleted = await checkDocumentDetail();
                  if (isDocumentCompleted) {
                    context.handleSpecificForm(context.containerIdActive ? 4 : 0);
                  }
                }}
                onKeyDown={(e) => handleKeyDown(e, async () => {
                  const isDocumentCompleted = await checkDocumentDetail();
                  if (isDocumentCompleted) {
                    context.handleSpecificForm(context.containerIdActive ? 4 : 0);
                  }
                })}
                role="button"
                tabIndex={0}
              >
                <ListChecks width={50} height={50} />
                <p className="text-xs font-medium">Checkpoint</p>
              </div>
            )}
          </div>
    <div className="flex flex-col gap-4">
      <h3 className="text-2xl self-start font-semibold border-b inline py-2">
        Payment Detail
      </h3>
      <div className="flex justify-end">
        <PaymentItemForm />
      </div>
      <DataTable data={context.paymentItems} columns={columnsPayment} />
      <h3 className="text-2xl self-start font-semibold border-b inline py-2">
        Supporting Document
      </h3>
      <div className="flex justify-end">
        <SupportDocItemForm />
      </div>
      <DataTable
        data={context.supportingDocument}
        columns={columnsSupporting}
      />
      <div className="col-span-12 flex justify-between">
        <Button className="flex gap-2" onClick={context.handlePrevForm}>
          <ChevronLeft /> Back
        </Button>

        <div className="flex gap-4">
          {!isDetailPage && (
            <Button onClick={handleSave} variant={"outline"} className="flex gap-2">
              Save <Save />
            </Button>
          )}
          
          {!isDetailPage && (
            <Button onClick={handleNext} className="flex gap-2">
              Next <ChevronRight />
            </Button>
          )}
        </div>

        <Dialog>
          {context.isShippingLineProcessing && (
            <DialogTrigger asChild>
              <Button className="flex gap-2 bg-green-500" disabled={!checkInputsSL()}>
                Process DO <Send />
              </Button>
            </DialogTrigger>
          )}
          <DialogContent>
            <DialogHeader className="border-b pb-4">
              <DialogTitle>Process DO</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className=" grid grid-cols-12 gap-4"
              >
                {/* Status result*/}
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className={"col-span-full"}>
                      <FormLabel>Status Keputusan *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Please Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {queryStatus.map((item: any, idx: number) => (
                            <SelectItem
                              value={item.kode}
                              key={idx}
                              className="line-clamp-1"
                            >
                              {item.display}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* note */}
                <FormField
                  control={form.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem className={"col-span-full"}>
                      <FormLabel>Note</FormLabel>
                      <FormControl>
                        <textarea
                          placeholder="Max. 255 Characters"
                          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                          rows={4}
                        ></textarea>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="col-span-12 flex justify-end gap-2 ">
                  <DialogClose ref={close} asChild>
                    <Button variant={"outline"}>Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
    </>
    
  );
};

export default DocumentDetail;
