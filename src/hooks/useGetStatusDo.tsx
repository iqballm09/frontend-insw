import { getBank, getBlType, getListDo, getStatuDo } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

const useGetStatusDo = (id: number) => {
  return useQuery({
    queryKey: ["status-do", id],
    queryFn: () => getStatuDo(id),
  });
};

export default useGetStatusDo;
