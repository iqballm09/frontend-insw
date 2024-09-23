import { getBlType, getListDo, getOwnership } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

const useGetOwnership = () => {
  return useQuery({
    queryKey: ["ownership"],
    queryFn: () => getOwnership(),
  });
};

export default useGetOwnership;
