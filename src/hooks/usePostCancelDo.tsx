import { useAppState } from "@/provider/AppProvider"
import { cancelDO } from "@/utils/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const useCancelDo = () => {
    const queryClient = useQueryClient()

    return useMutation({
      mutationKey: ["cancel-do"],
      mutationFn: cancelDO,
      onMutate: (variables) => {
        toast.loading("Canceling...");
      },
      onError: () => {
        toast.error("Error when canceling DO Release");
      },
      onSuccess: () => {
        window.setTimeout(() => {
          toast.success("Cancel DO Release successfully");
          queryClient.invalidateQueries({
            queryKey: ["list-do"],
          });
        }, 4000)
      },
    })
}

export default useCancelDo;