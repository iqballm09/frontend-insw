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

const DeleteAllCargoItems = ({deleteAll}: {deleteAll: boolean}) => {
  const [isOpen, setOpen] = useState(deleteAll)
  const context = useAppState();
  const listId = getKeyByValue(context.listIdCargoItems, true)

  const handleDeleteAll = () => {
    const filtered = context.listIdCargoItems;
    listId.map((id) => {
      delete filtered[id]
    })
    context.setListIdCargoItems(filtered)

    context.setCargoItems((prev) => {
        let filtered = prev; 
        listId.forEach((id) => {
            filtered = filtered.filter((item) => item.Id !== id);
        });
        return filtered;
    });
    context.setDeleteAllStatus(false)
    toast.success("Selected Cargos have been deleted!");
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
            This action cannot be undone. This will delete your cargo items.
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

export default DeleteAllCargoItems;
