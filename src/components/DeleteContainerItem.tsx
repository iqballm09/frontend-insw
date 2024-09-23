import { useAppState } from "@/provider/AppProvider";
import { Container } from "@/utils/dummy-cargo-detail";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Trash } from "lucide-react";
import React, { useEffect } from "react";
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
import { useIsDetailPage } from "@/hooks/useIsDetailPage";
import useDeleteContainer from "@/hooks/useDeleteContainer";

const DeleteContainerItem = ({ con }: { con: Container }) => {
  const isDetailPage = useIsDetailPage();
  const context = useAppState();
  const deleteContainer = useDeleteContainer();

  const handleDelete = async () => {
    const id = String(con.Id);
    if (id in context.listIdContainerItems && context.listIdContainerItems[id]) {
      const filtered = context.listIdContainerItems;
      delete filtered[id]
      context.setListIdContainerItems(filtered)
    }

    if (!!+id) {
      await deleteContainer.mutateAsync(+id);
    }

    context.setContainerItems((prev) => {
      const filtered = prev.filter((item) => item.Id !== con.Id);
      return [...filtered];
    });

    toast.success("Container has been deleted!");
  };

  return (
    <AlertDialog>
      {!isDetailPage && (
        <AlertDialogTrigger asChild>
          <Trash
            className="cursor-pointer text-destructive"
            width={16}
            height={16}
          />
        </AlertDialogTrigger>
      )}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will delete your container item.
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

export default DeleteContainerItem;