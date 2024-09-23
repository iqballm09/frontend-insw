"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronLeft, ChevronRight, ChevronsUpDown, Container, FileText, ListChecks, Megaphone, Save, SaveAll } from "lucide-react";
import { useAppState } from "@/provider/AppProvider";
import PartiesDetailSchema from "@/validation/PartiesDetailSchema";
import useGetCountry from "@/hooks/useGetCountry";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import useGetPort from "@/hooks/useGetPort";
import { useIsDetailPage } from "@/hooks/useIsDetailPage";
import usePostPartiesDetail from "@/hooks/usePostPartiesDetail";
import { RequestPartiesDetail } from "@/utils/model";
import { toast } from "sonner";
import useGetPortID from "@/hooks/useGetPortID";
import TimelineForm from "../TimelineForm";
import { checkSLInputs } from "./RequestDetail";

const PartiesDetail = () => {
  const [keyword, setKeyword] = useState("a");
  const [country, setCountry] = useState("");
  const context = useAppState();
  const queryCountry = useGetCountry();
  const queryPortLoading = useGetPort(country);
  const queryPortID = useGetPortID();
  const isDetailPage = useIsDetailPage();
  const createPartiesDetail = usePostPartiesDetail();

  const tempPortsLoading = queryPortLoading.isSuccess ? queryPortLoading.data.map((item: any) => ({
    kode: item.kode,
    uraian: item.uraian,
    display: item.display
  })) : []

  const tempPortsID = queryPortID.isSuccess ? queryPortID.data.map((item: any) => ({
    kode: item.kode,
    uraian: item.uraian,
    display: item.display
  })) : [];


  const handleChangeKeyword = (key: string) => {
    setKeyword(key);
  };

  const handleChangeCountry = (key: string) => {
    setCountry(key);
  }

  const updateRequiredNotificationData = () => {
    const listRequired = []
    listRequired.push(`Request Detail - Request DO Expired - ${!!context.requestDetailForm?.doExpired ? true : false}`);
    listRequired.push(`Request Detail - Payment Method - ${!!context.requestDetailForm?.paymentType ? true : false}`)
    listRequired.push(`Request Detail - Vessel Name - ${!!context.requestDetailForm?.vesselName ? true : false}`)
    listRequired.push(`Request Detail - Voyage Number - ${!!context.requestDetailForm?.voyageNumber ? true : false}`)
    listRequired.push(`Parties Detail - Consignee Name - ${!!context.partiesDetailForm?.consigneeName ? true : false}`)
    listRequired.push(`Parties Detail - Consignee NPWP - ${!!context.partiesDetailForm?.consigneeNpwp ? true : false}`)
    listRequired.push(`Parties Detail - Notify Party Name - ${!!context.partiesDetailForm?.notifyPartyName ? true : false}`)
    listRequired.push(`Parties Detail - Notify Party NPWP - ${!!context.partiesDetailForm?.notifyPartyNpwp ? true : false}`)
    listRequired.push(`Parties Detail - Shipper Name - ${!!context.partiesDetailForm?.shipperName ? true : false}`)
    listRequired.push(`Parties Detail - Place of Loading - ${!!context.partiesDetailForm?.placeOfLoading ? true : false}`);
    listRequired.push(`Parties Detail - Port of Loading - ${!!context.partiesDetailForm?.portOfLoading ? true : false}`);
    listRequired.push(`Parties Detail - Port of Discharge - ${!!context.partiesDetailForm?.portOfDischarge ? true : false}`);
    listRequired.push(`Parties Detail - Port of Destination - ${!!context.partiesDetailForm?.portOfDestination ? true : false}`);
    
    const result = listRequired.filter((item) => item.includes(" - false"));
    context.setListRequiredNotificationData(result)
  }

  const onSave = async (data: z.infer<typeof PartiesDetailSchema>) => {
    const requestPartiesDetail: RequestPartiesDetail = {
      requestDetail: {
        requestor: {
          requestorType: context.requestDetailForm?.requestorType,
          urlFile: context.requestDetailForm?.urlSuratKuasa,
        },
        shippingLine: {
          doExpired: context.requestDetailForm?.doExpired,
          shippingType: context.requestDetailForm?.shippingType,
          vesselName: context.requestDetailForm?.vesselName,
          voyageNumber: context.requestDetailForm?.voyageNumber,
        },
        document: {
          ladingBillDate: context.requestDetailForm?.ladingBillDate,
          ladingBillNumber: context.requestDetailForm?.ladingBillNumber,
          ladingBillType: context.requestDetailForm?.ladingBillType,
          urlFile: context.requestDetailForm?.urlBlFile,
          bc11Date: context.requestDetailForm?.BcDate,
          bc11Number: context.requestDetailForm?.BcNumber,
          posNumber: context.requestDetailForm?.posNumber,
        },
        payment: context.requestDetailForm?.paymentType
      },
      parties: {
        consignee: {
          name: data.consigneeName,
          npwp: data.consigneeNpwp
        },
        notifyParty: {
          name: data.notifyPartyName,
          npwp: data.notifyPartyNpwp
        },
        shipper: {
          name: data.shipperName
        }
      },
      location: {
        locationType: [
          {
            location: "0",
            countryCode: data.placeOfLoading,
            portCode: data.portOfLoadingCode,
            portDetail: data.portOfLoading,
          },
          {
            location: "1",
            countryCode: data.placeOfLoading,
            portCode: data.portOfDischargeCode,
            portDetail: data.portOfDischarge,
          },
          {
            location: "2",
            countryCode: data.placeOfLoading,
            portCode: data.portOfDestinationCode,
            portDetail: data.portOfDestination,
          },
        ],
      },
    }
    context.setPartiesDetailForm(data)
    console.log(requestPartiesDetail)
    createPartiesDetail.mutateAsync({
      id: context.containerIdActive,
      payload: requestPartiesDetail
    })

  }

  useEffect(() => {
    queryPortID.refetch();
  }, [keyword, queryPortID]);

  const form = useForm<z.infer<typeof PartiesDetailSchema>>({
    resolver: zodResolver(PartiesDetailSchema),
    defaultValues: context.partiesDetailForm,
    mode: "onChange",
    disabled: !!isDetailPage,
  });

  useEffect(() => {
    const placeOfLoading = form.getValues('placeOfLoading') || "";
    setCountry(placeOfLoading);
  }, [form]);

  useEffect(() => {
    if (country) {
      queryPortLoading.refetch();
    }
  }, [country, queryPortLoading]);


  function handleNext(data: z.infer<typeof PartiesDetailSchema>) {
    console.log("Parties detail", data);
    updateRequiredNotificationData();
    context.setPartiesDetailForm(data);
    context.handleNextForm();
  }

  function handlePrev(data: z.infer<typeof PartiesDetailSchema>) {
    context.setPartiesDetailForm(data);
    updateRequiredNotificationData();
    context.handlePrevForm();
  }

  return (
    <>
      <div className="flex justify-center gap-20 py-5 border-b">
            <div
                className={cn(
                "flex flex-col items-center gap-2 cursor-pointer",
                context.formIndex <= 1 ? "text-primary" : "text-muted-foreground"
                )}
                onClick={() => {
                  context.setPartiesDetailForm(form.getValues())
                  updateRequiredNotificationData();
                  context.handleSpecificForm(0)
                }}
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
                    context.setPartiesDetailForm(form.getValues())
                    updateRequiredNotificationData();
                    context.handleSpecificForm(context.containerIdActive ? 2 : 0)
                }}
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
                      if (context.isShippingLineProcessing) {
                        const isSLInputsExist = await checkSLInputs(context.requestDetailForm)
                        if (context.isContainer && isSLInputsExist) {
                            const checkInputDepo = context.containerItems.map((item) => {
                                if (!item.depoName || !item.noTelp) {
                                  toast.error(`Depo data on container number ${item.containerNumber} must be filled!`)
                                  return false;
                                }
                                return true;
                              })
                            if (!checkInputDepo.includes(false)) {
                                context.handleSpecificForm(context.containerIdActive ? 3 : 0)
                            }
                        } else {
                            if (isSLInputsExist) {
                                context.handleSpecificForm(context.containerIdActive ? 3 : 0)
                            }
                        }
                    } else {
                      context.setPartiesDetailForm(form.getValues())
                      updateRequiredNotificationData();
                      context.handleSpecificForm(context.containerIdActive ? 3 : 0)
                    }
                }}
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
                onClick={() => {
                    context.setPartiesDetailForm(form.getValues())
                    updateRequiredNotificationData();
                    context.handleSpecificForm(context.containerIdActive ? 4 : 0)
                }}
                >
                <ListChecks width={50} height={50} />
                <p className="text-xs font-medium">Checkpoint</p>
                </div>
            )}
        </div>
      <div className="flex flex-col gap-4">
      <h3 className="text-2xl self-start font-semibold border-b inline py-2">
        Parties Detail
      </h3>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSave)}
          className=" grid grid-cols-12 gap-4"
        >
          {/* Shipper Name */}
          <FormField
            control={form.control}
            name="shipperName"
            render={({ field }) => (
              <FormItem className={"col-span-6"}>
                <FormLabel>Shipper Name *</FormLabel>
                <FormControl>
                  <Input placeholder="ex. PT. SARANA JAYA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Consignee Name */}
          <FormField
            control={form.control}
            name="consigneeName"
            render={({ field }) => (
              <FormItem className={"col-start-1 col-span-3"}>
                <FormLabel>Consignee Name *</FormLabel>
                <FormControl>
                  <Input placeholder="ex. PT. SARANA JAYA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Consignee NPWP */}
          <FormField
            control={form.control}
            name="consigneeNpwp"
            render={({ field }) => (
              <FormItem className={"col-span-3"}>
                <FormLabel>NPWP(consignee) *</FormLabel>
                <FormControl>
                <Input
                  type="number"
                  placeholder="ex. 12413414213141"
                  {...field}
                  onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value;
                    if (value.length > 16) {
                      e.target.value = value.slice(0, 16);
                    }
                  }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value;
                    if (value.length > 16) {
                      field.onChange(value.slice(0, 16));
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

          {/* notifyParty Name */}
          <FormField
            control={form.control}
            name="notifyPartyName"
            render={({ field }) => (
              <FormItem className={" col-span-3"}>
                <FormLabel>Notify party Name *</FormLabel>
                <FormControl>
                  <Input placeholder="ex. PT. SARANA JAYA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* notifyParty NPWP */}
          <FormField
            control={form.control}
            name="notifyPartyNpwp"
            render={({ field }) => (
              <FormItem className={"col-span-3"}>
                <FormLabel>NPWP(Notify Party)</FormLabel>
                <FormControl>
                <Input
                  type="number"
                  placeholder="ex. 12413414213141"
                  {...field}
                  onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value;
                    if (value.length > 16) {
                      e.target.value = value.slice(0, 16);
                    }
                  }}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const value = e.target.value;
                    if (value.length > 16) {
                      field.onChange(value.slice(0, 16));
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

          {/* Place of Loading */}
          <FormField
            control={form.control}
            name="placeOfLoading"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel>Place of loading *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        disabled={!!isDetailPage}
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <span className="line-clamp-1">
                          {field.value ? (
                            <>
                              {queryCountry.isSuccess &&
                                queryCountry.data.find(
                                  (item: any) => item.kode === field.value
                                )?.display}
                            </>
                          ) : (
                            "Select Place of loading"
                          )}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput placeholder="Search Place of loading..." />
                      <CommandEmpty>No Place of loading found.</CommandEmpty>
                      <CommandGroup className="max-h-[200px] overflow-y-auto">
                        {queryCountry.isSuccess &&
                          queryCountry.data.map((item: any, idx: number) => (
                            <CommandItem
                              value={item.display.replace(/[\r\n]/g, "")}
                              key={item.kode + idx}
                              onSelect={() => {
                                form.setValue("placeOfLoading", item.kode);
                                handleChangeCountry(item.kode);
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

          {/* Port of Loading */}
          <FormField
            control={form.control}
            name="portOfLoading"
            render={({ field }) => (
              <FormItem className={"col-span-3"}>
                <FormLabel>Port of Loading *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        disabled={!!isDetailPage}
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <span className="line-clamp-1">
                          {!!form.watch("portOfLoading") ? form.watch("portOfLoading") :
                            "Select port of loading"}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className=" p-0">
                    <Command>
                      <CommandInput
                        onValueChange={(key) => {
                          handleChangeKeyword(key);
                        }}
                        placeholder="Search port..."
                      />

                        <CommandGroup className="max-h-[200px] overflow-y-auto">
                          { tempPortsLoading.filter((item: any) => item.kode.toUpperCase().includes(keyword.toUpperCase()) || item.uraian.toUpperCase().includes(keyword.toUpperCase())).map((item: any, idx: number) => (
                              <CommandItem
                                value={item.display}
                                key={item.kode + idx}
                                onSelect={() => {
                                  form.setValue("portOfLoading", item.display);
                                  form.setValue("portOfLoadingCode", item.kode);
                                  handleChangeKeyword("");
                                }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  item.display === field.value
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

          {/* port of Discharge */}
          <FormField
            control={form.control}
            name="portOfDischarge"
            render={({ field }) => (
              <FormItem className={"col-span-3"}>
                <FormLabel>Place of Discharge *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        disabled={!!isDetailPage}
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <span className="line-clamp-1">
                          {!!form.watch("portOfDischarge") ? form.watch("portOfDischarge") :
                            "Select port of discharge"}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className=" p-0">
                    <Command>
                      <CommandInput
                        onValueChange={(key) => {
                          handleChangeKeyword(key);
                        }}
                        placeholder="Search port..."
                      />

                      <CommandGroup className="max-h-[200px] overflow-y-auto">
                        { tempPortsID.filter((item: any) => item.kode.toUpperCase().includes(keyword.toUpperCase()) || item.uraian.toUpperCase().includes(keyword.toUpperCase())).map((item: any, idx: number) => (
                            <CommandItem
                              value={item.display}
                              key={item.kode + idx}
                              onSelect={() => {
                                form.setValue("portOfDischarge", item.display);
                                form.setValue("portOfDischargeCode", item.kode);
                                handleChangeKeyword("");
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  item.display === field.value
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

          {/* port of Destination */}
          <FormField
            control={form.control}
            name="portOfDestination"
            render={({ field }) => (
              <FormItem className={"col-span-3"}>
                <FormLabel>Place of Destination *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        disabled={!!isDetailPage}
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        <span className="line-clamp-1">
                          {!!form.watch("portOfDestination") ? form.watch("portOfDestination") : 
                            "Select port of destination"}
                        </span>
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className=" p-0">
                    <Command>
                      <CommandInput
                        onValueChange={(key) => {
                          handleChangeKeyword(key);
                        }}
                        placeholder="Search port..."
                      />
                      <CommandGroup className="max-h-[200px] overflow-y-auto">
                        { tempPortsID.filter((item: any) => item.kode.toUpperCase().includes(keyword.toUpperCase()) || item.uraian.toUpperCase().includes(keyword.toUpperCase())).map((item: any, idx: number) => (
                            <CommandItem
                              value={item.display}
                              key={item.kode + idx}
                              onSelect={() => {
                                form.setValue(
                                  "portOfDestination",
                                  item.display
                                );
                                form.setValue(
                                  "portOfDestinationCode",
                                  item.kode
                                );
                                handleChangeKeyword("");
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  item.display === field.value
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

          <div className="col-span-12 flex justify-between">
            <Button className="flex gap-2" onClick={() => handlePrev(form.getValues())}>
              <ChevronLeft /> Back
            </Button>
            <div className="flex gap-4">
              {!isDetailPage && <Button type="submit" className="flex gap-2" variant={"outline"}>
                Save <Save />
              </Button>}
              <Button onClick={() => handleNext(form.getValues())} className="flex gap-2">
                Next <ChevronRight />
              </Button>
            </div>

          </div>
        </form>
      </Form>
    </div>
    </>
  );
};

export default PartiesDetail;