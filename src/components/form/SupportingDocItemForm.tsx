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
import { CalendarIcon, Edit, File, PlusSquare, XCircle } from "lucide-react";
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

import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { SupportingDocument } from "../Column-Supporting";
import SupportItemSchema from "@/validation/SupporttItemSchema";
import {
  documentTypeContainer,
  documentTypeNonContainer,
} from "@/utils/data-gw";
import { useSearchParams } from "next/navigation";
import useGetDocumentType from "@/hooks/useGetDocumentType";
import { uploadFile } from "@/utils/api";
import { useIsDetailPage } from "@/hooks/useIsDetailPage";

export function SupportDocItemForm({
  support,
}: {
  support?: SupportingDocument;
}) {
  const context = useAppState();
  const documentType =
    useSearchParams().get("type") == "kontainer"
      ? documentTypeContainer
      : documentTypeNonContainer;
  const [openCalDoc, setOpenCalDoc] = useState(false);
  const supportRef = useRef<HTMLInputElement | null>(null);
  const close = useRef<HTMLButtonElement>(null);
  const form = useForm<z.infer<typeof SupportItemSchema>>({
    resolver: zodResolver(SupportItemSchema),
    mode: "onChange",
    defaultValues: { ...support },
  });
  const isDetailPage = useIsDetailPage();

  const queryDocType = useGetDocumentType();

  useEffect(() => {
    const documentType = form.watch("documentType");

    if (documentType) {
      const docName = queryDocType.data.find(
        (item: any) => item.kode === documentType
      )?.uraian; // Optional chaining to avoid errors if item is not found

      console.log({ docName });

      form.setValue("documentName", docName);
    }
  }, [form, queryDocType.data, form.watch("documentType")]);

  function onSubmit(data: z.infer<typeof SupportItemSchema>) {
    form.reset();
    // form.setValue("bank", "");
    console.log("Supporting Item", data);
    if (close.current) {
      close.current.click();
    }

    if (support) {
      context.setSupportingDocument((prev) => {
        let searchId = support?.documentNumber;

        // Find the index of the object with the specified search element
        let indexOfObject = prev.findIndex(
          (obj) => obj.documentNumber === searchId
        );

        // Check if the object is found
        if (indexOfObject !== -1) {
          // Make changes to the found object
          prev[indexOfObject] = data as SupportingDocument;
        } else {
          console.log("Object not found");
        }
        return [...prev];
      });
      toast.success("Supporting Document has been edited!");
    } else {
      context.setSupportingDocument((prev) => [
        data as SupportingDocument,
        ...prev,
      ]);
      toast.success("Supporting Document has been added!");
    }
  }

  const handleButtonClickDocument = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    e.stopPropagation();
    supportRef?.current?.click();
  };

  const handleDiscardFile = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>,
    name: keyof z.infer<typeof SupportItemSchema>
  ) => {
    e.stopPropagation();
    form.setValue(name, "");
    form.setValue("urlDocument", "");
  };

  const handleUploadFile = async (
    file: File,
    type: "billing" | "requestor" | "document" | "payment"
  ) => {
    toast.promise(uploadFile(file, type), {
      loading: "Uploading...",
      success(url) {
        form.setValue("urlDocument", url.urlFile);

        return "Success upload file";
      },
      error: "Error upload file",
    });
  };

  return (
    <Dialog>
      {!support ? (
        <DialogTrigger asChild>
          {!isDetailPage && (
            <Button>
              <PlusSquare className="cursor-pointer mr-2" /> Add Supporting
              Document
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
          <DialogTitle>{!support ? "Tambah data" : "Edit data"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=" grid grid-cols-12 gap-4"
          >
            {/* Document type */}
            <FormField
              control={form.control}
              name="documentType"
              render={({ field }) => (
                <FormItem className={"col-span-full"}>
                  <FormLabel>Document Type *</FormLabel>
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
                      {queryDocType.isSuccess &&
                        queryDocType.data.map((doc: any, idx: number) => (
                          <SelectItem
                            value={doc.kode}
                            key={idx}
                            className="line-clamp-1"
                          >
                            {doc.display}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Document Number */}
            <FormField
              control={form.control}
              name="documentNumber"
              render={({ field }) => (
                <FormItem className={"col-span-full"}>
                  <FormLabel>Document No *</FormLabel>
                  <FormControl>
                    <Input placeholder="ex. DOC1234 " {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Document date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className={"col-span-full flex flex-col"}>
                  <FormLabel>Document Date *</FormLabel>
                  <Popover open={openCalDoc} onOpenChange={setOpenCalDoc}>
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
                          setOpenCalDoc(false);
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

            {/* Supporting Document */}
            <FormField
              control={form.control}
              name="document"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Supporting Document *</FormLabel>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      ref={supportRef}
                      onChange={(event) => {
                        onChange(event?.target.files?.[0]);
                        if (event?.target.files?.[0]) {
                          handleUploadFile(
                            event?.target.files?.[0],
                            "document"
                          );
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
                          form.watch("document")?.name || "Upload a File"
                        }
                        className="bg-white w-full placeholder:text-sm placeholder:font-normal placeholder:text-muted-foreground placeholder:line-clamp-1 cursor-pointer"
                        readOnly
                        onClick={handleButtonClickDocument}
                      />
                    </FormLabel>
                    <XCircle
                      size={20}
                      className={cn(
                        "cursor-pointer",
                        form.watch("document")?.name ? "" : "hidden"
                      )}
                      fill={"hsl(222.2 84% 4.9%)"}
                      color="white"
                      onClick={(e) => handleDiscardFile(e, "document")}
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