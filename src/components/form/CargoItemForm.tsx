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
import CargoDetailSchema from "@/validation/CargoDetailSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, PlusSquare } from "lucide-react";
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
import { Cargo } from "@/utils/dummy-cargo-detail";
import { useAppState } from "@/provider/AppProvider";
import { useRef } from "react";
import useGetPackageUnit from "@/hooks/useGetPackageUnit";
import useGetGrossWeightUnit from "@/hooks/useGetUnit";
import useGetMeasurementUnit from "@/hooks/useGetMeasurementUnit";
import { useIsDetailPage } from "@/hooks/useIsDetailPage";
import { v4 as uuidv4 } from "uuid";

export function CargoItemForm({ cargo }: { cargo?: Cargo }) {
  const context = useAppState();
  const close = useRef<HTMLButtonElement>(null);
  const form = useForm<z.infer<typeof CargoDetailSchema>>({
    resolver: zodResolver(CargoDetailSchema),
    defaultValues: { ...cargo },
  });

  const queryPackage = useGetPackageUnit();
  const queryGross = useGetGrossWeightUnit();
  const queryMeasurement = useGetMeasurementUnit();
  const isDetailPage = useIsDetailPage();

  context.setIsCargoPage(true)

  function onSubmit(data: z.infer<typeof CargoDetailSchema>) {
    data.Id = uuidv4();

    console.log("Cargo Item", data);

    if (cargo) {
      context.setCargoItems((prev) => {
        // Search element
        let searchId = cargo.Id;

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
      toast.success("Cargo has been Edited!");
    } else {
      context.setCargoItems((prev) => [data, ...prev]);
      if (close.current) {
        close.current.click();
      }
      toast.success("Cargo has been added");
    }
  }

  return (
    <Dialog>
      {!cargo ? (
        <DialogTrigger asChild>
          {!isDetailPage && (
            <Button
              onClick={() => {
                form.reset();
              }}
            >
              <PlusSquare className="cursor-pointer mr-2" /> Add Cargo
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
        <DialogTitle>{cargo ? "Edit data" : "Add data"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-12 gap-4"
          >
            {/* desc of goods */}
            <FormField
              control={form.control}
              name="descriptionOfGoods"
              render={({ field }) => (
                <FormItem className={"col-span-full"}>
                  <FormLabel>Description of Goods *</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      placeholder="Max. 1024 characters"
                      maxLength={1024}
                      rows={5}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    ></textarea>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* package quantity */}
            <FormField
              control={form.control}
              name="packageQuantity"
              render={({ field }) => (
                <FormItem className={"col-span-6"}>
                  <FormLabel>Package Quantity *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step={0.01}
                      placeholder="ex. 100"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* package satuan */}
            <FormField
              control={form.control}
              name="packageSatuan"
              render={({ field }) => (
                <FormItem className={"col-span-6"}>
                  <FormLabel>Package Unit *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select package unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {queryPackage.isSuccess &&
                        queryPackage.data.map((shp: any, idx: number) => (
                          <SelectItem
                            value={shp.kode}
                            key={idx}
                            className="line-clamp-1"
                          >{`${shp.display}`}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* gross quantity */}
            <FormField
              control={form.control}
              name="grossQuantity"
              render={({ field }) => (
                <FormItem className={"col-span-6"}>
                  <FormLabel>Gross Weight Quantity *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="ex. 100.1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* gross satuan */}
            <FormField
              control={form.control}
              name="grossSatuan"
              render={({ field }) => (
                <FormItem className={"col-span-6"}>
                  <FormLabel>Gross Weight Unit *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gross weight unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {queryGross.isSuccess &&
                        queryGross.data.map((shp: any, idx: number) => (
                          <SelectItem
                            value={shp.kode}
                            key={idx}
                            className="line-clamp-1"
                          >{`${shp.display}`}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* measurement quantity */}
            <FormField
              control={form.control}
              name="measurementQuantity"
              render={({ field }) => (
                <FormItem className={"col-span-6"}>
                  <FormLabel>Measurement Quantity *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="ex. 100.1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* measeurement satuan */}
            <FormField
              control={form.control}
              name="measurementSatuan"
              render={({ field }) => (
                <FormItem className={"col-span-6"}>
                  <FormLabel>Measurement Unit *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select measurement unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {queryMeasurement.isSuccess &&
                        queryMeasurement.data.map((shp: any, idx: number) => (
                          <SelectItem
                            value={shp.kode}
                            key={idx}
                            className="line-clamp-1"
                          >{`${shp.display}`}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
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
