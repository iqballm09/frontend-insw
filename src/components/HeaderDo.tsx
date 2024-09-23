"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import { useAppState } from "@/provider/AppProvider";

const HeaderDo = () => {
  const { isContainer } = useAppState();
  return (
    <h1>Create DO Request | {isContainer ? "Container" : "Non Container"}</h1>
  );
};

export default HeaderDo;
