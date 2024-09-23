import { getDetailDO } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const useGetDetailDo = (id: number) => {
  return useQuery({
    queryKey: ["do", id],
    queryFn: () => getDetailDO(id),
  });
};

export default useGetDetailDo;
