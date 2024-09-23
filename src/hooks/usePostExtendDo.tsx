import { extendDO } from "@/utils/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const useExtendDo = () => {
    const queryClient = useQueryClient()

    return useMutation({
      mutationKey: ["extend-do"],
      mutationFn: extendDO,
      onMutate: (variables) => {
        toast.loading("Processing...");
      },
      onError: () => {
        toast.error("Error when extending DO Release");
      },
      onSuccess: () => {
        window.setTimeout(() => {
          toast.success("Extend DO Release successfully");
          queryClient.invalidateQueries({
            queryKey: ["list-do"],
          });
        }, 4000)
      },
      
    })
}

export default useExtendDo;