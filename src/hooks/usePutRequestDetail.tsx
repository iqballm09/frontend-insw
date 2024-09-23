import { updateRequestDetail } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";

const usePutRequestDetail = () => {

    return useMutation({
        mutationFn: updateRequestDetail,
        mutationKey: ["update-request-detail"],
        onError: (error) => {
            console.log({error})
            toast.error("Failed Save Request Detail Data")
        },
        onMutate: () => {
            toast.loading("Loading...")
        },
        onSuccess: () => {
            toast.success("Successfully Save Request Detail Data");
        }
    })
}

export default usePutRequestDetail;