import { useAppState } from "@/provider/AppProvider";
import { createRequestDetail } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const usePostRequestDetail = () => {
  const queryClient = useQueryClient();
  const context = useAppState();
  const router = useRouter();
  return useMutation({
    mutationFn: createRequestDetail,
    mutationKey: ["create-request-detail"],
    onError: (error) => {
      console.log({ error });
      toast.error("Failed Save Request Detail Data");
    },
    onMutate: () => {
      toast.loading("Loading...");
    },
    onSuccess: (response) => {
      toast.success("Succesfully Save Request Detail Data");
      router.replace(`do/edit/${response.id}?type=${response.request_type === 1 ? "kontainer" : "non-kontainer"}`)
    },
  });
};

export default usePostRequestDetail;