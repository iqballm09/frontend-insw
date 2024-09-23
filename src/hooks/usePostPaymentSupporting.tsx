import { useAppState } from "@/provider/AppProvider"
import { createPaymentDocumentDetail } from "@/utils/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const usePostPaymentSupporting = () => {
    const queryClient = useQueryClient()
    const context = useAppState()

    return useMutation({
        mutationFn: createPaymentDocumentDetail,
        mutationKey: ["create-payment-supporting"],
        onError: (error) => {
            console.log({ error })
            toast.error("Failed Save Payment & Supporting Data")
        },
        onMutate: () => {
            toast.loading("Loading...")
        },
        onSuccess: (response) => {
            toast.success("Successfully Save Payment & Supporting Data");
            queryClient.invalidateQueries({
                queryKey: ["get-payment-supporting", response.id]
            })
        }
    })
}

export default usePostPaymentSupporting;