import { getBank, getBlType, getListDo, getPackageUnit } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

const useGetPackageUnit = () => {
  return useQuery({
    queryKey: ["pkgUnit"],
    queryFn: () => getPackageUnit(),
  });
};

export default useGetPackageUnit;
