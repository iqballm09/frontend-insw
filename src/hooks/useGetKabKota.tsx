import { getKabKota } from "@/utils/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";

const useGetKabKota = () => {
  return useQuery({
    queryKey: ["kabkota"],
    queryFn: getKabKota,
  });
};

export default useGetKabKota;
