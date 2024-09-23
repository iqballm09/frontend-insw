import { useAppState } from "@/provider/AppProvider";
import { Container } from "@/utils/dummy-cargo-detail";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Trash } from "lucide-react";
import React from "react";
import { Payment } from "./Column-Payment";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "./ui/alert-dialog";
import { AlertDialogHeader, AlertDialogFooter } from "./ui/alert-dialog";
import { toast } from "sonner";

const DeleteItemPayment = ({ payment }: { payment: Payment }) => {
  const context = useAppState();
  const handleDelete = () => {
    context.setPaymentItems((prev) => {
      const filtered = prev.filter(
        (item) => item.invoiceNumber != payment.invoiceNumber
      );
      // console.log(filtered);

      return [...filtered];
    });
    toast.success("Payment has been deleted!");
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Trash
          className="cursor-pointer text-destructive"
          width={16}
          height={16}
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will delete your payment item.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteItemPayment;
