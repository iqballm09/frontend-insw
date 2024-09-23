"use client";
import React, { useEffect, useRef, useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
    ArrowUpRightSquare,
    CalendarIcon,
    Check,
    ChevronRight,
    ChevronsUpDown,
    Save,
    XCircle,
    ListChecks,
    Megaphone,
    FileText,
    Container,
    File,

} from "lucide-react";
import { Calendar } from "../ui/calendar";
import RequestDetailSchema, {
    RequestDetailForm,
} from "@/validation/RequestDetailSchema";
import { useAppState } from "@/provider/AppProvider";
import useGetShippingLine from "@/hooks/useGetShippingLine";
import useGetBlType from "@/hooks/useGetBlType";
import useGetTermOfPayment from "@/hooks/useGetTermOfPayment";
import { discardFile, getBlType, uploadFile } from "@/utils/api";
import { toast } from "sonner";
import { useIsDetailPage } from "@/hooks/useIsDetailPage";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "../ui/command";
import useGetTerminalOperator from "@/hooks/useGetTerminalOperator";
import { RequestDetail } from "@/utils/model";
import usePostRequestDetail from "@/hooks/usePostRequestDetail";
import usePutRequestDetail from "@/hooks/usePutRequestDetail";
import useGetStatusDo from "@/hooks/useGetStatusDo";



export const checkSLInputs = async (data: any) => {
    const requiredFields = [
        { field: data.vesselName, name: "Vessel Name" },
        { field: data.voyageNumber, name: "Voyage Number" },
        { field: data.doReleaseNo, name: "DO Release Number" },
        { field: data.doExpiredDate, name: "DO Expired Date" },
        { field: data.doReleaseDate, name: "DO Release Date" },
        { field: data.callSign, name: "Call Sign" },
        { field: data.terminalOperator, name: "Terminal Operator" }
    ];

    const listException = requiredFields
        .filter(item => !item.field)
        .map(item => item.name);

    if (listException.length > 0) {
        toast.error(`${listException.join(", ")} ${listException.length === 1 ? "is" : "are"} required!`);
        return false;
    }
    return true;
}

