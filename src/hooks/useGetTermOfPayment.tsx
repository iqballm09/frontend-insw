import { getBlType, getListDo, getTermOfPayment } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

const useGetTermOfPayment = () => {
  return useQuery({
    queryKey: ["termOfPayment"],
    queryFn: () => getTermOfPayment(),
  });
};

export default useGetTermOfPayment;
