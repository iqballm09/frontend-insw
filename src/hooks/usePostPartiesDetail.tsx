import { useAppState } from "@/provider/AppProvider";
import { createRequestPartiesDetail } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";

const usePostPartiesDetail = () => {
    const queryClient = useQueryClient();
    const context = useAppState()

    return useMutation({
        mutationFn: createRequestPartiesDetail,
        mutationKey: ["create-parties-detail"],
        onError: (error) => {
            console.log(error)
            toast.error("Failed Save Parties Detail Data")
        },
        onMutate: () => {
            toast.loading("Loading...")
        },
        onSuccess: (response) => {
            toast.success("Successfully Save Parties Detail Data")
            queryClient.invalidateQueries({
                queryKey: ["get-parties-detail", response.id]
            })
        }
    })
}

export default usePostPartiesDetail;