import { useAppState } from "@/provider/AppProvider";
import React, { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { toast } from "sonner";
import useDeleteContainer from "@/hooks/useDeleteContainer";

export function getKeyByValue(object: any, value: any) {
    let listKey = []
    for (let prop in object) {
        if (object.hasOwnProperty(prop)) {
            if (object[prop] === value)
                listKey.push(prop);
        }
    }
    return listKey
}

const DeleteAllContainerItems = ({deleteAll}: {deleteAll: boolean}) => {
  const [isOpen, setOpen] = useState(deleteAll)
  const context = useAppState();
  const deleteContainer = useDeleteContainer();
  const listId = getKeyByValue(context.listIdContainerItems, true)

  const handleDeleteAll = () => {
    const filtered = context.listIdContainerItems;
    listId.map(async (id) => {
      if (!!+id) {
        await deleteContainer.mutateAsync(+id)
      }
      delete filtered[id]
    })
    context.setListIdContainerItems(filtered)

    context.setContainerItems((prev) => {
        let filtered = prev; 
        listId.forEach((id) => {
            filtered = filtered.filter((item) => item.Id !== id);
        });
        return filtered;
    });
    context.setDeleteAllStatus(false)
    toast.success("Selected Containers have been deleted!");
  }

  const handleCancel = () => {
    context.setDeleteAllStatus(false)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will delete your container items.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteAll}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAllContainerItems;