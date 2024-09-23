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
import ContainerItemSchema, {
  ContainerItemSchemaForSl,
} from "@/validation/ContainerItemSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  ChevronsUpDown,
  Edit,
  PlusSquare,
  StampIcon,
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
import { Container } from "@/utils/dummy-cargo-detail";
import { useAppState } from "@/provider/AppProvider";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { Badge } from "../ui/badge";
import useGetSizeAndType from "@/hooks/useGetSizeAndType";
import useGetOwnership from "@/hooks/useGetOwnership";
import useGetGrossWeightUnit from "@/hooks/useGetUnit";
import { useIsDetailPage } from "@/hooks/useIsDetailPage";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { cn } from "@/lib/utils";
import useGetKabKota from "@/hooks/useGetKabKota";
import { v4 as uuidv4 } from "uuid";

function removeEmptyFields(data: any) {
  Object.keys(data).forEach((key) => {
    if (data[key] === "" || data[key] == null) {
      delete data[key];
    }
  });
}

export function ContainerItemForm({ container }: { container?: Container }) {
  const [inputValue, setInputValue] = useState("");
  const [containerSchema, setContainerSchema] =
    useState<any>(ContainerItemSchema);
  const [tag, setTag] = useState<string[]>(container?.sealNumber || []);
  if (container) {
    removeEmptyFields(container);
  }
  const context = useAppState();
  const isDetailPage = useIsDetailPage();
  const close = useRef<HTMLButtonElement>(null);
  const form = useForm<z.infer<typeof containerSchema>>({
    resolver: zodResolver(containerSchema),
    defaultValues: { ...container },
    mode: "onChange",
  });
  const querySizeType = useGetSizeAndType();
  const queryUnit = useGetGrossWeightUnit();
  const queryOwnership = useGetOwnership();
  const queryKabKota = useGetKabKota();

  useEffect(() => {
    console.log({ roleId: context.userInfo?.roleId });
    if (context.userInfo?.roleId == 2) {
      console.log("change schema");
      setContainerSchema(ContainerItemSchemaForSl);
    }
  }, [context.userInfo?.roleId]);

  useEffect(() => {
    if (tag.length > 0) {
      form.clearErrors("sealNumber");
      form.setValue("sealNumber", tag);
    } else {
      form.resetField("sealNumber");
    }
  }, [form, tag]);

  function onSubmit(data: z.infer<typeof containerSchema>) {
    if (!!!+data.Id) {
      data.Id = uuidv4();
    }

    console.log("Container Item", data);
    if (container) {
      context.setContainerItems((prev) => {
        // Search element
        let searchId = container.Id;

        // Find the index of the object with the specified search element
        let indexOfObject = prev.findIndex((obj) => obj.Id === searchId);

        // Check if the object is found
        if (indexOfObject !== -1) {
          // Make changes to the found object
          prev[indexOfObject] = data;
        } else {
          console.log("Object not found");
        }
        return [...prev];
      });

      if (close.current) {
        close.current.click();
      }
      toast.success("Container has been Edited!");
    } else {
      context.setContainerItems((prev) => [data, ...prev]);
      if (close.current) {
        close.current.click();
      }
      toast.success("Container has been added");
    }
  }

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      const newTag = inputValue.trim();
      console.log({ newTag });

      if (newTag == "") {
        return;
      }
      setTag((prev: any) => [...prev, newTag]);
      setInputValue("");
    }
  };

  const handleTagRemove = (tagToRemove: any) => {
    setTag([...tag.filter((tag) => tag !== tagToRemove)]);
  };

  const readOnlyStyle = `read-only:opacity-50 read-only:cursor-not-allowed read-only:ring-0 read-only:outline-none read-only:focus:outline-none read-only:focus:ring-0`;
  const labelStyle = context.isShippingLineProcessing
    ? `opacity-50 cursor-not-allowed ring-0 outline-none focus:outline-none focus:ring-0`
    : "";

  return (
    <>
      <Dialog>
        {!container ? (
          <DialogTrigger asChild>
            {!isDetailPage && (
              <Button
                onClick={() => {
                  setTag([]);
                  form.reset();
                }}
              >
                <PlusSquare className="cursor-pointer mr-2" /> Add Container
              </Button>
            )}
          </DialogTrigger>
        ) : context.isShippingLineProcessing ? (
          <DialogTrigger asChild>
            <Button title="Edit Depo" variant={"outline"}>
              <StampIcon
                className="w-5 h-5"
                color={
                  form.getValues("depoName") && form.getValues("noTelp")
                    ? "green"
                    : "black"
                }
              />
            </Button>
          </DialogTrigger>
        ) : (
          <DialogTrigger asChild>
            <Edit
              onClick={() => console.log({ container })}
              className="text-primary cursor-pointer"
              width={16}
              height={16}
            />
          </DialogTrigger>
        )}
        <DialogContent
          className={context.isShippingLineProcessing ? "max-w-screen-lg" : ""}
        >
          <DialogHeader className="border-b pb-4">
            <DialogTitle>{container ? "Edit data" : "Add data"}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className=" grid grid-cols-12 gap-4"
            >
              {context.isShippingLineProcessing && (
                <div className="col-span-6 space-y-4">
                  {/* depo name */}
                  <FormField
                    control={form.control}
                    name="depoName"
                    render={({ field }) => (
                      <FormItem className={"col-span-full"}>
                        <FormLabel>Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="ex. PT. MITRA JAYA" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* depo npwp */}
                  <FormField
                    control={form.control}
                    name="depoNpwp"
                    render={({ field }) => (
                      <FormItem className={"col-span-full"}>
                        <FormLabel>NPWP</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="ex. 12413414213141"
                            {...field}
                            onInput={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              const value = e.target.value;
                              if (value.length > 16) {
                                e.target.value = value.slice(0, 16);
                              }
                            }}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
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
                  {/* depo no telp */}
                  <FormField
                    control={form.control}
                    name="noTelp"
                    render={({ field }) => (
                      <FormItem className={"col-span-full"}>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="ex. 628314141515"
                            {...field}
                            onInput={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              const value = e.target.value;
                              e.target.value = value.replace(/[^0-9]/g, "");
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* depo alamat */}
                  <FormField
                    control={form.control}
                    name="alamat"
                    render={({ field }) => (
                      <FormItem className={"col-span-full"}>
                        <FormLabel>Address</FormLabel>
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

                  {/* depo kota */}
                  <FormField
                    control={form.control}
                    name="kotaDepo"
                    render={({ field }) => (
                      <FormItem className={"col-span-full"}>
                        <FormLabel>City</FormLabel>
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
                                    {queryKabKota.isSuccess &&
                                      queryKabKota.data.find(
                                        (item: any) =>
                                          item.kode ===
                                          field.value.split("-")[0].trim()
                                      )?.display}
                                  </>
                                ) : (
                                  "Please Select"
                                )}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder="Search City..." />
                              <CommandEmpty>No City found.</CommandEmpty>
                              <CommandGroup className="max-h-[200px] overflow-y-auto">
                                {queryKabKota.isSuccess &&
                                  queryKabKota.data.map(
                                    (item: any, idx: number) => (
                                      <CommandItem
                                        value={item.display.replace(
                                          /[\r\n]/g,
                                          ""
                                        )}
                                        key={item.kode + idx}
                                        onSelect={() => {
                                          form.setValue(
                                            "kotaDepo",
                                            item.display
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
                                    )
                                  )}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* kode pos*/}
                  <FormField
                    control={form.control}
                    name="kodePos"
                    render={({ field }) => (
                      <FormItem className={"col-span-full"}>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input placeholder="ex. 29710" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div
                className={`gap-4 grid grid-cols-12 ${
                  context.isShippingLineProcessing
                    ? "col-span-6"
                    : "col-span-full "
                }`}
              >
                {/* Container Number */}
                <FormField
                  control={form.control}
                  name="containerNumber"
                  render={({ field }) => (
                    <FormItem className={"col-span-full"}>
                      <FormLabel>Container No *</FormLabel>
                      <FormControl>
                        <Input placeholder="ex. MKSU 123123 " {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Seal Number */}
                <FormField
                  control={form.control}
                  name="sealNumber"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem className={"col-span-full"}>
                      <FormLabel className={labelStyle}>Seal No *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Type Enter or Tab to separate"
                          {...fieldProps}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          value={inputValue}
                          readOnly={[
                            "Submitted",
                            "Processed",
                            "Released",
                          ].includes(context.statusCurrentDO)}
                          className={readOnlyStyle}
                        />
                      </FormControl>
                      <FormMessage />
                      <div className="space-x-1">
                        {tag.map((val, key) => (
                          <Badge key={key} className="hover:bg-primary">
                            {val}
                            <XCircle
                              onClick={() => {
                                if (context.isShippingLineProcessing) {
                                  return;
                                }
                                handleTagRemove(val);
                              }}
                              className={cn(
                                "w-4 h-4 ml-2",
                                context.isShippingLineProcessing
                                  ? "cursor-not-allowed"
                                  : "cursor-pointer"
                              )}
                            />
                          </Badge>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />

                {/* Size and Type*/}
                <FormField
                  control={form.control}
                  name="sizeAndType"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Size and Type *</FormLabel>
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
                                  {querySizeType.isSuccess &&
                                    querySizeType.data.find(
                                      (item: any) =>
                                        item.kd_size === field.value
                                    )?.display}
                                </>
                              ) : (
                                "Please Select"
                              )}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search Size and Type..." />
                            <CommandEmpty>No Size and Type found.</CommandEmpty>
                            <CommandGroup className="max-h-[200px] overflow-y-auto">
                              {querySizeType.isSuccess &&
                                querySizeType.data.map(
                                  (item: any, idx: number) => (
                                    <CommandItem
                                      value={item.display.replace(
                                        /[\r\n]/g,
                                        ""
                                      )}
                                      key={item.kd_size + idx}
                                      onSelect={() => {
                                        form.setValue(
                                          "sizeAndType",
                                          item.kd_size
                                        );
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          item.kd_size === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {item.display}
                                    </CommandItem>
                                  )
                                )}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Gross Weight*/}
                <FormField
                  control={form.control}
                  name="grossWeight"
                  render={({ field }) => (
                    <FormItem className={"col-span-6"}>
                      <FormLabel className={labelStyle}>
                        Gross Weight *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="ex. 1000.01"
                          step={"any"}
                          readOnly={context.isShippingLineProcessing}
                          className={readOnlyStyle}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Unit*/}
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem className={"col-span-6"}>
                      <FormLabel className={labelStyle}>Unit *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isDetailPage}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Please Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {queryUnit.isSuccess &&
                            queryUnit.data.map((unit: any, idx: number) => (
                              <SelectItem
                                value={unit.kode}
                                key={idx}
                                className="line-clamp-1"
                              >
                                {unit.display}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Ownership*/}
                <FormField
                  control={form.control}
                  name="ownership"
                  render={({ field }) => (
                    <FormItem className={"col-span-full"}>
                      <FormLabel className={labelStyle}>Ownership *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isDetailPage}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Please Select" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {queryOwnership.isSuccess &&
                            queryOwnership.data.map(
                              (unit: any, idx: number) => (
                                <SelectItem
                                  value={unit.uraian}
                                  key={idx}
                                  className="line-clamp-1"
                                >
                                  {unit.display}
                                </SelectItem>
                              )
                            )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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
    </>
  );
}
