import { getBank, getBlType, getDocumentType, getListDo } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

const useGetDocumentType = () => {
  return useQuery({
    queryKey: ["documentType"],
    queryFn: () => getDocumentType(),
  });
};

export default useGetDocumentType;
