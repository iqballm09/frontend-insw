import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  CalendarIcon,
  Edit,
  FileText,
  History,
  Megaphone,
  MoreVertical,
  Printer,
  RotateCcw,
  Trash,
  X,
} from "lucide-react";
import { useAppState } from "@/provider/AppProvider";
import { ListDo } from "@/models/ListDo";
import Link from "next/link";
import useDeleteDo from "@/hooks/useDeleteDo";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import useGetStatusDo from "@/hooks/useGetStatusDo";
import { Badge } from "./ui/badge";
import usePutSlProcessDo from "@/hooks/usePutSlProcessDo";
import { extendDO, printDo } from "@/utils/api";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import CancelDOSchema from "@/validation/CancelDOSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useCancelDo from "@/hooks/usePostCancelDo";
import ExtendDoSchema from "@/validation/ExtendDOSchema";
import useExtendDo from "@/hooks/usePostExtendDo";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "@/lib/utils";
import format from "date-fns/format";
import { Calendar } from "./ui/calendar";
import { useRouter } from "next/navigation";

export const ActionDORequest = ({ doRequest }: { doRequest: ListDo }) => {
  const [actionDelete, setActionDelete] = useState(false);
  const [actionCancel, setActionCancel] = useState(false);
  const [actionExtend, setActionExtend] = useState(false);
  const [calendarExtendOpen, setCalendarExtendOpen] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const context = useAppState();
  const cancelDo = useCancelDo();
  const extendDo = useExtendDo();
  const deleteDo = useDeleteDo();
  const procesDo = usePutSlProcessDo(doRequest.id);
  const queryStatus = useGetStatusDo(doRequest.id);
  const router = useRouter()

  const isCancelDO = new Date() < new Date(Date.parse(doRequest.doExp));

  const formCancel = useForm<z.infer<typeof CancelDOSchema>>({
    resolver: zodResolver(CancelDOSchema)
  });

  const formExtend = useForm<z.infer<typeof ExtendDoSchema>>({
    resolver: zodResolver(ExtendDoSchema)
  });

  const onSubmitExtend = (data: z.infer<typeof ExtendDoSchema>) => {
    extendDo.mutateAsync({
      id: doRequest.id,
      doExtendDate: data.doExtendDate
    })
    setActionExtend(false);
  }

  const onSubmitCancel = (data: z.infer<typeof CancelDOSchema>) => {
    cancelDo.mutateAsync({
      id: doRequest.id,
      note: data.note
    })
    setActionCancel(false);
  }

  const handleDelete = () => {
    deleteDo.mutateAsync(doRequest.id);
  };
  
  const handleProcess = () => {
    procesDo.mutateAsync(doRequest.id);
  };

  const handleEditClick = () => {
    context.handleResetAllState();
    const url = context.userInfo?.roleId == 2 ? `/do/${doRequest.id}` : `/do/edit/${doRequest.id}?type=${doRequest.isContainer ? 'kontainer' : 'non-kontainer'}`;
    window.location.href = url; // Set the location to the new URL
  };

  const handlePrint = async () => {
    try {
      const url = await printDo(doRequest.id);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error printing DO:', error);
    }
  };

  useEffect(() => {
    if (queryStatus.data) {
      queryStatus.data.forEach((item: any) => {
        if (item.status === "Rejected") {
          setIsRejected(true);
        }
      });
    }
  }, [queryStatus.data]);

  return (
    <Sheet>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="items-start w-56 z-[99] bg-white flex flex-col p-2 rounded-sm shadow-md"
          >
            {["Submitted", "Processed"].includes(doRequest.status) &&
              context.userInfo?.roleId == 2 && (
                <>
                  {doRequest.status == "Submitted" ? (
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        onClick={() => {
                          setActionDelete(false);
                          setActionCancel(false);
                          setActionExtend(false);
                        }}
                        className="flex items-center cursor-pointer w-full hover:outline-none hover:bg-slate-100 px-2 rounded-sm"
                      >
                        <Megaphone className="h-4 w-4 mr-2" /> Process DO Request
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                  ) : (
                      <DropdownMenuItem
                        onClick={() => {
                          handleEditClick();
                        }}
                        className="flex items-center cursor-pointer w-full hover:outline-none hover:bg-slate-100 px-2 rounded-sm"
                      >
                        <Megaphone className="h-4 w-4 mr-2" /> Process DO Request
                      </DropdownMenuItem>
                  )}
                </>
              )}
            {!["Draft", "Rejected"].includes(doRequest.status) &&
              context.userInfo?.roleId == 1 && (
                <Link href={`/do/${doRequest.id}?type=${doRequest.isContainer ? 'kontainer' : 'non-kontainer'}`} passHref legacyBehavior>
                  <DropdownMenuItem
                    onClick={() => {
                      context.handleResetAllState();
                    }}
                    className="flex items-center cursor-pointer w-full hover:outline-none hover:bg-slate-100 px-2 rounded-sm"
                  >
                    <FileText className="h-4 w-4 mr-2" /> See DO Detail
                  </DropdownMenuItem>
                </Link>
              )}

            {["Submitted", "Released", "Rejected", "Cancelled"].includes(doRequest.status) &&
              context.userInfo?.roleId == 2 && (
                <Link href={`/do/${doRequest.id}?type=${doRequest.isContainer ? 'kontainer' : 'non-kontainer'}`} passHref legacyBehavior>
                  <DropdownMenuItem
                    onClick={() => {
                      context.handleResetAllState();
                    }}
                    className="flex items-center cursor-pointer w-full hover:outline-none hover:bg-slate-100 px-2 rounded-sm"
                  >
                    <FileText className="h-4 w-4 mr-2" /> See DO Detail
                  </DropdownMenuItem>
                </Link>
            )}

            {["Draft", "Rejected"].includes(doRequest.status) &&
              context.userInfo?.roleId == 1 && (
                <DropdownMenuItem
                className="flex items-center cursor-pointer w-full hover:outline-none hover:bg-slate-100 px-2 rounded-sm"
                onClick={handleEditClick}
              >
                <Edit className="h-4 w-4 mr-2" /> Edit
              </DropdownMenuItem>
            )}

            {doRequest.status === 'Released' && (
              <DropdownMenuItem
                onClick={handlePrint}
                className="flex items-center cursor-pointer w-full hover:outline-none hover:bg-slate-100 px-2 rounded-sm"
              >
                <Printer className="h-4 w-4 mr-2" /> Print DO
              </DropdownMenuItem>
            )}

            {doRequest.status === 'Released' && context.userInfo?.roleId === 2 && isCancelDO && (
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  onClick={() => {
                    setActionCancel(true);
                    setActionExtend(false);
                    setActionDelete(false);
                  }}
                  className="flex items-center cursor-pointer w-full hover:outline-none hover:bg-slate-100 px-2 rounded-sm"
                >
                  <X className="h-4 w-4 mr-2" /> Cancel DO
                </DropdownMenuItem>
              </AlertDialogTrigger>
            )}


            {doRequest.status === 'Released' && context.userInfo?.roleId === 1 && (
              <AlertDialogTrigger>
                <DropdownMenuItem
                  onClick={() => {
                    setActionExtend(true);
                    setActionCancel(false);
                    setActionDelete(false);
                  }}
                  className="flex items-center cursor-pointer w-full hover:outline-none hover:bg-slate-100 px-2 rounded-sm"
                >
                  <RotateCcw className="h-4 w-4 mr-2" /> Extend DO
                </DropdownMenuItem>
              </AlertDialogTrigger>
            )}

              <SheetTrigger asChild>
                <DropdownMenuItem
                  onClick={() => {
                    queryStatus.refetch();
                  }}
                  className="flex items-center cursor-pointer w-full hover:outline-none hover:bg-slate-100 px-2 rounded-sm"
                >
                  <History className="h-4 w-4 mr-2" /> DO History
                </DropdownMenuItem>
              </SheetTrigger>

            {context.userInfo?.roleId == 1 &&
              ["Draft"].includes(doRequest.status) && !isRejected && (
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    onClick={() => {
                      setActionDelete(true);
                      setActionCancel(false);
                      setActionExtend(false);
                    }}
                    className="text-destructive flex items-center cursor-pointer w-full hover:outline-none hover:bg-slate-100 px-2 rounded-sm"
                  >
                    <Trash className="h-4 w-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
              )}
          </DropdownMenuContent>
        </DropdownMenu>

        <SheetContent className="w-[450px] sm:w-[540px]">
          <SheetHeader className="border-b pb-2 max-w-[500px]">
            <SheetTitle>Status DO</SheetTitle>
            <SheetDescription>
              <Badge>{doRequest.requestNumber}</Badge>
              {doRequest.status != 'Draft' && <><br/><br/><a><strong>Transaction ID :</strong></a><br/></>}
              {doRequest.status != 'Draft' && <Badge>{doRequest.transactionId}</Badge>}
            </SheetDescription>
          </SheetHeader>
          {queryStatus.isSuccess && (
            <div className="my-4 max-h-[700px] overflow-auto">
              {queryStatus.data
                .slice()
                .reverse()
                .map((item: any, idx: number) => (
                  <div key={idx} className="flex flex-col border-l">
                    <div className="flex flex-col px-3 py-2 relative">
                      <div className="absolute bg-slate-400 rounded-full w-2 h-2 top-[50%] left-[0px] -translate-x-[50%] -translate-y-[50%]"></div>
                      <h1 className="text-md font-bold">{item.status}</h1>
                      <span className="text-sm text-slate-400">{item.datetime}</span>
                      {item.note && (
                        <p className="text-sm text-slate-400 p-2 border rounded-sm">
                          {item.note}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </SheetContent>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionCancel
                ? "Cancel DO Release"
                : actionExtend
                ? "Extend DO Release"
                : "Are you absolutely sure?"}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
              { actionCancel ? <Form {...formCancel}>
                    <form onSubmit={formCancel.handleSubmit(onSubmitCancel)}
                    className=" grid grid-cols-12 gap-4">
                      {/* motive */}
                      <FormField
                        control={formCancel.control}
                        name="note"
                        render={({ field }) => (
                          <FormItem className={"col-span-full"}>
                            <FormLabel>Motive *</FormLabel>
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
                        <AlertDialogCancel ref={close} asChild>
                          <Button variant={"outline"}>Cancel</Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button type="submit" disabled={!!!formCancel.watch("note")}>Process</Button>
                        </AlertDialogAction>    
                      </div>
                    </form>
                  </Form> : 
                  actionExtend ? 
                  <Form {...formExtend}>
                    <form onSubmit={formExtend.handleSubmit(onSubmitExtend)}
                      className="gap-4">
                      {/* DO Extend Date */}
                      <FormField
                        control={formExtend.control}
                        name="doExtendDate"
                        render={({ field }) => (
                          <FormItem className="flex-1 flex flex-col col-span-3 pt-[10px]">
                            <FormLabel>DO Extend Date *</FormLabel>
                            <Popover open={calendarExtendOpen} onOpenChange={setCalendarExtendOpen}>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                " pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ? (
                                                format(new Date(field.value), "yyyy-MM-dd")
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={new Date(field?.value as string)}
                                        onSelect={(date) => {
                                            field.onChange(date);
                                            setCalendarExtendOpen(false);
                                        }}
                                        disabled={(date) =>
                                          date <= new Date() || date < new Date("1900-01-01")
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="col-span-12 flex justify-end gap-2 mt-5">
                        <AlertDialogCancel ref={close} asChild>
                          <Button variant={"outline"}>Cancel</Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Button type="submit" disabled={!!!formExtend.watch("doExtendDate")}>Process</Button>
                        </AlertDialogAction>    
                      </div>
                    </form>
                  </Form> : 
                `This action cannot be undone. This will permanently process your DO Request.`
              }
            </AlertDialogDescription>
          {
            (!actionCancel && !actionExtend) ?           
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                {actionDelete ? (
                  <AlertDialogAction onClick={handleDelete}>
                    Delete
                  </AlertDialogAction>
                ) : (
                  <AlertDialogAction onClick={handleProcess}>
                    Process
                  </AlertDialogAction>
                )}
            </AlertDialogFooter> : null
          }

        </AlertDialogContent>
      </AlertDialog>
    </Sheet>
  );
};