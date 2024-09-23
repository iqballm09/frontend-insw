import { useAppState } from "@/provider/AppProvider";
import { getBank, getBlType, getListDo, slProcessDo } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const usePutSlProcessDo = (id: number) => {
  const context = useAppState();
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: slProcessDo,
    onError: (error) => {
      console.log({ error });
      toast.error("Failed Process DO Request");
    },
    onMutate: () => {
      toast.loading("Loading...");
    },
    onSuccess() {
      window.setTimeout(() => {
        toast.success("Processed DO Request!");

        queryClient.invalidateQueries({
          queryKey: ["list-do"],
        });
        queryClient.invalidateQueries({
          queryKey: ["do", id],
        });
        router.push(`do/${id}`)
      }, 4000)
    },
  });
};

export default usePutSlProcessDo;
