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
import { toast } from "sonner";
import { useAppState } from "@/provider/AppProvider";
import { useRef } from "react";
import VinSchema from "@/validation/VinSchema";
import { useIsDetailPage } from "@/hooks/useIsDetailPage";
import { Vin } from "../Column-Vin0";
import { v4 as uuidv4 } from "uuid";

export function VinItemForm({ vin }: { vin?: Vin }) {
  const context = useAppState();
  const close = useRef<HTMLButtonElement>(null);
  const isDetailPage = useIsDetailPage();
  const form = useForm<z.infer<typeof VinSchema>>({
    resolver: zodResolver(VinSchema),
    defaultValues: { ...vin },
  });

  context.setIsCargoPage(false)

  function onSubmit(data: z.infer<typeof VinSchema>) {
    form.reset()
    data.Id = uuidv4();
    console.log("Vin Item", data);

    if (vin) {
      context.setVinItems((prev) => {
        // Search element
        let searchId = vin.Id;

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
      toast.success("Vin item has been Edited!");
    } else {
      context.setVinItems((prev) => [data, ...prev]);
      if (close.current) {
        close.current.click();
      }
      toast.success("Vin item has been added");
    }
  }

  return (
    <Dialog>
      {!vin ? (
        <DialogTrigger asChild>
          {!isDetailPage && (
            <Button>
              <PlusSquare className="cursor-pointer mr-2" /> Add VIN
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
        <DialogTitle>{vin ? "Edit data" : "Add data"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=" grid grid-cols-12 gap-4"
          >
            {/* vin number */}
            <FormField
              control={form.control}
              name="vinNumber"
              render={({ field }) => (
                <FormItem className={"col-span-full"}>
                  <FormLabel>VIN Number *</FormLabel>
                  <FormControl>
                    <Input placeholder="ex. VIN123" {...field} />
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
  );
}