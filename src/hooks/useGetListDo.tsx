import { getListDo } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

const useGetListDo = () => {
  return useQuery({
    queryKey: ["list-do"],
    queryFn: () => getListDo(),
  });
};

export default useGetListDo;
