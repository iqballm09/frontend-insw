import { getBlType, getCountry, getListDo } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const useGetCountry = () => {
  return useQuery({
    queryKey: ["country"],
    queryFn: () => getCountry(),
  });
};

export default useGetCountry;
