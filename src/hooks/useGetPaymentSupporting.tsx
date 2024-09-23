import { getPaymentDocumentDetail } from "@/utils/api"
import { useQuery } from "@tanstack/react-query"

const useGetPaymentSupporting = (id: number) => {
    return useQuery({
        queryKey: ["get-payment-supporting", id],
        queryFn: () => getPaymentDocumentDetail
    })
}

export default useGetPaymentSupporting;