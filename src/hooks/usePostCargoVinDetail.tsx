import { useAppState } from "@/provider/AppProvider"
import { createCargoVinDetail } from "@/utils/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const usePostCargoVinDetail = () => {
    const queryClient = useQueryClient()
    const context = useAppState()

    return useMutation({
        mutationFn: createCargoVinDetail,
        mutationKey: ["create-cargovin-detail"],
        onError: (error) => {
            console.log(error)
            toast.error("Failed Save Cargo and VIN Detail Data")
        },
        onMutate: () => {
            toast.loading("Loading...")
        },
        onSuccess: (response) => {
            toast.success("Successfully Save Cargo and VIN Detail Data")
            queryClient.invalidateQueries({
                queryKey: ["get-cargovin-detail", context.containerIdActive]
            })
        }
    })
}

export default usePostCargoVinDetail;