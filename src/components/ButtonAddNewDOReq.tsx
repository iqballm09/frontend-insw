"use client";

import React from "react";
import { Button } from "./ui/button";
import { Box, Container, Plus, PlusSquare } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { useAppState } from "@/provider/AppProvider";

const ButtonAddNewDOReq = () => {
  const context = useAppState();
  const handleReset = () => {
    context.handleResetForm();
    context.setRequestDetailForm(undefined);
    context.setPartiesDetailForm(undefined);
    context.setContainerItems([]);
    context.setPaymentItems([]);
    context.setSupportingDocument([]);
    context.setCargoItems([]);
    context.setVinItems([]);
  };
  return (
    <>
      {context.userInfo?.roleId == 1 && (
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={handleReset}>
              <PlusSquare className="mr-2" strokeWidth={2} /> Add DO Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="border-b pb-2 mb-2">DO Type</DialogTitle>
              <DialogDescription className="mb-2">
                Select DO Request Type.
              </DialogDescription>
              <div className="grid grid-cols-12 h-20 gap-2">
                <Link href={"/create?type=kontainer"} passHref legacyBehavior>
                  <a className="cursor-pointer hover:text-white hover:font-bold hover:bg-primary transition-all col-span-6 font-medium border rounded-sm flex justify-center items-center">
                    <Container className="mr-2" /> Container
                  </a>
                </Link>
                <Link
                  href={"/create?type=non-kontainer"}
                  passHref
                  legacyBehavior
                >
                  <a className="cursor-pointer hover:text-white hover:font-bold hover:bg-primary transition-all col-span-6 font-medium border rounded-sm flex justify-center items-center">
                    <Box className="mr-2" />
                    Non Container
                  </a>
                </Link>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default ButtonAddNewDOReq;
