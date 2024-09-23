import { deleteContainerDetail } from "@/utils/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const useDeleteContainer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ["delete-container"],
        mutationFn: deleteContainerDetail,
        onMutate(variables) {
            toast.loading("Deleting...");
        },
        onError: () => {
            toast.error("Error when deleting container!")
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["get-container-detail"]
            })
        }
    })
}

export default useDeleteContainer;