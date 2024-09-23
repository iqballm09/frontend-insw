import { useAppState } from "@/provider/AppProvider";
import { Cargo, Container } from "@/utils/dummy-cargo-detail";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Trash } from "lucide-react";
import React from "react";
import { DialogHeader } from "./ui/dialog";
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
import { toast } from "sonner";

const DeleteCargoItem = ({ con }: { con: Cargo }) => {
  const context = useAppState();

  const handleDelete = () => {
    const id = String(con.Id)
    if (id in context.listIdCargoItems && context.listIdCargoItems[id]) {
      const filtered = context.listIdCargoItems;
      delete filtered[id]
      context.setListIdCargoItems(filtered)
    }

    context.setCargoItems((prev) => {
      const filtered = prev.filter((item) => item.Id !== con.Id);
      return [...filtered];
    });

    toast.success("Cargo item has been deleted!");
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
            This action cannot be undone. This will delete your cargo item.
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

export default DeleteCargoItem;