const FormRequestDetail = () => {
    const context = useAppState();
    const docBLRef = useRef<HTMLInputElement | null>(null);
    const fileFFRef = useRef<HTMLInputElement | null>(null);
    const [isRejected, setIsRejected] = useState(false);
    const [keywordSL, setKeywordSL] = useState("");
    const isDisabled = useIsDetailPage();
    const form = useForm<z.infer<typeof RequestDetailSchema>>({
        resolver: zodResolver(RequestDetailSchema),
        defaultValues: context.requestDetailForm,
        mode: "onChange",
        disabled: !context.isShippingLineProcessing && isDisabled,
    });
    
    const handleChange = (key: string) => {
        setKeywordSL(key);
    };

    const [calendarOpenBL, setCalendarOpenBL] = useState(false);
    const [calendarOpenBC, setCalendarOpenBC] = useState(false);
    const [calendarOpenReqdoExp, setCalendarOpenReqdoExp] = useState(false);
    const [calendarOpenDOExpired, setCalendarOpenDOExpired] = useState(false);
    const [calendarOpenDORelease, setCalendarOpenDORelease] = useState(false);
    const statusData = useGetStatusDo(context.containerIdActive);
    const queryStatus = context.containerIdActive ? statusData.data : [];
    const isContainer = context.isContainer;
    const isDetailPage = useIsDetailPage() && !context.isEditPage;
    const querySl = useGetShippingLine(keywordSL);
    const queryBlType = useGetBlType();
    const queryTermOfPayment = useGetTermOfPayment();
    const querTo = useGetTerminalOperator();
    const createRequestDetail = usePostRequestDetail();
    const updateRequestDetail = usePutRequestDetail();

    const isOpenBLDoc = () => {
        const isFileExist = (!!form.watch("ladingBillFile") && !!form.watch("urlBlFile")) || (!!context.requestDetailForm?.ladingBillFile && !!context.requestDetailForm.urlBlFile);
        if (form.watch("ladingBillType") == "1" || context.requestDetailForm?.ladingBillType == "1") {
            return true
        }
        if (isFileExist) {
            return true
        } else {
            if (context.isEditPage || context.isCreatePage) {
                return true;
            }
            return false
        }
    }

    const onSave = async (data: z.infer<typeof RequestDetailSchema>) => {
        context.setRequestDetailForm(data);
        const requestDetail: RequestDetail = {
            requestType: isContainer ? 1 : 2,
            requestor: {
              requestorType: data.requestorType,
              urlFile: data.urlSuratKuasa,
            },
            shippingLine: {
              doExpired: data.doExpired,
              shippingType: data.shippingType,
              vesselName: data.vesselName,
              voyageNumber: data.voyageNumber,
            },
            document: {
              ladingBillDate: data.ladingBillDate,
              ladingBillNumber: data.ladingBillNumber,
              ladingBillType: data.ladingBillType,
              urlFile: data.urlBlFile,
              bc11Date: data.BcDate,
              bc11Number: data.BcNumber,
              posNumber: data.posNumber,
            },
            payment: data.paymentType,
        };
        console.log(requestDetail)
        if (context.containerIdActive) {
            await updateRequestDetail.mutateAsync({
                id: context.containerIdActive,
                payload: requestDetail,
                status: context.isShippingLineProcessing ? "Processed" : "Draft" 
            })
        } else {
            await createRequestDetail.mutateAsync({
                payload: requestDetail
            })
        }
    }



    async function handleNext(data: z.infer<typeof RequestDetailSchema>) {
        console.log("request detail", data);
        context.setRequestDetailForm(data);
        if (context.isShippingLineProcessing) {
            const isInputsExist = await checkSLInputs(data);
            if (isInputsExist) {
                context.handleNextForm()
            }
        } else {
            context.handleNextForm();
        }
    }

    useEffect(() => {
        const requestorType = form.watch("requestorType");
        if (requestorType === "1") {
          form.setValue("urlFileFF", undefined);
        }
      }, [form, form.watch("requestorType")]);

    useEffect(() => {
        if (queryStatus) {
          queryStatus.forEach((item: any) => {
            if (item.status === "Rejected") {
              setIsRejected(true);
            }
          });
        }
      }, [queryStatus]);

    const requestorType = form.watch("requestorType");

    const handleDiscardFile = (
        e: React.MouseEvent<SVGSVGElement, MouseEvent>,
        field: `urlFileFF` | `ladingBillFile`,
        type: "billing" | "requestor" | "document" | "payment",
        name: string
    ) => {
        e.stopPropagation();
        toast.promise(discardFile(name, type), {
            loading: "Discarding...",
            success: "Success discard file",
            error: "Error when discard file",
        });
        if (field == "urlFileFF") {
            form.setValue(field, undefined);
            form.setValue("urlSuratKuasa", undefined);
        }
        if (field == "ladingBillFile") {
            form.setValue(field, undefined);
            form.setValue("urlBlFile", undefined);
        }
    };

    const handleUploadFile = async (
        file: File,
        type: "billing" | "requestor" | "document" | "payment"
    ) => {
        toast.promise(uploadFile(file, type), {
            loading: "Uploading...",
            success(url) {
                if (type == "requestor") {
                    form.setValue("urlSuratKuasa", url.urlFile);
                }

                if (type == "billing") {
                    form.setValue("urlBlFile", url.urlFile);
                }
                
                return "Success upload file";
            },
            error: "Error upload file",
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, handler: () => void) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handler();
        }
    };
    
    const readOnlyStyle = `read-only:opacity-70 read-only:cursor-not-allowed read-only:ring-0 read-only:outline-none read-only:focus:outline-none read-only:focus:ring-0`;
    const labelStyle = context.isShippingLineProcessing
        ? `opacity-100 cursor-not-allowed ring-0 outline-none focus:outline-none focus:ring-0`
        : "";
    const labelStyleSL = context.isShippingLineProcessing || isRejected 
        ? `opacity-100 cursor-not-allowed ring-0 outline-none focus:outline-none focus:ring-0`
        : "";
    return (
        <>
    <div className="flex justify-center gap-20 py-5 border-b">
      <div
        className={cn(
          "flex flex-col items-center gap-2 cursor-pointer",
          context.formIndex <= 1 ? "text-primary" : "text-muted-foreground"
        )}
        onClick={() => context.handleSpecificForm(0)}
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
        onClick={async () => {
          context.setRequestDetailForm(form.getValues());
          if (context.isShippingLineProcessing) {
            const isSLInputsExist = await checkSLInputs(form.getValues());
            if (isSLInputsExist) {
              context.handleSpecificForm(context.containerIdActive ? 2 : 0);
            }
          } else {
            context.handleSpecificForm(context.containerIdActive ? 2 : 0);
          }
        }}
        onKeyDown={(e) => handleKeyDown(e, async () => {
          context.setRequestDetailForm(form.getValues());
          if (context.isShippingLineProcessing) {
            const isSLInputsExist = await checkSLInputs(form.getValues());
            if (isSLInputsExist) {
              context.handleSpecificForm(context.containerIdActive ? 2 : 0);
            }
          } else {
            context.handleSpecificForm(context.containerIdActive ? 2 : 0);
          }
        })}
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
        onClick={async () => {
          context.setRequestDetailForm(form.getValues());
          if (context.isShippingLineProcessing) {
            const isSLInputsExist = await checkSLInputs(form.getValues());
            if (context.isContainer && isSLInputsExist) {
              const checkInputDepo = context.containerItems.map((item) => {
                if (!item.depoName || !item.noTelp) {
                  toast.error(`Depo data on container number ${item.containerNumber} must be filled!`);
                  return false;
                }
                return true;
              });
              if (!checkInputDepo.includes(false)) {
                context.handleSpecificForm(context.containerIdActive ? 3 : 0);
              }
            } else {
              if (isSLInputsExist) {
                context.handleSpecificForm(context.containerIdActive ? 3 : 0);
              }
            }
          } else {
            context.handleSpecificForm(context.containerIdActive ? 3 : 0);
          }
        }}
        onKeyDown={(e) => handleKeyDown(e, async () => {
          context.setRequestDetailForm(form.getValues());
          if (context.isShippingLineProcessing) {
            const isSLInputsExist = await checkSLInputs(form.getValues());
            if (context.isContainer && isSLInputsExist) {
              const checkInputDepo = context.containerItems.map((item) => {
                if (!item.depoName || !item.noTelp) {
                  toast.error(`Depo data on container number ${item.containerNumber} must be filled!`);
                  return false;
                }
                return true;
              });
              if (!checkInputDepo.includes(false)) {
                context.handleSpecificForm(context.containerIdActive ? 3 : 0);
              }
            } else {
              if (isSLInputsExist) {
                context.handleSpecificForm(context.containerIdActive ? 3 : 0);
              }
            }
          } else {
            context.handleSpecificForm(context.containerIdActive ? 3 : 0);
          }
        })}
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
            context.setRequestDetailForm(form.getValues());
            if (context.isShippingLineProcessing) {
              context.handleSpecificForm(context.containerIdActive ? 4 : 0);
            } else {
              context.handleSpecificForm(context.containerIdActive ? 4 : 0);
            }
          }}
          onKeyDown={(e) => handleKeyDown(e, async () => {
            context.setRequestDetailForm(form.getValues());
            if (context.isShippingLineProcessing) {
              context.handleSpecificForm(context.containerIdActive ? 4 : 0);
            } else {
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
            <div className="flex justify-between items-center">
                <h3 className="text-2xl self-start font-semibold border-b inline py-2">
                    Request Detail
                </h3>
            </div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSave)}
                    className=" grid grid-cols-12 gap-4 "
                >
                    {/* Requestor Type */}
                    <FormField
                        control={form.control}
                        defaultValue="1"
                        name="requestorType"
                        render={({ field }) => (
                            <FormItem
                                className={cn(
                                    "space-x-0 ",
                                    requestorType == "2" || form.watch("urlSuratKuasa")
                                        ? "col-span-4"
                                        : "col-span-full"
                                )}
                            >
                                <FormLabel className={labelStyle}>Requestor Type * </FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex space-x-3 "
                                        disabled={isDisabled}
                                    >
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="1" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Cargo Owner</FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="2" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                Freight Forwarder
                                            </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* If FF, File Exist */}
                    {form.watch("requestorType") == "2" && (
                        <FormField
                            control={form.control}
                            defaultValue={form.watch("urlFileFF")}
                            name="urlFileFF"
                            render={({ field: { value, onChange, ...fieldProps } }) => (
                                <FormItem className="col-span-4">
                                    <FormLabel className={labelStyle}>Surat kuasa *</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...fieldProps}
                                            ref={fileFFRef}
                                            onChange={(event) => {
                                                onChange(event?.target.files?.[0]);
                                                if (event?.target.files?.[0]) {
                                                    handleUploadFile(
                                                        event?.target.files?.[0],
                                                        "requestor"
                                                    );
                                                }
                                            }}
                                            type="file"
                                            className={cn(
                                                "bg-primary text-white hidden w-0 cursor-pointer"
                                            )}
                                        />
                                    </FormControl>
                                    <div className="flex gap-2 items-center relative">
                                        <FormLabel>
                                            <File className="text-primary" />
                                        </FormLabel>
                                        <FormLabel className="relative">
                                            {form.watch("urlSuratKuasa") && (
                                                <div
                                                    onClick={() =>
                                                        window.open(form.watch("urlSuratKuasa"), "_blank")
                                                    }
                                                    className="rounded-md cursor-pointer absolute text-white transition-all opacity-100 z-10 top-0 left-0 bottom-0 right-0 bg-[rgba(2,39,95,.9)] flex justify-center items-center gap-2"
                                                >
                                                    View <ArrowUpRightSquare width={16} />
                                                </div>
                                            )}
                                            <Input
                                                type="text"
                                                placeholder={
                                                    !form.watch("urlSuratKuasa") &&
                                                        form.watch("urlFileFF")?.name
                                                        ? "Loading file.."
                                                        : (form.watch("urlFileFF")?.name ? "" : "Upload a File")
                                                }
                                                className={`bg-primary placeholder:text-sm placeholder:font-normal placeholder:text-white placeholder:line-clamp-1 cursor-pointer`}
                                                readOnly
                                                onClick={() => {
                                                    if (form.watch("urlFileFF")?.name) {
                                                        return;
                                                    }
                                                    fileFFRef.current?.click();
                                                }}
                                            />
                                        </FormLabel>
                                        {!isDisabled && (
                                            <XCircle
                                                size={20}
                                                className={cn(
                                                    "cursor-pointer",
                                                    form.watch("urlFileFF")?.name ? "" : "hidden"
                                                )}
                                                fill={"hsl(222.2 84% 4.9%)"}
                                                color="white"
                                                onClick={(e) => {
                                                    handleDiscardFile(
                                                        e,
                                                        "urlFileFF",
                                                        "requestor",
                                                        form
                                                            .watch("urlSuratKuasa")
                                                            ?.split("/")
                                                            .pop() as string
                                                    );
                                                }}
                                            />
                                        )}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    {(
                        <>
                            {/* Requestor name */}
                            <FormField
                                control={form.control}
                                name="requestorName"
                                render={({ field }) => (
                                    <FormItem className="col-start-1 col-span-4 ">
                                        <FormLabel className={labelStyle}>
                                            Requestor Name *
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                readOnly={true}
                                                className={readOnlyStyle}
                                                placeholder={context.userInfo?.profile.details.full_name}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Requestor npwp */}
                            <FormField
                                control={form.control}
                                name="requestorNpwp"
                                render={({ field }) => (
                                    <FormItem className="col-span-4">
                                        <FormLabel className={labelStyle}>
                                            Requestor NPWP *
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                readOnly={true}
                                                className={readOnlyStyle}
                                                placeholder={context.userInfo?.organization.npwp}
                                                {...field}
                                                pattern="[0-9]*"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Requestor nib */}
                            <FormField
                                control={form.control}
                                name="requestorNib"
                                render={({ field }) => (
                                    <FormItem className="col-span-4">
                                        <FormLabel className={labelStyle}>
                                            Requestor NIB *
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                readOnly={true}
                                                className={readOnlyStyle}
                                                placeholder={context.userInfo?.organization.nib}
                                                {...field}
                                                pattern="[0-9]*"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Requestor alamat */}
                            <FormField
                                control={form.control}
                                name="requestorAlamat"
                                render={({ field }) => (
                                    <FormItem className="col-start-1 col-span-full ">
                                        <FormLabel className={labelStyle}>
                                            Requestor Address *
                                        </FormLabel>
                                        <FormControl>
                                            <textarea
                                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
                                                {...field}
                                                placeholder={context.userInfo?.organization.address.address + ", " + context.userInfo?.organization.address.city}
                                                rows={5}
                                                disabled
                                            ></textarea>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                    )}

                    {/* Shipping Line */}
                    <FormField
                        control={form.control}
                        name="shippingType"
                        render={({ field }) => (
                            <FormItem className="col-start-1 col-span-4">
                                <FormLabel className={labelStyleSL}>Shipping Line *</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                disabled={isDisabled || isRejected}
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "w-full justify-between",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                <span className="line-clamp-1"> {field.value ? field.value : "Select Shipping Line"} </span>
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="bg-pink-200 p-0">
                                        <Command>
                                            <CommandInput                         
                                                onValueChange={(key) => {
                                                    handleChange(key);
                                                }}
                                                placeholder="Input Code (3 letters) or Description.." />
                                            <CommandEmpty>No Shipping line found.</CommandEmpty>
                                            <CommandGroup className="max-h-[200px] overflow-y-auto">
                                                {querySl.isSuccess &&
                                                    querySl.data.filter((item: any) => item.kode === keywordSL.toUpperCase() || item.uraian.toUpperCase().includes(keywordSL.toUpperCase())).map((item: any, idx: number) => (
                                                        <CommandItem
                                                            value={item.display.replace(/[\r\n]/g, "")}
                                                            key={item.kode + idx}
                                                            onSelect={() => {
                                                                form.setValue(
                                                                    "shippingType",
                                                                    item.display.replace(/[\r\n]/g, "")
                                                                );
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    item.display.replace(/[\r\n]/g, "") ===
                                                                        field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {item.display}
                                                        </CommandItem>
                                                    ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Vessel Number */}
                    <FormField
                        control={form.control}
                        name="vesselName"
                        render={({ field }) => (
                            <FormItem className="col-span-4">
                                <FormLabel>Vessel Name *</FormLabel>
                                <FormControl>
                                    <Input placeholder="ex. VESSEL123" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Voyage Number */}
                    <FormField
                        control={form.control}
                        name="voyageNumber"
                        render={({ field }) => (
                            <FormItem className="col-span-4">
                                <FormLabel>Voyage Number *</FormLabel>
                                <FormControl>
                                    <Input placeholder="ex. VOYAGE123" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* BL Number */}
                    <FormField
                        control={form.control}
                        name="ladingBillNumber"
                        render={({ field }) => (
                            <FormItem className="col-span-3">
                                <FormLabel className={labelStyle}>
                                    Bill of Lading Number *
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        readOnly={context.isShippingLineProcessing}
                                        className={
                                            context.isShippingLineProcessing ? readOnlyStyle : ""
                                        }
                                        placeholder="ex. BL1234"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* BL Type */}
                    <FormField
                        control={form.control}
                        name="ladingBillType"
                        render={({ field }) => (
                            <FormItem className="col-span-3">
                                <FormLabel className={labelStyle}>BL Type *</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                disabled={isDisabled}
                                                variant="outline"
                                                role="combobox"
                                                className={cn(
                                                    "w-full justify-between",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    <>
                                                        {queryBlType.isSuccess &&
                                                            queryBlType.data.find(
                                                                (item: any) => item.kode === field.value
                                                            )?.display}
                                                    </>
                                                ) : (
                                                    "Select BL Type"
                                                )}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="bg-pink-200 p-0">
                                        <Command>
                                            <CommandInput placeholder="Search BL Type..." />
                                            <CommandEmpty>No BL Type found.</CommandEmpty>
                                            <CommandGroup className="max-h-[200px] overflow-y-auto">
                                                {queryBlType.isSuccess &&
                                                    queryBlType.data.map((item: any, idx: number) => (
                                                        <CommandItem
                                                            value={item.display.replace(/[\r\n]/g, "")}
                                                            key={item.kode + idx}
                                                            onSelect={() => {
                                                                form.setValue("ladingBillType", item.kode);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    item.kode === field.value
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            {item.display}
                                                        </CommandItem>
                                                    ))}
                                            </CommandGroup>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* BL Date */}
                    <FormField
                        control={form.control}
                        name="ladingBillDate"
                        render={({ field }) => (
                            <FormItem className="flex-1 flex flex-col col-span-3 pt-[10px]">
                                <FormLabel className={labelStyle}>BL Date *</FormLabel>
                                <Popover open={calendarOpenBL} onOpenChange={setCalendarOpenBL}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                disabled={isDisabled}
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
                                                setCalendarOpenBL(false);
                                            }}
                                            disabled={(date) => date < new Date("1900-01-01")}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* BL Doc */}
                    {isOpenBLDoc() && (<FormField
                        control={form.control}
                        defaultValue={form.watch("ladingBillFile")}
                        name="ladingBillFile"
                        render={({ field: { value, onChange, ...fieldProps } }) => (
                            <FormItem className="col-span-3">
                                <FormLabel className={labelStyle}>BL Doc *</FormLabel>
                                <FormControl>
                                    <Input
                                        {...fieldProps}
                                        ref={docBLRef}
                                        onChange={(event) => {
                                            onChange(event?.target.files?.[0]);
                                            if (event?.target.files?.[0]) {
                                                handleUploadFile(event?.target.files?.[0], "billing");
                                            }
                                        }}
                                        type="file"
                                        className={cn(
                                            "bg-primary text-white hidden w-0 cursor-pointer"
                                        )}
                                    />
                                </FormControl>
                                <div className="flex gap-2 items-center relative">
                                    <FormLabel>
                                        <File className="text-primary" />
                                    </FormLabel>
                                    <FormLabel className="relative">
                                        {form.watch("urlBlFile") && (
                                            <div
                                                onClick={() =>
                                                    window.open(form.watch("urlBlFile"), "_blank")
                                                }
                                                className="rounded-md cursor-pointer absolute text-white transition-all opacity-100 z-10 top-0 left-0 bottom-0 right-0 bg-[rgba(2,39,95,.9)] flex justify-center items-center gap-2"
                                            >
                                                View <ArrowUpRightSquare width={16} />
                                            </div>
                                        )}
                                        <Input
                                            type="text"
                                            placeholder={
                                                !form.watch("urlBlFile") &&
                                                    form.watch("ladingBillFile")?.name
                                                    ? "Loading file.."
                                                    : (form.watch("ladingBillFile")?.name ? "" :
                                                    "Upload a File")
                                            }
                                            className="bg-primary placeholder:text-sm placeholder:font-normal placeholder:text-white placeholder:line-clamp-1 cursor-pointer"
                                            readOnly
                                            onClick={() => {
                                                if (form.watch("ladingBillFile")?.name) {
                                                    return;
                                                }
                                                docBLRef?.current?.click();
                                            }}
                                        />
                                    </FormLabel>
                                    {!isDisabled && (
                                        <XCircle
                                            size={20}
                                            className={cn(
                                                "cursor-pointer",
                                                form.watch("ladingBillFile")?.name ? "" : "hidden"
                                            )}
                                            fill={"hsl(222.2 84% 4.9%)"}
                                            color="white"
                                            onClick={(e) =>
                                                handleDiscardFile(
                                                    e,
                                                    "ladingBillFile",
                                                    "billing",
                                                    form.watch("urlBlFile")?.split("/").pop() as string
                                                )
                                            }
                                        />
                                    )}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />)}


                    {/* BC Number */}
                    <FormField
                        control={form.control}
                        name="BcNumber"
                        render={({ field }) => (
                            <FormItem className="col-span-4">
                                <FormLabel className={labelStyle}>BC 1.1 Number</FormLabel>
                                <FormControl>
                                    <Input
                                        readOnly={context.isShippingLineProcessing}
                                        className={
                                            context.isShippingLineProcessing ? readOnlyStyle : ""
                                        }
                                        placeholder="ex. BC123"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* BC Date */}
                    <FormField
                        control={form.control}
                        name="BcDate"
                        render={({ field }) => (
                            <FormItem className="flex-1 flex flex-col col-span-4 pt-[10px]">
                                <FormLabel className={labelStyle}>BC 1.1 Date</FormLabel>
                                <Popover open={calendarOpenBC} onOpenChange={setCalendarOpenBC}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                disabled={isDisabled}
                                                variant={"outline"}
                                                className={cn(
                                                    " pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(new Date(field?.value), "yyyy-MM-dd")
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
                                            selected={new Date(field.value as string)}
                                            onSelect={(date) => {
                                                field.onChange(date);
                                                setCalendarOpenBC(false);
                                            }}
                                            disabled={(date) => date < new Date("1900-01-01")}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Nomor Pos */}
                    <FormField
                        control={form.control}
                        name="posNumber"
                        render={({ field }) => (
                            <FormItem className="col-span-4">
                                <FormLabel className={labelStyle}>Pos Number</FormLabel>
                                <FormControl>
                                    <Input
                                        readOnly={context.isShippingLineProcessing}
                                        className={
                                            context.isShippingLineProcessing ? readOnlyStyle : ""
                                        }
                                        placeholder="ex. 1661"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* DO Expired */}
                    <FormField
                        control={form.control}
                        name="doExpired"
                        render={({ field }) => (
                            <FormItem className="flex-1 flex flex-col col-span-4 pt-[10px]">
                                <FormLabel className={labelStyle}>
                                    DO Expired Date Request *
                                </FormLabel>
                                <Popover open={calendarOpenReqdoExp} onOpenChange={setCalendarOpenReqdoExp}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                disabled={isDisabled}
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
                                                setCalendarOpenReqdoExp(false);
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

                    {/* Term of payment */}
                    <FormField
                        control={form.control}
                        name="paymentType"
                        render={({ field }) => (
                            <FormItem className="col-span-4">
                                <FormLabel className={labelStyle}>Term of Payment *</FormLabel>
                                <Select
                                    disabled={isDisabled}
                                    onValueChange={field.onChange}
                                    defaultValue={field.value != "999" ? field.value : undefined}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select payment type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {queryTermOfPayment.isSuccess &&
                                            queryTermOfPayment.data.map((bl: any, idx: number) => (
                                                <SelectItem
                                                    value={String(bl.kode)}
                                                    key={idx}
                                                    className="line-clamp-1"
                                                >
                                                    {bl.display}
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {
                        ["Released", "Rejected", "Processed"].includes(context.statusCurrentDO) && (context.userInfo?.roleId === 2) && (
                            <>
                                {/* Call sign */}
                                <FormField
                                    control={form.control}
                                    name="callSign"
                                    render={({ field }) => (
                                        <FormItem className="col-span-4">
                                            <FormLabel>Call Sign *</FormLabel>
                                            <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="ex. 124134"
                                                {...field}
                                                onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    const value = e.target.value;
                                                    if (value.length > 10) {
                                                    e.target.value = value.slice(0, 10);
                                                    }
                                                }}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    const value = e.target.value;
                                                    if (value.length > 10) {
                                                    field.onChange(value.slice(0, 10));
                                                    } else {
                                                    field.onChange(value);
                                                    }
                                                }}
                                            />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* Do Release Number */}
                                <FormField
                                    control={form.control}
                                    name="doReleaseNo"
                                    render={({ field }) => (
                                        <FormItem className="col-start-1 col-span-3">
                                            <FormLabel>DO Release Number *</FormLabel>
                                            <FormControl>
                                                <Input placeholder="ex. DORELEASE1234" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Do Release Date */}
                                <FormField
                                    control={form.control}
                                    name="doReleaseDate"
                                    render={({ field }) => (
                                        <FormItem className="flex-1 flex flex-col col-span-3 pt-[10px]">
                                            <FormLabel>DO Release Date</FormLabel>
                                            <Popover open={calendarOpenDORelease} onOpenChange={setCalendarOpenDORelease}>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            disabled={
                                                                (isDisabled && context.userInfo?.roleId == 1) ||
                                                                (context.statusCurrentDO != "Processed" &&
                                                                    context.userInfo?.roleId == 2)
                                                            }
                                                            variant={"outline"}
                                                            className={cn(
                                                                " pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(new Date(field?.value), "yyyy-MM-dd")
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
                                                        selected={new Date(field.value as string)}
                                                        onSelect={(date) => {
                                                            field.onChange(date);
                                                            setCalendarOpenDORelease(false);
                                                        }}
                                                        disabled={(date) =>
                                                            date <= new Date() ||
                                                            date < new Date("1900-01-01")
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Do Expired Date */}
                                <FormField
                                    control={form.control}
                                    name="doExpiredDate"
                                    render={({ field }) => (
                                        <FormItem className="flex-1 flex flex-col col-span-3 pt-[10px]">
                                            <FormLabel>DO Expired Date</FormLabel>
                                            <Popover open={calendarOpenDOExpired} onOpenChange={setCalendarOpenDOExpired}>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            disabled={
                                                                (isDisabled && context.userInfo?.roleId == 1) ||
                                                                (context.statusCurrentDO != "Processed" &&
                                                                    context.userInfo?.roleId == 2)
                                                            }
                                                            variant={"outline"}
                                                            className={cn(
                                                                " pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            {field.value ? (
                                                                format(new Date(field?.value), "yyyy-MM-dd")
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
                                                        selected={new Date(field.value as string)}
                                                        onSelect={(date) => {
                                                            field.onChange(date);
                                                            setCalendarOpenDOExpired(false);
                                                        }}
                                                        disabled={(date) =>
                                                            date <= new Date() ||
                                                            date < new Date("1900-01-01")
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Terminal Operator */}
                                <FormField
                                    control={form.control}
                                    name="terminalOperator"
                                    render={({ field }) => (
                                        <FormItem className="col-span-3">
                                            <FormLabel>Terminal Operator *</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            disabled={
                                                                (isDisabled && context.userInfo?.roleId == 1) ||
                                                                (context.statusCurrentDO != "Processed" &&
                                                                    context.userInfo?.roleId == 2)
                                                            }
                                                            variant="outline"
                                                            role="combobox"
                                                            className={cn(
                                                                "w-full justify-between ",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                        >
                                                            <span className="line-clamp-1">
                                                                {field.value ? (
                                                                    <>
                                                                        {querTo.isSuccess &&
                                                                            querTo.data.find(
                                                                                (item: any) => item.kode === field.value
                                                                            )?.display}
                                                                    </>
                                                                ) : (
                                                                    "Select Terminal Operator"
                                                                )}
                                                            </span>
                                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="bg-pink-200 p-0">
                                                    <Command>
                                                        <CommandInput placeholder="Search Terminal Operator..." />
                                                        <CommandEmpty>
                                                            No Terminal Operator found.
                                                        </CommandEmpty>
                                                        <CommandGroup className="max-h-[200px] overflow-y-auto">
                                                            {querTo.isSuccess &&
                                                                querTo.data.map((item: any, idx: number) => (
                                                                    <CommandItem
                                                                        value={item.display.replace(/[\r\n]/g, "")}
                                                                        key={item.kode + idx}
                                                                        onSelect={() => {
                                                                            form.setValue(
                                                                                "terminalOperator",
                                                                                item.kode
                                                                            );
                                                                        }}
                                                                    >
                                                                        <Check
                                                                            className={cn(
                                                                                "mr-2 h-4 w-4",
                                                                                item.kode === field.value
                                                                                    ? "opacity-100"
                                                                                    : "opacity-0"
                                                                            )}
                                                                        />
                                                                        {item.display}
                                                                    </CommandItem>
                                                                ))}
                                                        </CommandGroup>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                    <div className="col-span-12 flex gap-4 justify-end">
                        {!isDisabled && !context.isShippingLineProcessing && <Button type="submit" className="flex gap-2" variant={"outline"}>
                            Save <Save />
                        </Button>}

                        <Button onClick={() => handleNext(form.getValues())} type="button" className="flex gap-2" disabled={!context.containerIdActive}>
                            Next <ChevronRight />
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    </>
    );
};

export default FormRequestDetail;