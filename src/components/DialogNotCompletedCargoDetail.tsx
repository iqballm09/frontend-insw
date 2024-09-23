import { useState } from "react";
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
import { useAppState } from "@/provider/AppProvider";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { Button } from "./ui/button";

const DialogNotCompletedCargoDetail = () => {
    const listRequired = []
    const context = useAppState()
    const isContainer = context.isContainer;

    if (isContainer && !context.containerItems.length) {
        listRequired.push("Container Detail - Container Data");
    } 

    if (!isContainer && !context.cargoItems.length) {
        listRequired.push("Cargo Detail - Non Container Data");
    }

    if (!isContainer && !context.vinItems.length) {
        listRequired.push("Cargo Detail - VIN Data");
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="cursor-pointer" size={"sm"}>Show Detail</Button>
            </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Document Details are required!</AlertDialogTitle>
              <AlertDialogDescription>
                {listRequired.map((item, index) => (
                    <p key={index}><a style={{ fontWeight: 'bold' }}>{item.split(" - ")[0]}</a> : {item.split(" - ")[1]}</p>
                ))}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogAction>Back</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
}

export default DialogNotCompletedCargoDetail;