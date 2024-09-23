import { getBlType, getListDo, getSizeAndType } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

const useGetSizeAndType = () => {
  return useQuery({
    queryKey: ["sizeAndType"],
    queryFn: () => getSizeAndType(),
  });
};

export default useGetSizeAndType;
