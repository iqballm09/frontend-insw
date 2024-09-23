import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  Edit,
  File,
  PlusSquare,
  XCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { useAppState } from "@/provider/AppProvider";
import { useEffect, useRef, useState } from "react";
import PaymentItemSchema from "@/validation/PaymentItemSchema";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { Payment } from "../Column-Payment";
import useGetBank from "@/hooks/useGetBank";
import useGetCurrency from "@/hooks/useGetCurrency";
import { uploadFile } from "@/utils/api";
import { useIsDetailPage } from "@/hooks/useIsDetailPage";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";

export function PaymentItemForm({ payment }: { payment?: Payment }) {
  const context = useAppState();
  const [hideAccountNumber, setHideAccountNumber] = useState(true);
  const [openCalPay, setOpenCalPay] = useState(false);
  const paymentReceiptRef = useRef<HTMLInputElement | null>(null);
  const close = useRef<HTMLButtonElement>(null);
  const form = useForm<z.infer<typeof PaymentItemSchema>>({
    resolver: zodResolver(PaymentItemSchema),
    mode: "onChange",
    defaultValues: { ...payment },
  });
  const isDetailPage = useIsDetailPage();

  const queryBank = useGetBank();
  const queryCurrency = useGetCurrency();

  useEffect(() => {
    if (form.watch("bank")) {
      if (form.watch("bank") == "000") {
        setHideAccountNumber(true);
        form.setValue("accountNumber", "");
      } else {
        setHideAccountNumber(false);
      }
      const bankName = queryBank.data.find(
        (item: any) => item.kode == form.watch("bank")
      ).uraian;
      form.setValue("bankName", bankName);
    }
  }, [form.watch("bank")]);

  function onSubmit(data: z.infer<typeof PaymentItemSchema>) {
    form.reset();
    // form.setValue("bank", "")
    console.log("Payment Item", data);
    if (close.current) {
      close.current.click();
    }

    if (payment) {
      context.setPaymentItems((prev) => {
        let searchId = payment?.invoiceNumber;

        // Find the index of the object with the specified search element
        let indexOfObject = prev.findIndex(
          (obj) => obj.invoiceNumber === searchId
        );

        // Check if the object is found
        if (indexOfObject !== -1) {
          // Make changes to the found object
          prev[indexOfObject] = data as Payment;
        } else {
          console.log("Object not found");
        }
        return [...prev];
      });
      toast.success("Payment has been edited!");
    } else {
      context.setPaymentItems((prev) => [data as Payment, ...prev]);
      toast.success("Payment has been added!");
    }
  }

  const handleButtonClickPaymentReceipt = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    e.stopPropagation();
    paymentReceiptRef?.current?.click();
  };

  const handleDiscardFile = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    name: keyof z.infer<typeof PaymentItemSchema>
  ) => {
    e.stopPropagation();
    form.setValue(name, "");
    form.setValue("urlPayment", "");
  };

  const handleUploadFile = async (
    file: File,
    type: "billing" | "requestor" | "document" | "payment"
  ) => {
    toast.promise(uploadFile(file, type), {
      loading: "Uploading...",
      success(url) {
        console.log("paymentUrl", url);
        form.setValue("urlPayment", url.urlFile);

        return "Success upload file";
      },
      error: () => {
        form.resetField("urlPayment");
        form.resetField("paymentReceipt");
        return "Error upload file";
      },
    });
  };

  return (
    <Dialog>
      {!payment ? (
        <DialogTrigger asChild>
          {!isDetailPage && (
            <Button
              onClick={() => {
                form.reset();
              }}
            >
              <PlusSquare className="cursor-pointer mr-2" /> Add Payment
            </Button>
          )}
        </DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Edit
            className="text-primary cursor-pointer"
            width={16}
            height={16}
          />
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="border-b pb-4">
          <DialogTitle>Tambah data</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=" grid grid-cols-12 gap-4"
          >
            {/* Invoice Number */}
            <FormField
              control={form.control}
              name="invoiceNumber"
              render={({ field }) => (
                <FormItem className={"col-span-full"}>
                  <FormLabel>Invoice No *</FormLabel>
                  <FormControl>
                    <Input placeholder="ex. INV123123 " {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Invoice Date */}
            <FormField
              control={form.control}
              name="invoiceDate"
              render={({ field }) => (
                <FormItem className={"col-span-full flex flex-col"}>
                  <FormLabel>Invoice Date *</FormLabel>
                  <Popover open={openCalPay} onOpenChange={setOpenCalPay}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            " pl-3 text-left font-normal text-black",
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
                        selected={new Date(field.value)}
                        onSelect={(date) => {
                          field.onChange(date);
                          setOpenCalPay(false);
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

            {/* Currency */}
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Currency *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            <>
                              {queryCurrency.isSuccess &&
                                queryCurrency.data.find(
                                  (item: any) => item.kode === field.value
                                )?.display}
                            </>
                          ) : (
                            "Select Currency"
                          )}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search Currency..." />
                        <CommandEmpty>No Currency found.</CommandEmpty>
                        <CommandGroup className="max-h-[200px] overflow-y-auto">
                          {queryCurrency.isSuccess &&
                            queryCurrency.data.map((item: any, idx: number) => (
                              <CommandItem
                                value={item.display.replace(/[\r\n]/g, "")}
                                key={item.kode + idx}
                                onSelect={() => {
                                  form.setValue("currency", item.kode);
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

            {/* Total Payment */}
            <FormField
              control={form.control}
              name="totalPayment"
              render={({ field }) => (
                <FormItem className={"col-span-6"}>
                  <FormLabel>Total Payment *</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="ex. 100000 " {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bank */}
            <FormField
              control={form.control}
              name="bank"
              render={({ field }) => (
                <FormItem className="col-span-6">
                  <FormLabel>Bank *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            <>
                              {queryBank.isSuccess &&
                                queryBank.data.find(
                                  (item: any) => item.kode === field.value
                                )?.display}
                            </>
                          ) : (
                            "Select Bank"
                          )}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="bg-pink-200 p-0">
                      <Command>
                        <CommandInput placeholder="Search Bank..." />
                        <CommandEmpty>No Bank found.</CommandEmpty>
                        <CommandGroup className="max-h-[200px] overflow-y-auto">
                          {queryBank.isSuccess &&
                            queryBank.data.map((item: any, idx: number) => (
                              <CommandItem
                                value={item.display.replace(/[\r\n]/g, "")}
                                key={item.kode + idx}
                                onSelect={() => {
                                  form.setValue("bank", item.kode);
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

            {/* Account Number */}
            {!hideAccountNumber && (
              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem className={"col-span-full"}>
                    <FormLabel>Account Number *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="ex. 412419132 "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Payment Receipt */}
            <FormField
              control={form.control}
              name="paymentReceipt"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Payment Receipt *</FormLabel>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      ref={paymentReceiptRef}
                      onChange={(event) => {
                        onChange(event?.target.files?.[0]);
                        if (event?.target.files?.[0]) {
                          handleUploadFile(event?.target.files?.[0], "payment");
                        }
                      }}
                      type="file"
                      className="bg-primary text-white cursor-pointer hidden w-0"
                    />
                  </FormControl>
                  <div className="flex gap-2 items-center relative w-full">
                    <FormLabel>
                      <File className="text-muted-foreground" />
                    </FormLabel>
                    <FormLabel className="flex-1">
                      <Input
                        type="text"
                        placeholder={
                          form.watch("paymentReceipt")?.name || "Upload a File"
                        }
                        className="bg-white w-full placeholder:text-sm placeholder:font-normal placeholder:text-muted-foreground placeholder:line-clamp-1 cursor-pointer"
                        readOnly
                        onClick={(e) => {
                          if (form.watch("paymentReceipt")?.name) {
                            return;
                          }
                          handleButtonClickPaymentReceipt(e);
                        }}
                      />
                    </FormLabel>
                    <XCircle
                      size={20}
                      className={cn(
                        "cursor-pointer",
                        form.watch("paymentReceipt")?.name ? "" : "hidden"
                      )}
                      fill={"hsl(222.2 84% 4.9%)"}
                      color="white"
                      onClick={(e) => handleDiscardFile(e, "paymentReceipt")}
                    />
                  </div>
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
  );
}